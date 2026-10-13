---
title: Is Jev Just Hype, or a Genuinely Different Kind of AI?
description: "Is Jev a game changer or just a classifier? I spent a week building something to try it out: a solution to a real problem of my own, an EV charging-stop planner. Based on the driver's situation and needs, plus their battery level and arrival time, Jev picks the charger on their route that fits best - all in a single request, in about 300ms, for about $0.0002. That's incredible."
image: https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_1200,e_sharpen:100/v1791364244/blog/is-jev-just-hype-or-a-genuinely-different-kind-of-ai/cover-img_y72bjg
keywords:
    - Jev
    - TypeSafe AI
    - is Jev hype
    - System One models
    - non-generative AI
    - transformer architecture
    - autoregressive
    - RLCD
    - calibrated decisions
    - typed decisions
    - Open Charge Map
    - EV charging
    - electric vehicle
    - charger finder
    - TypeScript
    - Next.js
    - OpenRouter
    - MapLibre
    - OSRM
    - structured output
    - classifier
    - LLM alternative
    - Diogo Almeida
    - RLHF
    - Tesla Supercharger
type: page
blog: post
published: 14th October 2026
readTime: 14
author: Aleksandar Trpkovski
articleTags:
    - AI
    - TypeScript
    - Tech
---

# Is Jev Just Hype, or a Genuinely Different Kind of AI?

_{{$document.published}} • {{$document.readTime}} min read — by **[{{$document.author}}](/)**_

::tag-pills{:tags="articleTags"}
::

![Landing Image](https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_750,e_sharpen:100/v1791364244/blog/is-jev-just-hype-or-a-genuinely-different-kind-of-ai/cover-img_y72bjg)

By now, you've probably heard of Jev, a model TypeSafe AI released on 15 September 2026. It doesn't generate text. Instead, it answers structured questions - choosing one of several options, scoring against a rubric, or answering yes or no - in roughly 70 to 500 milliseconds, according to TypeSafe.

Within days, the internet was full of fun demos: a self-driving simulator, a Minecraft bot, Tetris and other self-playing arcade games. There's even a <a href="https://github.com/hellogumbo/awesome-jev" target="_blank" rel="noopener noreferrer">community directory</a> listing more than a thousand Jev projects. A very fun time to be alive 😀

You've probably also seen the debate around it. Some people call it a game changer, while others roll their eyes and say, "It's a classifier - we've had those forever."

I wanted to find out whether Jev is just more hype or a genuinely different kind of model, so I spent a week building a real project with it. This article covers what I found: what Jev is, why its architecture matters, why you don't always need an LLM, and how to use it.

## Who Built This

Jev comes from TypeSafe AI. One of its co-founders is Diogo Almeida, who previously worked at OpenAI and was one of the key contributors to RLHF (reinforcement learning from human feedback) - the training technique behind InstructGPT and ChatGPT.

## System One and System Two

TypeSafe calls Jev a "System One" model. But what does that actually mean? 🤔 And if there's a System One, is there a System Two? There is.

The names are borrowed from Daniel Kahneman's _Thinking, Fast and Slow_, a bestselling 2011 psychology book about the two mental systems that drive how we think, make choices and judge risk. System One is the fast, automatic judgement you make without deliberating - recognising a face, catching a ball, knowing that a sentence sounds annoyed. System Two is the slow, effortful reasoning: long division, planning a route, writing an essay.

So what does that mean for AI models?

LLMs are System Two machines, and they're extraordinary at it. But we've been using them for System One work because they were the only thing available.

Jev is a System One model. It doesn't generate text. It evaluates a situation and returns decisions.

### How a Transformer Answers You

When we ask an LLM to classify something, it doesn't decide in a single step. It predicts the next token, feeds that token back in, and predicts the one after it. This repeats until the response is complete.

Asking for a response such as `{"priority": "safety"}` means generating roughly a dozen tokens, one at a time, each waiting for the one before it. This is called autoregressive generation, and it's inherently sequential: token five can't be computed until token four exists.

That makes it slow, because it runs in a loop, and expensive, because you pay for every generated token. And although today's LLMs are much better at it, they can still produce malformed JSON.

### How Jev Answers You

Jev works differently. You give it a **state** - the thing to judge - and a **map of questions**. It evaluates them all at once and returns the answers.

