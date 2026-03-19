---
title: I Gave My Claude Code the Personality of a Sarcastic Senior Developer
description: Discover how to customise Claude Code's personality with custom spinner verbs, live status lines, completion sounds, session greetings, output styles, personalised tips, and custom skills. Turn your AI coding assistant into a sarcastic but helpful senior developer.
image: https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_1200,e_sharpen:100/v1773917254/blog/i-gave-my-claude-code-the-personality-of-a-sarcastic-senior-developer/i-gave-my-claude-code-the-personality-of-a-sarcastic-senior-developer_jpghb5
keywords:
    - Claude Code
    - Claude Code customisation
    - Claude Code personality
    - sarcastic developer
    - spinner verbs
    - status line
    - Claude Code hooks
    - SessionStart hook
    - output style
    - Claude Code skills
    - custom skills
    - code review
    - AI coding assistant
    - terminal customisation
    - developer tools
    - Claude Code settings
    - roast my code
    - productivity
    - developer experience
    - AI personality
type: page
blog: post
published: 22nd March 2026
readTime: 11
author: Aleksandar Trpkovski
articleTags:
    - AI
    - Productivity
    - Advice
---

# I Gave My Claude Code the Personality of a Sarcastic Senior Developer

_{{$document.published}} • {{$document.readTime}} min read - by **[{{$document.author}}](/)**_

::tag-pills{:tags="articleTags"}
::

![Landing Image](https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_750,e_sharpen:100/v1773917254/blog/i-gave-my-claude-code-the-personality-of-a-sarcastic-senior-developer/i-gave-my-claude-code-the-personality-of-a-sarcastic-senior-developer_jpghb5)

What if you could make your Claude Code a bit more... playful? Give it the character of a joking senior engineer who's been through too many code reviews and has developed a dry sense of humour about the whole thing. Instead of watching "`Thinking...`" spin in your terminal, you'd see "`Blaming the previous developer (it was me)...`" or "`Convincing myself this is clean code...`" 🙃.

> A quick note before we start: everything in this article I did purely for fun. The customisations are genuinely useful, but the sarcastic senior dev theme is just my personal flavour. If any of it feels like too much, you absolutely don't need to stick with it - swap in your own style, tone it down, or just cherry-pick the parts that make sense for your workflow.

Turns out, you can. Claude Code lets you customise almost everything about its personality - the loading messages, the tips it shows you, how it formats responses, even the sound it makes when it's done. And the best part? You don't edit any config files. You just tell Claude Code what you want in plain English - or even say it out loud using `/voice` mode - and it configures itself.

In this article, I'll walk you through a collection of customisations that turned my Claude Code from a generic terminal tool into something with genuine character — part helpful colleague, part code reviewer who's had one too many coffees. Pick the ones that appeal to you, skip the rest, or do them all. I've put all the configuration examples, scripts, and skills from this article into a <a href="https://github.com/Suv4o/claude-code-setting-of-the-personality-of-a-sarcastic-senior-developer" target="_blank" rel="noopener noreferrer">GitHub repository</a> so you can browse the full setup or use it as a starting point for your own.

Let's dive in.

## Give It a Sense of Humour (Custom Spinner Verbs)

This is where the personality starts. When Claude Code is thinking, it shows a spinner with rotating verbs like "`Thinking...`" and "`Reasoning...`". Functional, sure. But boring. You can replace these with whatever you want - and this is where things get fun.

![Custom Spinner Verbs](https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_750,e_sharpen:100/v1773917286/blog/i-gave-my-claude-code-the-personality-of-a-sarcastic-senior-developer/custom-spinner-verbs_a8kgi6)

I wanted mine to feel like a developer who's been through too many sprint retrospectives and has developed a dark sense of humour about it. Open Claude Code and type - or say - something like this:

```
Replace my spinner verbs with these: "Bikeshedding the variable names", "Promising this is the last refactor", "Googling my own blog post", "Blaming the previous developer (it was me)", "Adding TODO comments I'll never revisit", "Convincing myself this is clean code", "Rubber-ducking with myself", "Pretending I read the docs", "Over-engineering the simple part", "Ignoring the TypeScript errors", "Pushing directly to main", "Writing a test after the bug"
```

