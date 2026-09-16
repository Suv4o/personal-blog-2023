---
name: update-article
description: Revise an already-published blog article under content/YYYY/MM/DD/ and stamp it with an "updated" date. Use when the user asks to update, revise, refresh, correct or re-verify an existing article, says something in a published post is out of date or wrong, or asks to add an updated date to an article. Handles the `updated` frontmatter field, the ::article-updated banner, fact verification, and the post-update checks.
argument-hint: "[path or slug of the published article]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, WebFetch, WebSearch
---

# Update a Published Article

Revise an article that is already live and make the revision visible to readers and to search engines.

Use `convert-article` for a brand new draft. Use this skill when the article already exists under `content/YYYY/MM/DD/`.

## Inputs

- If `$ARGUMENTS` is a path or a slug, that is the article.
- Otherwise ask which article to update. Do not guess.

Never change the `published` date, the folder path, or the filename. The URL is permanent — readers, search engines and the audio summary CDN path all depend on it.

## Step 1 — Establish what is actually true now

Updates exist because the world changed, so the research is the job, not a formality.

- Verify every claim you are about to change against a **primary source**: official docs, the specification, the package's own README/CHANGELOG, or `npm view <pkg> version`. Third-party blog posts and tutorials go stale in exactly the same way the article did — don't launder a stale claim through one.
- Check the repo too. If the article describes code in this blog, read that code. An article claiming "here's how I did it" must match what is actually in `app/`.
- Write down what changed before writing prose. Each item should be: the old claim, the new fact, the source.

If research contradicts something the user told you, say so and cite the source rather than writing it up either way.

## Step 2 — Add the `updated` frontmatter field

`updated` is optional in `content.config.ts` — articles without it behave exactly as before.

```yaml
published: 8th March 2026
updated: 16th September 2026
```

Same ordinal format as `published`: day with ordinal suffix, full month, full year (`st` for 1/21/31, `nd` for 2/22, `rd` for 3/23, `th` otherwise). Use today's date unless the user names another.

Setting `updated` automatically:

- renders the "Updated <date>" badge (see Step 3),
- emits `<meta property="article:modified_time">` with the ISO date from `app/pages/[...slug].vue`,
- exposes `updated` through the blog's WebMCP `search_articles` / `get_article` tools.

Also revisit the rest of the frontmatter while you are there: `description` and `keywords` should reflect the new content, and `readTime` should be re-estimated if the article grew or shrank by more than a minute (~200 words per minute of prose, code blocks at about half weight).

## Step 3 — Add the `::article-updated` banner

Immediately **after the landing image**, just before the article's opening paragraph. It goes below the header block (byline, tag pills, audio player) and the hero image — not above them:

```markdown
![Landing Image](https://res.cloudinary.com/.../hero-image)

::article-updated{:date="updated"}
One short paragraph telling the reader what changed and whether it matters to them.
::

The article's opening paragraph starts here.
```

- `{:date="updated"}` binds to the frontmatter field — leave it exactly as written. The component renders nothing when `updated` is absent.
- The body is an optional slot. Markdown works inside it (inline code, links, bold).
- Write the note for someone who read the original: lead with what is no longer true. "The API moved from X to Y" beats "this article has been updated for accuracy".
- Keep it to one paragraph. A long changelog belongs in the article body.

Never place `::article-updated` between `::tag-pills` and its closing `::` — the audio generation script (`scripts/index.ts`) injects the audio player straight after that block.

## Step 4 — Rewrite the content

- Fix the substance, not the voice. The author's phrasing, structure and headings stay unless the facts force a change.
- **Correct the old advice out loud where a reader may have acted on it.** If the original told people to do something that is now wrong, say so in a short callout rather than quietly deleting it — someone has that setup running.
- Keep every existing formatting convention: external links as raw `<a href="..." target="_blank" rel="noopener noreferrer">`, internal links as `<NuxtLink to="/YYYY/MM/DD/slug">`, Cloudinary images at `w_750` inline / `w_1200` in frontmatter.
- Don't rename headings that other articles or external sites may deep-link to unless the heading is now wrong.

## Step 5 — Verify

Run all of these and fix anything that fails:

- `yarn typecheck` passes.
- `grep -n "](http" content/YYYY/MM/DD/<slug>.md` returns nothing outside code blocks.
- No `{{$document` or `::` markers leak into the rendered output.
- `yarn dev`, then load the article and confirm the badge renders, the note reads correctly, and code blocks/tables are intact. Check `article:modified_time` is in the HTML:
  ```bash
  curl -s http://localhost:3000/YYYY/MM/DD/<slug> | grep -o '<meta property="article:modified_time"[^>]*>'
  ```
- Load one article **without** `updated` and confirm no badge appears.

## Step 6 — Report

Tell the user:

- What factual claims changed, and the source for each.
- Anything in the repo that is now inconsistent with the article (stale dependency, old code path) — updating the article does not fix the code.
- Other articles that repeat the same stale claim and may need the same treatment (`grep -rl "<stale term>" content/`).
- That the audio summary still describes the **old** version. `scripts/index.ts` skips files that already have audio, so regenerating needs `scripts/regenerate-audio.ts`. Ask before regenerating — it costs OpenAI credits.