There's no token loop and no generated text. Instead, Jev returns a probability distribution over the options you provided, and it structurally cannot return an option you didn't give it.

The practical consequences are significant:

- **It's fast.** In my demo, most requests came back in about 250 to 370ms. The odd cold start took longer.
- **Output tokens are free.** You pay $0.042 per million input tokens and nothing for output. There's almost no output to charge for.
- **There's no parsing step.** No JSON mode, no schema validation, no retries for malformed output. There's nothing to malform.
- **Adding questions is nearly free.** Questions are evaluated in parallel, so adding more usually has little effect on response time. My app asks 28 in a single request.

The training method is called RLCD (Reinforcement Learning for Calibrated Decisions), and the claim is that its confidence scores are genuinely calibrated. It's worth noting that there's no published paper on it, only a documentation page. I'm reporting the claim, not endorsing it.

## The Three Question Types

Jev supports three types of questions. Let's look at an example of each and how they differ. The examples come from the project I built for this article - an EV charging-stop planner - which I'll walk through straight after.

Before we begin, you'll need two npm packages, Node.js 20 or later, and an API key.

```bash
npm install @typesafe-ai/sdk dotenv
```

```ts
// src/lib/jev/client.ts
import { TypeSafeClient } from "@typesafe-ai/sdk";

export function createJevClient(): TypeSafeClient {
    const apiKey = process.env["OPENROUTER_API_KEY"];
    if (apiKey === undefined || apiKey.trim() === "") {
        throw new Error("OPENROUTER_API_KEY is not set");
    }

    return new TypeSafeClient({
        apiKey,
        // No /v1 here. The SDK appends /v1/systemone itself.
        baseURL: "https://openrouter.ai/api",
        // Pin the model. The SDK default is `jev-latest`, which floats.
        defaultModel: "typesafe/jev-1.13",
    });
}
```

A quick side note: I went through <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer">OpenRouter</a> rather than TypeSafe directly, because TypeSafe's console wasn't accepting new accounts when I started. Billing came out at exactly the same rate - no reseller margin.

All the examples below use this client:

```ts
const jev = createJevClient();
```

### Noul - a yes/no probability

A Noul asks a yes-or-no question and returns one number between 0 and 1.

```ts
import { noul } from "@typesafe-ai/sdk";

const { answers } = await jev.systemOne({
    state: "I'm at 12% and I need to get to Geelong, kid's in the car.",
    questions: {
        travelling_with_others: noul("Is the driver travelling with other people?"),
    },
});

console.log(answers.travelling_with_others.noul); // 0.96
```

0.96 means almost certainly yes, and 0.5 would mean Jev has no idea. Unlike the other two types, a Noul has no separate confidence value - the number is both the answer and how sure Jev is.

### Choice - pick one from a set you supply

```ts
import { choice } from "@typesafe-ai/sdk";

const { answers } = await jev.systemOne({
    state: "I'd rather not stop somewhere sketchy, kid's in the car.",
    questions: {
        priority: choice("What matters most to this driver, from what they said?", {
            speed: "Wants to charge as fast as possible and get going again",
            safety: "Wants somewhere well lit, busy, staffed or otherwise reassuring",
            cost: "Wants the cheapest option, or has mentioned money",
            amenities: "Wants food, a toilet, or somewhere to wait while it charges",
            reliability: "Wants somewhere they can be confident will actually work",
            none_of_these: "The driver expressed no particular preference",
        }),
    },
});

console.log(answers.priority.choice); // "safety"
console.log(answers.priority.confidence); // 1.00
console.log(answers.priority.probabilities); // { safety: 1.00, speed: 0.00, ... }
```

> **Always include a `none_of_these` option.** A Choice is forced to pick from what you give it, so without an escape hatch it will confidently name a preference in a sentence that expressed none.

Notice that you get the full probability distribution, not just the winner. That turns out to be the most useful part, as you'll see later.

### Score - rate against an ordered rubric

```ts
import { score } from "@typesafe-ai/sdk";

const { answers } = await jev.systemOne({
    state:
        "Driver: It's late, I'm at 9% and I've got my kid asleep in the back. " +
        "I don't want to stop anywhere dodgy. " +
        "Charger: Exeter, Tasmania. Notes: 24/7 - drive next to Police Station",
    questions: {
        suits: score("Given what the driver said, how well does this charger suit them?", [
            "The notes actively warn against it for this driver, or describe something they said they did not want",
            "It would do, but there is a caveat in the notes this driver would mind",
            "Nothing in the notes counts against it for this driver",
            "The notes describe something this driver specifically asked for",
        ]),
    },
});

console.log(answers.suits.score); // 2.84
console.log(answers.suits.confidence); // 0.84
```