> **Tip:** Every prompt in this article can be spoken instead of typed. Run `/voice` to enable voice mode, then hold the spacebar and talk. Claude Code transcribes your speech in real time and processes it just like a typed prompt. It's especially handy for the longer customisation prompts in this article - describing what you want out loud is often faster than writing it out.

Claude Code will update your `~/.claude/settings.json` with something like this:

```json
{
    "spinnerVerbs": {
        "mode": "replace",
        "verbs": [
            "Bikeshedding the variable names",
            "Promising this is the last refactor",
            "Googling my own blog post",
            "Blaming the previous developer (it was me)",
            "Adding TODO comments I'll never revisit",
            "Convincing myself this is clean code",
            "Rubber-ducking with myself",
            "Pretending I read the docs",
            "Over-engineering the simple part",
            "Ignoring the TypeScript errors",
            "Pushing directly to main",
            "Writing a test after the bug",
            "Amending my mistakes",
            "Pulling all-nighter"
        ]
    }
}
```

There are two modes worth knowing about here. Using `replace` swaps out the default verbs entirely - you'll only ever see your custom ones. If you'd prefer your verbs mixed in with the defaults, use `append` instead.

One thing to note: the list is static. Whatever verbs you provide, those are exactly the ones Claude Code will cycle through. It won't generate new ones on its own. So if you want more variety, you have two options. Either write a longer list upfront, or - and this is the more fun approach - don't write them yourself at all. Just tell Claude Code something like:

```
Replace my spinner verbs with 30 verbs that sound like a developer who's had too much coffee and too many merge conflicts
```

Claude will generate the entire list for you. You can also come back later and append more as inspiration strikes:

```
Append these spinner verbs: "Explaining Vue reactivity to a React developer", "Lubing the keyboard switches again"
```

Watching "`Blaming the previous developer (it was me)...`" spin while Claude thinks about my code genuinely makes me laugh every time. It's the little things.

## Give It a Dashboard (Live Status Line)

Alright, this one is less about comedy and more about situational awareness. The status line is a shell script that runs after every Claude turn and displays live information at the bottom of your terminal - a persistent dashboard that's always visible.

The quickest way to set one up is with the `/statusline` command inside Claude Code. It'll ask what you want to display and generate the script for you. But since we're building a sarcastic senior dev, I wanted something with a bit more personality. Here's what I asked Claude Code to build:

```
Create a status line script that shows: the active model name, session duration (how long I've been in this session), total tokens used so far, and a "burnout meter" label that changes based on session length - "Fresh" for under 15 minutes, "Warmed up" for 15-45 minutes, "In the zone" for 45-90 minutes, and "Touch grass" for anything over 90 minutes. Save it to ~/.claude/statusline-command.sh, make it executable, and set it as my status line in user settings.
```

Claude Code generates a bash script that receives a JSON object on `stdin` with your full session data - model name, token counts, session timing, working directory, and more. The script parses this with `jq` and outputs whatever you want with ANSI colour codes.

My status line looks something like this in practice:

![Live Status Line](https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_750,e_sharpen:100/v1773917287/blog/i-gave-my-claude-code-the-personality-of-a-sarcastic-senior-developer/give-it-a-dashboard-live-status-line_wfmka1)

It's a small thing, but seeing "`Touch grass`" appear at the bottom of my terminal after two hours of non-stop prompting is exactly the kind of reminder a sarcastic senior dev would give you. It's also genuinely useful - the token count tells me how expensive the session has been, and the model name reminds me whether I'm on Sonnet or Opus (which matters when you're debugging something tricky and want the heavier model).

The status line script has access to everything in the session JSON payload: working directory, git info, context window stats, total input and output tokens, cache usage, and more. You can combine whatever matters to you into a single line. The `/statusline` command is the easiest way to get started - tell it what data you care about and Claude will write the script.

