---
title: "Beyond Vibe Coding: Building Semantic Search with Loop Engineering"
description: "How I replaced a title-only keyword search with real semantic search using embeddings - and let a self-verifying agent loop do the heavy lifting, without slipping into vibe coding."
keywords: "loop engineering, semantic search, embeddings, Transformers.js, CLIP, Nuxt, vibe coding, AI agents, vector search"
tags: ["AI", "TypeScript", "Productivity"]
reading_time: "9 min read"
cover_image: ""
---

# Beyond Vibe Coding: Building Semantic Search with Loop Engineering

I'm not a big fan of vibe coding. Handing an agent a vague wish and hoping the output compiles feels like gambling with my own codebase. But there's a disciplined cousin of vibe coding that I've come to respect - **loop engineering** - and it's genuinely good, both for quick prototyping and for shipping something you'd actually put in production.

The difference comes down to three things: a good prompt, strong context, and a *verifiable* goal that tells the loop when to stop. Get those right, and you stop being the person who prompts the agent turn by turn. You become the person who designs the system that does the prompting for you.

In this article I'll walk through how I used loop engineering to add real semantic search to this blog - search that understands meaning, not just matching letters in a title - and the lessons that only showed up once the loop was running.

## What Loop Engineering Actually Is

A normal chat with a coding agent is linear: you ask, it answers, you correct, it answers again. Loop engineering flips that. You write one detailed brief, hand the agent tools to act and observe, and let it cycle - intent, action, observation, adjustment - until a measurable goal is met.

The part people skip is the goal. "Make search better" is a wish, not a goal. A loop with a vague target either stops too early or never stops at all. A good finishing trigger looks more like this:

```markdown
The loop stops only when ALL of these pass:
- `yarn typecheck` is clean
- `yarn build` succeeds
- "firebase auth" returns the Firebase Auth article in the top 3
- "pastel keyboard" returns the Bubblegum keyboard in the top 3
- the existing recommendation APIs return byte-identical responses
```

Every line there is something a machine can check. That's what lets the loop grade itself and keep going without me babysitting it.

> The one rule I'd never break: the agent that writes the code shouldn't be the only one that grades it. A separate verifier - a different sub-agent, or a standalone script - keeps the loop honest.

## What We Were Building