A Score takes an ordered rubric - here four levels, numbered 0 to 3. Jev doesn't pick one level. It gives each level a probability, and the score is what you get when you multiply each level's number by its probability and add them up:

```plain
level  meaning                    probability   level × probability
  0    warns against it              0.00         0 × 0.00 = 0.00
  1    would do, with a caveat       0.02         1 × 0.02 = 0.02
  2    nothing counts against it     0.11         2 × 0.11 = 0.22
  3    what the driver asked for     0.87         3 × 0.87 = 2.61
                                                     score ≈ 2.85
```

Level 0 always adds nothing, because its number is zero - but its probability still matters. Any probability Jev puts on level 0 is probability that isn't on the higher levels, so it pulls the score down. Split it 50/50 between level 0 and level 3, and the score drops to 1.5.

The total comes to 2.85 rather than the 2.84 Jev reported because the API rounds each probability to two decimals.

The confidence of 0.84 tells you how lopsided that spread is. One tall bar means Jev is sure; a flat spread means it's torn.

So the score tells you _where_ the answer sits, and the confidence tells you _how sure_ Jev is about it. In practice, treat the score as a pass mark rather than a precise measurement: my app rules out any charger that scores below 1.6.

## The Charger Problem

Since I <NuxtLink to="/2026/09/15/did-you-know-you-can-control-your-tesla-car-from-your-macbook">bought my Tesla Model Y</NuxtLink>, charging has been on my mind a lot. So I wanted a demo that showed off Jev while solving a practical, real-world problem: an EV charging-stop planner. You describe your situation in a sentence, add your battery level and arrival time, and it finds the charger on your route that best matches what you need.

To do this, I used <a href="https://openchargemap.org" target="_blank" rel="noopener noreferrer">Open Charge Map</a>, a non-profit registry with a free API key and genuinely good coverage of Australian EV chargers. Before building anything, I pulled every Australian record - **1,367 of them** - and measured what data was actually there.

| Field                  | Coverage |
| ---------------------- | -------- |
| Latitude and longitude | **100%** |
| Number of points       | 99.6%    |
| Usage type             | 99.9%    |
| Operator info          | 98.9%    |
| Connection power (kW)  | 97.7%    |

These fields are consistent and reliable. The problem is the free-text fields, which often contain useful information that isn't captured anywhere in the structured data. Take time restrictions - 91 Australian sites have their opening hours written only in prose:

```plain
Only powered during cafe business hours
open 10am to 4pm We have coffee and a lovely Garden to enjoy whle you charge.
Evening peak 68c kWh (5:00pm to 10:00pm) Standard 59c kWh (all other times)
Monday to Thursday 5:00am - 12:30am Friday & weekends 5:00am - 2:00am
24/7 - drive next to Police Station
```

A driver sent to "Only powered during cafe business hours" at 9pm finds a dead charger, even though every structured field says it's fine.

Pricing is also free text, in at least five incompatible formats:

```plain
Free · FREE · $0.45 per kWh · 55c/kWh · $0.30/kWh
AUD 0.42/kWh;other tariffs for older cars
$0.40 per kWh. Parking overstay charges may apply
```

That's the shape of the problem. Half the data is arithmetic; the other half is English. And the English half is what ruins your evening 😅

## How I Built the App

The app is a small Next.js project. You enter a sentence, choose your trip's start and end, set your battery percentage and arrival time, and it tells you where to stop and why that charger is the best choice. The map uses <a href="https://maplibre.org" target="_blank" rel="noopener noreferrer">MapLibre</a> with <a href="https://openfreemap.org" target="_blank" rel="noopener noreferrer">OpenFreeMap</a> tiles and <a href="https://project-osrm.org" target="_blank" rel="noopener noreferrer">OSRM</a> routing - all free, with no keys required. The full source code is in the <a href="https://github.com/Suv4o/ev-charger-jev" target="_blank" rel="noopener noreferrer">GitHub repo</a> if you want to see how it all fits together.

![The Charging-Stop Planner](https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_850,e_sharpen:100/v1791364242/blog/is-jev-just-hype-or-a-genuinely-different-kind-of-ai/app-overview_bj14dn)