If you ever want to get rid of it, just run `/statusline remove` (or `/statusline clear`) and Claude Code will clean it up. You can also do it manually by removing the `"statusLine": { ... }` block from `~/.claude/settings.json`.

## Give It a Voice (Play a Sound When It's Done)

Every sarcastic senior dev has impeccable timing. And nothing ruins the flow more than staring at a terminal wondering "is it done yet?". This customisation changed how I work with Claude Code entirely. I kick off a task, switch to another terminal or browser tab, and hear a sound when Claude's done. The shift from "sitting and waiting" to "multitasking and getting pinged" is significant.

You can set this up interactively with `/hooks`, or just tell Claude Code directly. On macOS:

```
Set up a Stop hook in my user settings that plays a notification sound when you finish responding. Use afplay on macOS.
```

Claude Code will add something like this to your `~/.claude/settings.json`:

```json
{
    "hooks": {
        "Stop": [
            {
                "matcher": "*",
                "hooks": [
                    {
                        "type": "command",
                        "command": "/usr/bin/afplay /System/Library/Sounds/Glass.aiff"
                    }
                ]
            }
        ]
    }
}
```

Hooks are shell commands that execute automatically at specific points in Claude Code's lifecycle. The `Stop` hook fires when Claude finishes a response - but it's just one of many lifecycle events you can hook into. `afplay` is macOS's built-in audio player, and you'll find a collection of system sounds in `/System/Library/Sounds/` - just swap the filename to pick one you like.

You're not limited to system sounds either. `afplay` can play any `.aiff`, `.mp3`, or `.wav` file, so you can point it at any audio file you like.

If you're on Linux, swap `afplay` for `paplay` or `aplay` with your system's notification sound.

## Give It a Morning Greeting (SessionStart Hook)

The completion sound already introduced you to hooks - shell commands that fire at specific points in Claude Code's lifecycle. But `Stop` is just one of many lifecycle events. The one that really completes the sarcastic senior dev personality is `SessionStart`.

`SessionStart` fires every time you open a new Claude Code session. Its stdout is passed to Claude as context - meaning Claude sees the greeting and can act on it. By default, nothing happens - you just get a blinking cursor. But what if your Claude Code greeted you like a grumpy colleague who got to the office before you?

You can set this up by creating a small script and wiring it to the `SessionStart` hook. Tell Claude Code:

```
Create a SessionStart hook script at ~/.claude/hooks/greet.sh that picks a random sarcastic developer greeting and prints it to stdout. Use these greetings: "Oh good, you're here. The codebase missed you. (It didn't.)", "Welcome back. Your TODO list hasn't gotten any shorter.", "Another day, another mass-deletion of node_modules.", "Ah, you again. Let's see what we break today.", "Good morning. The tests are still failing from yesterday.", "Back so soon? The tech debt isn't going anywhere.". Make it executable and add it as a SessionStart hook in my user settings.
```

Under the hood, Claude will create a bash script that picks a random line and prints it, then wire it up in your `~/.claude/settings.json`:

```json
{
    "hooks": {
        "SessionStart": [
            {
                "hooks": [
                    {
                        "type": "command",
                        "command": "bash ~/.claude/hooks/greet.sh"
                    }
                ]
            }
        ]
    }
}
```

The script writes to `stdout`, which `SessionStart` passes to Claude as context. Claude sees the greeting but won't display it on its own - you need one more piece to make it visible.

This is where the output style comes in. By adding a rule to your custom output style (covered in the next section), you can instruct Claude to repeat the greeting verbatim as the first line of its response. The hook picks the random quip, and the output style ensures Claude actually says it out loud. Together, they give you a sarcastic morning greeting every time you start a session. It's like pair programming with someone who has opinions.

The beauty of hooks is that `SessionStart` is just one of over a dozen lifecycle events. There's `PreToolUse` (before Claude runs a command), `PostToolUse` (after it edits a file), `Notification` (when Claude needs your attention), and more. You could go deep here - blocking dangerous commands, auto-formatting files, running tests after every edit. But for personality purposes, the session greeting is the sweet spot. It adds character without getting in the way of your actual work.