The blog already had a recommendation engine. Each article carried a text embedding, and a small API returned the most similar articles using cosine similarity. I wrote about that in [an earlier article on building a recommendation engine for free](https://www.trpkovski.com/2025/03/24/create-a-recommendation-engine-with-ai-for-free), and later extended it to photos by blending two models in [Mixing Two AI Brains](https://www.trpkovski.com/2026/06/11/mixing-two-ai-brains-openclip-and-all-minilm-l12-v2-for-photo-recommendations).

But the actual site *search* was embarrassingly basic: a substring match on article titles. Search "firebase login" and you'd miss "Nest.js Authorisation with Firebase Auth" entirely, because the letters don't line up.

The goal was to replace that with semantic search across everything - articles, photos, keyboard builds, and the about page - where your query is turned into an embedding on the fly and compared against a pre-built index.

Here's what the loop ended up creating:

```
app/
├── components/
│   ├── SearchBar.vue            # the navbar input
│   └── SearchConsentModal.vue   # asks before downloading models
├── composables/
│   └── useSemanticSearch.ts     # the search brain
├── pages/
│   └── search.vue               # /search?q=... results page
└── utils/
    ├── build-search-index.ts    # build-time embedding generation
    └── cosine-similarity.ts
server/
├── api/
│   └── search-index.get.ts      # serves the embedding index
└── utils/
    ├── content-embeddings.json  # text embeddings (generated)
    └── visual-embeddings.json   # image embeddings (generated)
```

## Where Python Couldn't Follow

The photo recommendation engine runs OpenCLIP through Python at build time. My first instinct was to mirror that in the browser so the query could be embedded with the exact same model. I looked hard at [PyScript](https://pyscript.net/) to run Python client-side.

It doesn't work, for two blunt reasons: PyTorch isn't packaged for the browser runtime, and the OpenCLIP model I use weighs around 3.6 GB. Nobody is downloading that to run a search.

So I split the problem. The heavy OpenCLIP pipeline stays exactly where it is - server-side, at build time, powering photo recommendations. For *search*, I built a parallel, lighter index using models that run natively in the browser through Transformers.js:

- **Text:** `Xenova/all-MiniLM-L6-v2` - 384 dimensions
- **Images:** `Xenova/clip-vit-base-patch32` - 512 dimensions, around 150 MB

CLIP is the trick that makes cross-media search work. Its text encoder and image encoder share the same vector space, so I can embed your typed query with the text encoder and compare it directly against pre-computed *image* embeddings. Type "sunset" and photos of sunsets rank highly, even though you never typed a filename.

> I deliberately chose the smaller `base-patch32` over a larger CLIP. A friendlier first-search download beats a marginally better ranking that costs the visitor 400 MB.

## Embedding the Query in the Browser

The models download to the visitor's device, so I don't spring that on anyone. The first time you search, a consent modal explains what's about to happen, and the choice is remembered.

```typescript
const CONSENT_KEY = "semanticSearch.consent";

function readConsent(): "accepted" | "declined" | "unknown" {
    if (typeof window === "undefined") return "unknown";
    const value = window.localStorage.getItem(CONSENT_KEY);
    if (value === "accepted" || value === "declined") return value;
    return "unknown";
}
```

If you accept, Transformers.js downloads the models once and caches them. Here's something that confused me at first: **it does not use IndexedDB**. Transformers.js caches model weights in the browser's Cache Storage, under a bucket called `transformers-cache`. I even mislabelled it as IndexedDB in my own modal copy before checking. The only thing I put in localStorage is that one consent flag.

If you decline - or your device can't run the models - search quietly falls back to a keyword match over titles, descriptions and keywords. Nobody gets a broken search box.

## When the Loop's Verifier Isn't Enough

Here's the most useful lesson, and it's a humbling one.

My first ranking blended image and text similarity, then applied a relevance filter to cut the noise. To stop weak, off-topic results padding the page, I added an absolute score floor: anything below 0.25 was discarded. My verifier checks all passed. I shipped it mentally and moved on.

Then a real query broke it. Searching "bubblegum" - the literal name of one of my keyboards - returned **nothing**.

The reason is a genuine property of embeddings: they're bad at proper nouns. "Bubblegum" as a word embeds towards candy and sweetness, while the keyboard's text is all switches, keycaps and gasket mounting. The honest semantic similarity was 0.187 - a legitimate match, sitting just under my 0.25 floor. My noise filter was eating the exact result the user wanted.

The fix is what production search engines have done for years: combine the semantic score with a **lexical** one. If your query words literally appear in the title or keywords, that document gets a boost.

```typescript
const LEXICAL_WEIGHT = 0.4;
const MIN_TOKEN_LEN = 3;

function lexicalScore(query: string, title: string, haystack: string): number {
    const tokens = query
        .toLowerCase()
        .split(/\s+/)
        .filter((t) => t.length >= MIN_TOKEN_LEN);
    if (tokens.length === 0) return 0;

    const lowerTitle = title.toLowerCase();
    let titleHits = 0;
    let bodyHits = 0;
    for (const token of tokens) {
        if (lowerTitle.includes(token)) titleHits++;
        if (haystack.includes(token)) bodyHits++;
    }
    return 0.6 * (titleHits / tokens.length) + 0.4 * (bodyHits / tokens.length);
}
```

Then the final score is a weighted blend of meaning and words:

```typescript
const score = (1 - LEXICAL_WEIGHT) * semantic + LEXICAL_WEIGHT * lexical;
```

With that, "bubblegum" jumps from 0.187 to 0.51 and lands at rank one - and "firebase" still returns only articles, no stray photos or keyboards. The real lesson wasn't about search at all: **my verifier only tested the queries I thought of.** A loop is exactly as smart as the checks you give it. So "bubblegum" and "bubble gum" and "lemon milk" became permanent checks in the verifier.

## The Gotcha That Only Production Surfaces

One more trap worth naming. This blog is deployed as a fully static site - `nuxt generate` builds it, and the static files are served from a CDN. There's no live server in production.

That matters because my new `/api/search-index` endpoint worked perfectly in local development, where a real server runs. In a static deploy, an API route only exists if it's been *prerendered* into a file at build time. Mine hadn't been, so it would have returned a 404 in production and quietly broken the whole feature.

The fix was one line - adding the route to the prerender list so the build bakes it into a static JSON file:

```typescript
return [...routes, ...apiRoutes, ...photoApiRoutes, "/api/search-index"];
```

The lesson: a local verifier that passes is not the same as a production build that passes. When I ran a real `nuxt generate`, the missing file was obvious. It's worth making your finishing trigger build the way production builds.

## What's Good and What's Not So Good About Loop Engineering

### What's Good

- You write the brief once and get back a working, self-checked feature instead of a pile of suggestions.
- Verifiable goals force you to think clearly about what "done" actually means - that alone improves the work.
- A separate verifier catches regressions in the parts you told it never to touch.

### What's Not So Good

- The loop is only as good as your checks. Blind spots in your verifier become blind spots in the product, as "bubblegum" proved.
- It can happily pass every local check and still ship a production bug if your environment differs.
- You still have to understand the code afterwards. If you can't review it, you don't own it - you're just hoping.

## Conclusion

Loop engineering didn't replace my judgement - it amplified it. The moments that mattered weren't the ones where the loop churned out code. They were the ones where I had to decide what "correct" meant: which model to run in the browser, where the score floor should sit, which queries deserved to be permanent checks.

That's the real distinction from vibe coding. Vibe coding outsources the thinking. Loop engineering outsources the *typing* and keeps the thinking firmly with you. The verifier is where your judgement lives, encoded as something a machine can enforce - and a feature is only ever as trustworthy as the checks standing behind it.

Build the loop. Just make sure you're still the engineer holding the checklist, not the person pressing go and looking away. Happy coding! 🚀

## Further Reading

- [Create a Recommendation Engine with AI for Free](https://www.trpkovski.com/2025/03/24/create-a-recommendation-engine-with-ai-for-free) - 24th March 2025
- [Mixing Two AI Brains: OpenCLIP and all-MiniLM-L12-v2 for Photo Recommendations](https://www.trpkovski.com/2026/06/11/mixing-two-ai-brains-openclip-and-all-minilm-l12-v2-for-photo-recommendations) - 11th June 2026
- [Automating My Blog Workflow with GitHub Copilot SDK](https://www.trpkovski.com/2026/02/08/automating-my-blog-workflow-with-github-copilot-sdk) - 8th February 2026