Here's how the app narrows Australia's chargers down to one recommendation:

```plain
1,367 chargers in Australia
   ↓  keep the ones in a box around your journey
  148 candidates (Melbourne to Geelong)
   ↓  drop anything not operational
   ↓  drop anything you can't reach on your current charge
   ↓  sort by total added time and keep the best 8
    8 shortlisted  →  this is all Jev ever sees
   ↓  one Jev request
    1 recommendation
```

These are the decisions behind the shortlist:

- **Derate the range by 0.8.** The app assumes a 500km car, so at 8% battery it can travel 40km on paper - or 32km after derating, to allow for highway speed, cold batteries and air conditioning.
- **Keep a 15% reserve.** A charger must be within 85% of the remaining range (about 27km at 8%), so you never arrive on zero.
- **Treat an unknown operational status as not working.** It's better to skip a charger than send someone to a dead one.
- **Sort by total added time, not distance.** That's detour driving plus charging time, so an 11kW socket on your route doesn't beat a 250kW charger two minutes off it.
- **Put chargers with unknown power last.** An unknown isn't a zero.

### What the App Asks Jev

For the eight shortlisted chargers, the app sends one request with 28 questions:

| Question                                | Type   | How often   |
| --------------------------------------- | ------ | ----------- |
| What matters most to this driver?       | Choice | once        |
| Is the driver travelling with others?   | Noul   | once        |
| Do they want somewhere to wait or eat?  | Noul   | once        |
| How well does this charger suit them?   | Score  | per charger |
| Do the notes limit when it can be used? | Noul   | per charger |
| What do the cost notes amount to?       | Choice | per charger |
| Which charger suits them best?          | Choice | once        |

Two simple rules then turn the answers into a verdict. A charger is **ruled out** if its "suits" score is below 1.6, or if its notes describe limited hours and you'd arrive after dark. From the chargers that pass, the winner is the one Jev's final Choice gave the highest probability. Code filters and rules things out, but it never picks the winner - that's always Jev.

## Jev Can't Count

Jev can't count or do arithmetic, and it reads dates as text rather than as ordered quantities.

So the rule is simple: never hand Jev raw numbers and expect it to do maths with them. Let the code do the arithmetic, then pass the conclusion to Jev in plain English. Jev can then make the judgement.

I learned this the hard way. At first, Jev was choosing poorly when asked for the "fastest" charger - I'd kept all the numbers away from it, so nothing told it which charger was fast. So I turned the numbers into words:

```ts
// src/lib/jev/questions.ts
export function speedBand(kw: number | null): SpeedBand | null {
    if (kw === null) return null;
    if (kw >= 150) return "very fast charging";
    if (kw >= 50) return "fast charging";
    if (kw >= 22) return "moderate charging";
    return "slow charging";
}

export function detourBand(km: number): DetourBand {
    if (km < 0.5) return "right on your route";
    if (km < 2) return "barely off your route";
    if (km < 8) return "a short detour";
    return "a real detour";
}
```

Each threshold lives in code and is applied before Jev sees anything. `250 kW` becomes `"very fast charging"`, `0.7 km` becomes `"barely off your route"`, and a verification date becomes `"confirmed working in the last few months"`.

## What Jev Actually Sees

Here's the complete state from one real request - scenario E from the examples below, a driver on 8% who wants the fastest charger. Code has already picked the eight chargers and turned every number it calculated into words. The only figures left are in the driver's own sentence and in notes people wrote, which pass through as they are:

```json
{
    "driver_said": "Only 8% left and I need to be in Geelong. Absolute fastest charger, I cannot wait around.",
    "arriving": "around dusk",
    "options": [
        {
            "id": 504658,
            "name": "Laverton Supercharger",
            "run_by": "Tesla (including non-tesla)",
            "charging": "very fast charging",
            "position_on_route": "barely off your route",
            "how_long": "you would barely have to stop",
            "last_confirmed": "confirmed working in the last few months",
            "access_note": null,
            "site_note": null,
            "cost_note": null,
            "driver_reports": [],
            "membership": "requires an account or app with the network"
        },
        {
            "id": 308750,
            "name": "Tesla Supercharger South Melbourne",
            "run_by": "Tesla (Tesla-only charging)",
            "charging": "very fast charging",
            "position_on_route": "barely off your route",
            "how_long": "you would barely have to stop",
            "last_confirmed": "not confirmed for over a year",
            "access_note": null,
            "site_note": null,
            "cost_note": null,
            "driver_reports": [],
            "membership": "requires an account or app with the network"
        },
        {
            "id": 210897,
            "name": "Ampol Foodary Altona North",
            "run_by": "Ampol AmpCharge",
            "charging": "very fast charging",
            "position_on_route": "barely off your route",
            "how_long": "you would barely have to stop",
            "last_confirmed": "not confirmed for about 3 years",
            "access_note": null,
            "site_note": "4 bays – 2 x CCS2, 2 x CHAdeMO All 180kW DC. (Note: Max 80kw for Tesla model Y/3 as Ampol’s charger has current limit of 200A. 200A x 400V(Tesla’s battery voltage) = 80kw. Ioniq 5 could get 200A x 800v = 160kw) http://ampcharge.ampol.com.au",
            "cost_note": "$0.60/kWh for pay-as-you-go charging.",
            "driver_reports": [],
            "membership": "requires an account or app with the network"
        },
        {
            "id": 270950,
            "name": "JET Charge Office",
            "run_by": "Chargefox",
            "charging": "fast charging",
            "position_on_route": "right on your route",
            "how_long": "a few minutes plugged in",
            "last_confirmed": "not confirmed for about 3 years",
            "access_note": null,
            "site_note": "Open to public for product testing, and may be taken offline at any time",
            "cost_note": "AUD 0.60 per kWh",
            "driver_reports": [],
            "membership": "requires an account or app with the network"
        },
        {
            "id": 308228,
            "name": "Toyota Altona",
            "run_by": "Chargefox",
            "charging": "fast charging",
            "position_on_route": "barely off your route",
            "how_long": "a few minutes plugged in",
            "last_confirmed": "not confirmed for over a year",
            "access_note": null,
            "site_note": null,
            "cost_note": null,
            "driver_reports": [],
            "membership": "requires an account or app with the network"
        },
        {
            "id": 210898,
            "name": "Hobsons Bay Civic Centre",
            "run_by": "Chargefox",
            "charging": "fast charging",
            "position_on_route": "right on your route",
            "how_long": "a few minutes plugged in",
            "last_confirmed": "not confirmed for about 3 years",
            "access_note": "Cannot be seen from the main road. Drive to the car park at the back of the council building, next to Altona Bowling Club.",
            "site_note": "30 minute parking zone.",
            "cost_note": "Free",
            "driver_reports": [],
            "membership": "open to anyone"
        },
        {
            "id": 267315,
            "name": "Ampol Derrimut",
            "run_by": "Ampol AmpCharge",
            "charging": "very fast charging",
            "position_on_route": "a short detour",
            "how_long": "you would barely have to stop",
            "last_confirmed": "not confirmed for about 3 years",
            "access_note": null,
            "site_note": null,
            "cost_note": "$0.60/kWh for pay-as-you-go charging.",
            "driver_reports": [],
            "membership": "requires an account or app with the network"
        },
        {
            "id": 270949,
            "name": "RMIT - City Campus",
            "run_by": "Chargefox",
            "charging": "fast charging",
            "position_on_route": "barely off your route",
            "how_long": "a few minutes plugged in",
            "last_confirmed": "not confirmed for about 3 years",
            "access_note": null,
            "site_note": null,
            "cost_note": "AUD 0.30 per kWh",
            "driver_reports": [],
            "membership": "requires an account or app with the network"
        }
    ]
}
```

The final Choice uses each charger's `id` as an option, so Jev answers with an id. Here's the probability distribution it returned:

```plain
choice: "504658"   confidence: 0.97

  0.98   250kW  Laverton Supercharger
  0.02   180kW  Ampol Foodary Altona North
  0.00    50kW  Hobsons Bay Civic Centre
  0.00   180kW  Ampol Derrimut
  0.00    75kW  RMIT - City Campus
  0.00    80kW  JET Charge Office
  0.00    75kW  Toyota Altona
  0.00   250kW  Tesla Supercharger South Melbourne   ← also 250kW
  0.00          none_of_these
```

Look at the two 250kW Superchargers. On everything "fastest" depends on - charging speed, position on the route, time plugged in - Jev was given identical words. Yet Laverton got 0.98 and South Melbourne got nothing.