## Give It an Attitude (Custom Output Style)

So far we've given Claude Code jokes, a dashboard, a voice, and a morning greeting. But what about how it actually _talks_ to you? Output styles control how Claude formats its responses, and this is where you can really shape its personality.

You can pick from the built-in options by running `/config` → `Output style` or just tell Claude:

```
Set my output style to Explanatory
```

The three built-in options are:

- **Default** - the standard Claude Code experience, optimized for efficient software engineering
- **Explanatory** - adds educational "Insights" between tasks explaining implementation choices and codebase patterns
- **Learning** - collaborative learn-by-doing mode where Claude shares insights and also asks you to contribute small pieces of code yourself

But the real power comes from creating your own. Custom output styles are Markdown files with YAML frontmatter that live in `~/.claude/output-styles/`. This is where the personality really shines. You can tell Claude Code to create one:

```
Create a custom output style file called "senior-dev" at ~/.claude/output-styles/senior-dev.md. Make it sound like a blunt but helpful senior developer: no fluff, no hand-holding, give me the fix and a one-liner explaining why. If I'm doing something dumb, call it out. Use code comments over paragraphs. End with what to do next. Add YAML frontmatter with the name "Senior Dev" and description "No fluff, just fixes."
```

This is also where you wire up the session greeting from the previous section. The `SessionStart` hook passes the greeting to Claude as context, but Claude won't display it unless you tell it to. Add a rule to your output style like:

```
At the start of a new session, if there is a SessionStart hook greeting in your context, repeat it verbatim as your first line before doing anything else.
```

Now the two features work together: the hook picks a random sarcastic quip, and the output style ensures Claude repeats it as the first thing you see in every new session.

Once created, it shows up as an option in `/config`. I switch between styles depending on what I'm doing - "Senior Dev" when I'm in the zone and just need straight answers, "Explanatory" when I'm exploring a library I've never used before.

![Custom Output Style](https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_750,e_sharpen:100/v1773917321/blog/i-gave-my-claude-code-the-personality-of-a-sarcastic-senior-developer/Screenshot_2026-03-17_at_10.59.57_pm_arykjl)

## Give It Opinions (Personalised Spinner Tips)

The final touch. While the spinner verbs are the action words ("`Bikeshedding the variable names...`"), Claude Code also shows tips - those helpful hints that appear while you wait. The default tips are genuinely useful. But if you're going full sarcastic senior dev, you can replace them with something that has a bit more... judgement.

```
Replace my spinner tips with these: "Tip: that `any` type isn't fooling anyone", "Tip: your commit history reads like a mystery novel with no ending", "Tip: console.log is not a debugging strategy. But it works.", "Tip: no one has ever regretted writing a README. Start today.", "Tip: the component you're about to write already exists in your codebase", "Tip: future you will not remember what that regex does"
```

Under the hood, this uses `spinnerTipsOverride` in your settings. You can also toggle tips on or off entirely with `spinnerTipsEnabled`.

Just like spinner verbs, the tips list is static - Claude Code won't generate new ones on its own. But you can ask Claude to generate a themed list for you:

```
Replace my spinner tips with 20 tips that sound like a Vue developer who's tired of explaining why Vue is better than React
```

Claude will write them all. It's a small thing that makes the wait time more entertaining - and occasionally, uncomfortably accurate.

## Give It Expertise (Custom Skills)

Everything so far has been cosmetic or ambient - spinners, sounds, greetings, style. Skills are where the personality becomes _functional_. A Skill is a folder with a `SKILL.md` file that teaches Claude Code how to handle a specific task. Claude loads it automatically when relevant, so you don't have to repeat yourself across sessions.

Think of Skills as onboarding docs for Claude. You write the instructions once, and every time you trigger the Skill - either by typing `/skill-name` or by just asking Claude something that matches the Skill's description - it follows your playbook.

The official <a href="https://github.com/anthropics/skills" target="_blank" rel="noopener noreferrer">anthropics/skills</a> repository has dozens of examples covering everything from document creation to art generation. But for our sarcastic senior dev setup, I wanted something more personal: a code review Skill that reviews my code _in character_.