Only two fields differ: South Melbourne is "Tesla-only charging", and it hasn't been confirmed working for over a year. Jev doesn't explain itself, so I tested each difference on its own. Opening South Melbourne to all cars barely changed its score. Marking it as recently confirmed lifted its score from about 0.9 to about 1.7 - straight past the pass mark. Change both, and it finally gets a real share of the vote, around 0.2.

So code supplied the facts, in words, and Jev decided which of them mattered for this driver. That division of labour is what the whole app is built on.

## Five Examples

Same journey - Melbourne CBD to Geelong - with only the sentence, the battery and the clock changing. I ran each one three times, and the winner was the same every time.

|       | What do you need?                                                                                                 | Battery | Arriving |
| ----- | ----------------------------------------------------------------------------------------------------------------- | ------- | -------- |
| **A** | `I'm at 9% heading to Geelong with my kid asleep in the back. It's late and I don't want to stop anywhere dodgy.` | 9%      | 21:30    |
| **B** | `On 12% heading to Geelong late morning. We need a toilet and somewhere to grab food while it charges.`           | 12%     | 11:00    |
| **C** | `Heading to Geelong, no rush at all. Just find me the cheapest place to plug in.`                                 | 45%     | 14:30    |
| **D** | `Early run to Geelong on 15%. I've been burnt by a dead charger before, I need one that definitely works.`        | 15%     | 06:30    |
| **E** | `Only 8% left and I need to be in Geelong. Absolute fastest charger, I cannot wait around.`                       | 8%      | 17:45    |

And here's what came back:

|       | Read as       | Winner                                     | Jev's probability |
| ----- | ------------- | ------------------------------------------ | ----------------- |
| **A** | `safety`      | Laverton Supercharger · 250kW              | 0.92              |
| **B** | `amenities`   | Ampol Foodary Altona North · 180kW         | 0.80              |
| **C** | `cost`        | Hobsons Bay Civic Centre · 50kW · **free** | 0.92              |
| **D** | `reliability` | Laverton Supercharger · 250kW              | 1.00              |
| **E** | `speed`       | Laverton Supercharger · 250kW              | 0.98              |

Each request cost about $0.00019, so all five searches together came to about a tenth of a cent.

### Why Each Charger Won

**A - Safety (9%, arriving 21:30, after dark)**

![Scenario A: A Safety Request at 9:30pm](https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_850,e_sharpen:100/v1791364242/blog/is-jev-just-hype-or-a-genuinely-different-kind-of-ai/scenario-a-safety_c5y2nu)

Jev read this as a safety request with full confidence, and picked up the passenger too (0.97 on "travelling with others"). At 9%, the car can safely reach only about 31km, so all eight shortlisted chargers are fast ones - 50kW or more.

The chargers with written notes didn't pass. Hobsons Bay Civic Centre "cannot be seen from the main road", and you have to "drive to the car park at the back of the council building" - not what you want at 9:30pm with a child asleep in the back. JET Charge Office "may be taken offline at any time". Both scored well below the 1.6 pass mark (0.82 and 0.58).

Laverton Supercharger won with 0.92. One honest caveat: nobody has written anything about the site itself, so Jev chose it from what code told it - very fast, barely off your route, recently confirmed, open to all cars - and the app's card says exactly that.

**B - Amenities (12%, arriving 11:00)**

![Scenario B: An Amenities Request](https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_850,e_sharpen:100/v1791364243/blog/is-jev-just-hype-or-a-genuinely-different-kind-of-ai/scenario-b-amenities_nwoldr)

Jev read this as an amenities request and was almost certain the driver wants somewhere to wait (0.97). Ampol Foodary Altona North won with 0.80, and it was the only charger to pass at all. It's also the only option on the list that's obviously a service station - the name gives it away.

Laverton, which wins three of the other scenarios, was ruled out here (1.48). A bare Supercharger is a fine place to plug in, but not to feed a family.

**C - Cost (45%, arriving 14:30)**

![Scenario C: A Cost Request](https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_850,e_sharpen:100/v1791364243/blog/is-jev-just-hype-or-a-genuinely-different-kind-of-ai/scenario-c-cost_uf0apg)

With 45% battery, the car can reach about 153km, so slower, cheaper chargers make the shortlist for the first time. Jev sorted each cost note into a band: "Free" as free, "$0.24/kWh" and "$0.31/kWh" as cheap, and "AUD 0.60 per kWh" as typical.