Here's how to create one. Tell Claude Code:

```
Create a personal skill at ~/.claude/skills/roast-my-code/SKILL.md. It should be a code review skill called "roast-my-code" with the description: "Reviews code like a sarcastic but helpful senior developer. Use when the user asks for a code review, says 'review this', 'roast my code', or 'what do you think of this'."

The skill instructions should tell Claude to:
1. Start with an overall impression in one blunt sentence
2. Point out anything genuinely wrong first (real issues, not nitpicks)
3. Call out at least one thing that's actually good (even sarcastic seniors give credit)
4. End with one concrete suggestion that would make the biggest difference
5. Keep the tone dry and direct - think helpful colleague who's seen too much, not mean-spirited
6. Use inline code comments style over long paragraphs
7. Never be cruel, always be honest
```

Claude Code will create the Skill directory and `SKILL.md` for you. The folder structure looks like this:

```
~/.claude/skills/
  └── roast-my-code/
      └── SKILL.md
```

Once created, you can trigger it explicitly with `/roast-my-code` or just say "review this code" and Claude will pick it up from the description. The key is that the Skill's `description` field is what Claude uses to decide when to load it - so making it specific about trigger phrases helps it activate reliably.

![Custom Skills](https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_750,e_sharpen:100/v1773917309/blog/i-gave-my-claude-code-the-personality-of-a-sarcastic-senior-developer/Screenshot_2026-03-18_at_9.39.15_pm_lku1eu)

Here's what makes Skills powerful: they use a progressive loading approach. Claude only reads the Skill's name and description at startup - the actual instructions don't enter the context window until the Skill is triggered. This means you can have multiple Skills installed without wasting context.

You can go further than a single Markdown file too. Skills can include reference files, templates, and even executable scripts. For example, you could add a `STYLE_GUIDE.md` inside the Skill folder with your team's actual coding conventions, and reference it from `SKILL.md` so Claude loads it when reviewing. Or add a `scripts/lint-check.sh` that Claude runs as part of the review.

The <a href="https://github.com/anthropics/skills/blob/main/skills/skill-creator/SKILL.md" target="_blank" rel="noopener noreferrer">Skill creator</a> built into the official repository can also help you build and test new Skills interactively. You can browse the full collection at <a href="https://github.com/anthropics/skills" target="_blank" rel="noopener noreferrer">github.com/anthropics/skills</a> for inspiration - or just tell Claude Code what you need and let it create the Skill for you.

## Wrapping Up

What started as "let me just change the spinner text" turned into a full personality makeover. My Claude Code now questions my TypeScript decisions while it thinks, greets me with a sarcastic one-liner every morning, shows me exactly how much context I've burned through, pings me with a sound when it's done, talks to me like a blunt senior dev, reviews my code in character, and drops passive-aggressive coding wisdom between responses. It's basically the most opinionated colleague I've ever had - and I configured every bit of it.

None of these customisations take more than a minute to set up, and that's what makes them great. You don't need to manually edit JSON files or dig through documentation. You just tell Claude Code what you want in plain English and it configures itself.

Here's a quick summary of everything we covered:

- **Custom spinner verbs** - give Claude a sense of humour while it thinks
- **Live status line** - a dashboard showing model, tokens, and session duration
- **Completion sounds** - get pinged when Claude finishes so you can multitask
- **Session greeting** - a sarcastic welcome message every time you start a session
- **Custom output styles** - shape how Claude talks to you
- **Personalised tips** - replace the default hints with unsolicited senior dev advice
- **Custom Skills** - teach Claude how to do specific tasks your way (like reviewing code in character)

Give them a try. All the configuration files, scripts, and skills from this article are available in the <a href="https://github.com/Suv4o/claude-code-setting-of-the-personality-of-a-sarcastic-senior-developer" target="_blank" rel="noopener noreferrer">companion GitHub repository</a>. And if you come up with better spinner verbs than "`Blaming the previous developer (it was me)`" - I'd love to hear them.