Hobsons Bay Civic Centre won with 0.92, because it's free. The note that ruled it out in scenario A ("cannot be seen from the main road") doesn't matter to someone charging in daylight who only cares about price. GET Electric Head Office ($0.24/kWh) and Lorbek Luxury Cars ($0.31/kWh) also passed as cheap alternatives.

**D - Reliability (15%, arriving 06:30, before sunrise)**

![Scenario D: A Reliability Request](https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_850,e_sharpen:100/v1791364243/blog/is-jev-just-hype-or-a-genuinely-different-kind-of-ai/scenario-d-reliability_sjftf8)

"I've been burnt by a dead charger before" never uses the word "reliable", but Jev read it as a reliability request with full confidence.

This one comes down to a single field. Laverton is the only charger in reach that was confirmed working in the last few months. Every other one hasn't been confirmed in over a year, and most not in about three. Jev gave Laverton 1.00 and ruled out the other seven, all of which scored below 1.0.

**E - Speed (8%, arriving 17:45, around dusk)**

![Scenario E: A Speed Request](https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_850,e_sharpen:100/v1791364243/blog/is-jev-just-hype-or-a-genuinely-different-kind-of-ai/scenario-e-speed_c0t8r4)

With 8% left, the car can safely reach only about 27km, so the shortlist is fast chargers close to Melbourne.

Laverton won with 0.98. The interesting one is Ampol Foodary: a 180kW charger, but its notes say it's capped at 80kW for a Tesla Model Y or 3 because of a 200A current limit. For a driver who "cannot wait around", that caveat counts, and it was ruled out (0.87). Tesla Supercharger South Melbourne - just as fast on paper - got nothing, for the reasons in the previous section.

### The Flips

The most telling part is that the same charger gets opposite verdicts from identical data, depending only on what the driver asked for:

- **Laverton Supercharger** wins A, D and E, but is ruled out in B and C. It's right for safety, reliability and speed, and wrong for a family who want lunch or a driver hunting for the cheapest price.
- **Ampol Foodary** wins B, and is ruled out in every other scenario it appears in. A service station is right for food, and wrong when its notes say you'll charge slower than the sign suggests.
- **Hobsons Bay Civic Centre** is ruled out in A and wins C. "Cannot be seen from the main road" matters at 9:30pm, and doesn't matter for a cheap daytime top-up.

## What's Good About Jev

- **Genuinely fast.** Most requests came back in about 250 to 370ms.
- **Cheap enough to stop thinking about.** Output is free; input is $0.042 per million tokens.
- **No formatting failures, structurally.** There's no JSON to malform and no enum value to invent.
- **The type inference is real.** Answers are typed from the request. No schema, no validator, no codegen.
- **Fan-out is nearly free.** Adding questions barely changes how long a request takes - my app asks 28 at once.
- **You get probabilities, not just answers.** The full distribution is where the interesting detail is.

## What's Not So Good

- **It can't generate anything.** Not a summary, not an explanation, not a sentence. If you need words, you need an LLM.
- **It can't count, calculate or compare dates.** Keep all three in code, then hand over the conclusion in English, as I did in this project.
- **It gives you no reasoning.** You get probabilities, not explanations. Working out why it chose something means testing it, the way I did with the two Superchargers.
- **The answer space must be closed.** You have to know the options in advance.

## So, Hype or Not?

Both, depending on which claim you're checking.

The sceptics are right about what Jev _is_. It's a classifier. If someone tells you it's a new species of intelligence, that's the hype talking, and you should discount it accordingly.

But the sceptics are wrong about what that means in practice. "A classifier you configure in the request body, with calibrated probabilities, at around 300ms and no output cost" is a genuinely different _tool_ from a classifier you have to fine-tune and redeploy.

And the game-changer camp was right that something shifted, but not the thing they meant. It isn't that Jev is powerful. It's that a lot of what we've been asking LLMs to do was never generation in the first place - and now there's somewhere else for it to go.

For me personally, I'm going to keep using it - though probably not for the thing I first assumed. Not as a cheaper LLM, but as the thing that reads the half of my data I'd previously been throwing away.

If you want to explore how it's built, the complete project is on my <a href="https://github.com/Suv4o/ev-charger-jev" target="_blank" rel="noopener noreferrer">GitHub</a>.
