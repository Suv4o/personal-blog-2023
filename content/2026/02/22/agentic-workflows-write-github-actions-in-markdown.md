---
title: "Agentic Workflows: Write GitHub Actions in Markdown"
description: Discover how to use GitHub Agentic Workflows to automate repository tasks with AI agents. This step-by-step tutorial covers writing workflows in plain Markdown, configuring triggers, permissions, tools, and safe outputs, and building practical automations for your projects.
image: https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_1200,e_sharpen:100/v1771503278/blog/github-agentic-workflows-build-github-actions-in-markdown-with-ai-agents/github-agentic-workflows-build-github-actions-in-markdown-with-ai-agents_r153nu
keywords:
    - GitHub Agentic Workflows
    - GitHub Actions
    - AI automation
    - repository automation
    - gh-aw CLI
    - agentic AI
    - workflow automation
    - GitHub Copilot
    - Claude engine
    - Codex engine
    - safe outputs
    - MCP tools
    - Model Context Protocol
    - CI/CD automation
    - technical preview
    - Markdown workflows
    - issue triage
    - pull request review
    - content automation
    - GitHub CLI
type: page
blog: post
published: 22nd February 2026
readTime: 8
author: Aleksandar Trpkovski
articleTags:
    - DevOps
    - AI
    - Productivity
---

# Agentic Workflows: Write GitHub Actions in Markdown

_{{$document.published}} • {{$document.readTime}} min read — by **[{{$document.author}}](/)**_

::tag-pills{:tags="articleTags"}
::

::audio-player{:audioSrc="https://cdn.jsdelivr.net/gh/Suv4o/personal-blog-2023/audio-summary/2026/02/22/agentic-workflows-write-github-actions-in-markdown/summary.mp3" :transcriptSrc="https://cdn.jsdelivr.net/gh/Suv4o/personal-blog-2023/audio-summary/2026/02/22/agentic-workflows-write-github-actions-in-markdown/summary.json"}
::

![Landing Image](https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_750,e_sharpen:100/v1771503278/blog/github-agentic-workflows-build-github-actions-in-markdown-with-ai-agents/github-agentic-workflows-build-github-actions-in-markdown-with-ai-agents_r153nu)

What if your GitHub repository could triage its own issues, review pull requests for quality, generate weekly health reports, and investigate CI failures - all without you writing a single line of YAML?

Last week, GitHub launched the technical preview of <a href="https://github.blog/ai-and-ml/automate-repository-tasks-with-github-agentic-workflows/" target="_blank" rel="noopener noreferrer">**GitHub Agentic Workflows**</a>. It's a new way to automate repository tasks using AI agents that run directly inside GitHub Actions. Instead of writing complex YAML configuration files, you describe what you want to happen in **plain Markdown**, and an AI agent figures out how to do it.

I've been experimenting with it on this blog's repository, building workflows that review my articles, triage issues, and generate content reports. In this article, I'll walk you through everything: what agentic workflows are, how they work, and how to build your own step by step.

## What Are GitHub Agentic Workflows?

GitHub Agentic Workflows is a collaboration between <a href="https://githubnext.com/projects/agentic-workflows/" target="_blank" rel="noopener noreferrer">**GitHub Next**</a>, **Microsoft Research**, and **Azure Core Upstream**. The idea is simple: instead of scripting every step of an automation in YAML, you define the **outcome** and **guardrails**, and an AI agent executes the work.

Each workflow is a Markdown file (`.md`) placed in `.github/workflows/`. It has two parts:

1. **YAML frontmatter** - Defines triggers, permissions, tools, and constraints
2. **Markdown body** - Natural language instructions telling the AI what to do

The `gh aw` CLI compiles these `.md` files into standard GitHub Actions `.lock.yml` workflows. When triggered, an AI coding agent (GitHub Copilot, Claude, or Codex) reads your Markdown instructions, uses declared tools to interact with your repository, and produces results through controlled output channels.

The project is open source at <a href="https://github.com/github/gh-aw" target="_blank" rel="noopener noreferrer">github.com/github/gh-aw</a>.

## How They Work Behind the Scenes

Here's what happens when an agentic workflow runs:

1. A **trigger fires** - a push event, an issue being opened, a schedule, or a manual dispatch
2. The compiled `.lock.yml` workflow starts on **GitHub Actions** infrastructure
3. A containerised **sandbox** is created with strict security boundaries
4. The AI **engine** reads your Markdown instructions
5. The agent interacts with the repository through **tools** exposed via the <a href="https://modelcontextprotocol.io/" target="_blank" rel="noopener noreferrer">Model Context Protocol (MCP)</a>
6. Any write operations go through **safe outputs** - pre-approved, reviewable GitHub operations
7. A separate, permission-scoped job executes the actual writes (creating issues, PRs, comments, labels)

The key principle is **read-only by default**. The AI agent itself never gets direct write access to your repository. Every write operation must pass through the safe-outputs pipeline. Even if the agent were fully compromised, it couldn't directly modify your repository.

## Prerequisites

Before we start, you'll need a few things installed.

### Installing the GitHub CLI

The GitHub CLI (`gh`) is required. If you don't have it, install it with Homebrew:

```bash
brew install gh
```

Then authenticate:

```bash
gh auth login
```

This opens your browser and prompts you to log in with GitHub.

### Installing the gh-aw Extension

The `gh-aw` extension adds the agentic workflow commands to the CLI. Install it with:

```bash
gh extension install github/gh-aw
```

This installs the extension **locally on your machine** as a plugin for `gh`. It adds `gh aw` subcommands like `compile`, `run`, and `secrets set`.

## Setting Up Authentication

Agentic workflows need an AI engine to run. The default is **GitHub Copilot**, but you can also use **Claude** or **Codex**. Each engine requires its own secret stored in your repository.

### Creating a Fine-Grained PAT (for Copilot)

If you're using the default Copilot engine, you need a Personal Access Token:

1. Go to **GitHub.com** > click your **profile picture** > **Settings**
2. Scroll to **Developer settings** (at the very bottom of the left sidebar)
3. Click **Personal access tokens** > **Fine-grained tokens**
4. Click **Generate new token**
5. Give it a name (e.g., "Agentic Workflows")
6. Set an expiration date
7. Under **Repository access**, select the repos you want it to work with

Now here's something important that's easy to miss: the permission you need - **Copilot Requests** - is under **Account permissions**, not Repository permissions. Most people look only at the Repository permissions section and can't find it. Scroll down past Repository permissions to the **Account permissions** section, and you'll see "Copilot Requests" there.

> **Note:** This permission only appears if you have an **active GitHub Copilot subscription**. If you don't see it, you'll need to use a different engine.

8. Under **Account permissions**, enable **Copilot Requests**
9. Click **Generate token**
10. Copy the token immediately - you won't see it again

### Storing the Secret

You can store the token either through the CLI or the GitHub dashboard.

**Option A - CLI:**

```bash
gh aw secrets set COPILOT_GITHUB_TOKEN --value "github_pat_xxxxxxxxxxxx..."
```

**Option B - GitHub Dashboard:**

1. Go to your repo > **Settings** > **Secrets and variables** > **Actions**
2. Click **New repository secret**
3. Name: `COPILOT_GITHUB_TOKEN`, Value: paste your token
4. Click **Add secret**

### Alternative Engines

If you don't have a Copilot subscription or prefer a different engine, you have two other options:

| Engine                | Frontmatter                             | Secret Name            | How to Get It                                                                                                                       |
| --------------------- | --------------------------------------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| **Copilot** (default) | Omit `engine:` or use `engine: copilot` | `COPILOT_GITHUB_TOKEN` | Fine-grained PAT with Copilot Requests permission                                                                                   |
| **Claude**            | `engine: claude`                        | `ANTHROPIC_API_KEY`    | <a href="https://platform.claude.com/settings/keys" target="_blank" rel="noopener noreferrer">platform.claude.com/settings/keys</a> |
| **Codex**             | `engine: codex`                         | `OPENAI_API_KEY`       | <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">platform.openai.com/api-keys</a>           |

Store the secret the same way:

```bash
gh aw secrets set ANTHROPIC_API_KEY --value "sk-ant-xxxxxxxxxxxx..."
# or
gh aw secrets set OPENAI_API_KEY --value "sk-xxxxxxxxxxxx..."
```

## Anatomy of a Workflow File

Now let's look at how to actually write a workflow. Here's a complete example:

```markdown
---
on:
    issues:
        types: [opened, reopened]

permissions:
    contents: read
    issues: read
    pull-requests: read

safe-outputs:
    add-comment: {}
    add-labels:
        allowed: [bug, feature, enhancement, question]

tools:
    github:
---

# Issue Triage

When a new issue is opened, analyze its content.

## What to do

1. Read the issue title and body
2. Research the codebase for context
3. Add the most appropriate label
4. Leave a friendly comment explaining your choice
```

Let's break down each frontmatter property.

### The `on:` Property - Triggers

The `on:` property defines **when** your workflow runs. It uses the same trigger syntax as regular GitHub Actions:

```yaml
# Run when an issue is opened or reopened
on:
  issues:
    types: [opened, reopened]

# Run on push to main
on:
  push:
    branches: [main]
    paths:
      - "content/**"

# Run on a schedule
on:
  schedule: daily
  # or with cron syntax
  schedule:
    - cron: "0 0 * * *"

# Run when someone comments on an issue/PR (for slash commands)
on:
  issue_comment:
    types: [created]

# Run on PR events
on:
  pull_request:
    types: [opened, synchronize]

# Allow manual triggering
on:
  workflow_dispatch:
```

You can combine multiple triggers. For example, a workflow that runs weekly but can also be triggered manually:

```yaml
on:
    schedule: weekly
    workflow_dispatch:
```

### The `permissions:` Property

The `permissions:` property defines what the AI agent can **read**. Agentic workflows are read-only by default - write permissions are not allowed (the compiler will reject them). All write operations go through safe outputs instead.

```yaml
permissions:
    contents: read
    issues: read
    pull-requests: read
    actions: read
```

Available permissions include `contents`, `issues`, `pull-requests`, `actions`, `discussions`, `checks`, `deployments`, `packages`, `pages`, and `statuses` - all read-only.

> When you use `tools: github:` without specifying toolsets, the compiler expects at minimum `contents: read`, `issues: read`, and `pull-requests: read`, since the default GitHub toolsets include `repos`, `issues`, and `pull_requests`.

### The `engine:` Property

The `engine:` property selects which AI model interprets your workflow. If omitted, it defaults to **GitHub Copilot**.

```yaml
# Default - GitHub Copilot
engine: copilot

# With a specific model
engine:
  id: copilot
  model: gpt-5.2-codex

# Claude by Anthropic
engine: claude

# OpenAI Codex
engine: codex
```

Claude and Codex are currently marked as **experimental**. Copilot is the most stable option.

### The `tools:` Property

The `tools:` property declares which **MCP tools** the AI agent can use. Each tool must be explicitly declared - the agent can't access anything you don't allow.

```yaml
tools:
    github:
```

This gives the agent access to the GitHub API. Without specifying toolsets, it enables the defaults: `context`, `repos`, `issues`, `pull_requests`, and `users`. You can restrict it:

```yaml
tools:
    github:
        toolsets: [issues, repos]
```

Here are all the available tools:

**Core tools:**

| Tool      | Description                                                           |
| --------- | --------------------------------------------------------------------- |
| `github:` | GitHub API access (repos, issues, PRs, actions, labels, search, etc.) |
| `bash:`   | Shell command execution (safe commands by default)                    |
| `edit:`   | File editing in the workspace                                         |

**Web tools:**

| Tool          | Description                                         |
| ------------- | --------------------------------------------------- |
| `web-fetch:`  | HTTP requests to fetch web content                  |
| `web-search:` | Web search capabilities                             |
| `playwright:` | Browser automation with domain-based access control |

**Built-in MCP tools:**

| Tool                 | Description                                         |
| -------------------- | --------------------------------------------------- |
| `agentic-workflows:` | Workflow introspection, log analysis, and debugging |
| `cache-memory:`      | Persistent memory storage across workflow runs      |
| `repo-memory:`       | Repository-specific memory across executions        |

You can also integrate custom MCP servers using the `mcp-servers:` top-level frontmatter field:

```yaml
mcp-servers:
    slack:
        command: "npx"
        args: ["-y", "@slack/mcp-server"]
        env:
            SLACK_BOT_TOKEN: "${{ secrets.SLACK_BOT_TOKEN }}"
        allowed: ["send_message", "get_channel_history"]
```

### The `safe-outputs:` Property

This is the most important security concept in agentic workflows. Since the agent is read-only, every write operation must go through a **safe output** - a pre-approved, reviewable GitHub operation.

```yaml
safe-outputs:
    create-issue:
        title-prefix: "[Weekly Report] "
        labels: [report]
        group: true
        expires: 14
    create-pull-request:
        title-prefix: "[docs] "
        labels: [documentation]
    add-comment: {}
    add-labels:
        allowed: [bug, feature, enhancement, question]
```

Available safe-output types:

| Type                  | Description                                         | Configuration Options                        |
| --------------------- | --------------------------------------------------- | -------------------------------------------- |
| `create-issue`        | Create a new GitHub issue                           | `title-prefix`, `labels`, `group`, `expires` |
| `create-pull-request` | Create a new pull request                           | `title-prefix`, `labels`                     |
| `add-comment`         | Add a comment to an issue or PR                     | `{}` (no configuration needed)               |
| `add-labels`          | Add labels to an issue or PR                        | `allowed` (list of permitted labels)         |
| `missing-data`        | Report when the agent lacks data to complete a task | Encourages honest AI behaviour               |

The `group: true` option ensures only one open issue exists at a time for that workflow (new runs update the existing issue rather than creating duplicates). The `expires: 14` option auto-closes the issue after 14 days.

### The `network:` Property

The `network:` property controls outbound network access for the agent:

```yaml
network: defaults
```

When enabled, the **Agent Workflow Firewall (AWF)** wraps execution and enforces domain-based allowlists, logging all network activity for audit purposes.

### The Markdown Body

After the frontmatter, the rest of the file is plain Markdown. This is where you write natural language instructions for the AI agent:

```markdown
# Issue Triage

When a new issue is opened, analyze its content.

## What to do

1. Read the issue title and body
2. Research the codebase for context
3. Add the most appropriate label
4. Leave a friendly comment explaining your choice

## Tone

Be friendly and professional. Thank the person for opening the issue.
```

The agent interprets these instructions flexibly. You don't need to be overly prescriptive - the agent understands context and makes judgement calls. But the more specific your instructions, the more consistent the results.

## Compiling and Running Workflows

### What Is `gh aw compile`?

Once you've written your `.md` workflow file, you need to **compile** it:

```bash
gh aw compile
```

This takes your `.md` file and generates a corresponding `.lock.yml` file - a standard GitHub Actions YAML workflow with security hardening.

Think of it like a build step:

- **Input:** `.github/workflows/my-workflow.md` (your Markdown source)
- **Output:** `.github/workflows/my-workflow.lock.yml` (compiled Actions YAML)

The compiled file includes SHA-pinned action dependencies, sandbox configuration, safe-output job separation, and security hardening. GitHub Actions executes the `.lock.yml`, but reads the Markdown instructions from the `.md` at runtime.

**You only need to recompile when you change the frontmatter** (triggers, permissions, tools, safe-outputs). If you only edit the Markdown body, no recompilation is needed.

### The `.lock.yml` Files

The `.lock.yml` files are the compiled output. They're typically 50+ KB of generated YAML that you don't need to read or edit. Both the `.md` and `.lock.yml` files must be committed and pushed for the workflow to run.

### The `actions-lock.json` File

When you compile, you'll also notice a `.github/aw/actions-lock.json` file gets created. This pins every GitHub Action used in your compiled workflows to a **specific commit SHA**:

```json
{
    "entries": {
        "actions/github-script@v8": {
            "repo": "actions/github-script",
            "version": "v8",
            "sha": "ed597411d8f924073f98dfc5c65a23a2325f34cd"
        }
    }
}
```

Instead of referencing `actions/github-script@v8` (a mutable tag), the compiled workflows use the exact SHA. This prevents supply chain attacks - even if someone compromises the `v8` tag, your workflows use the verified version. It's the same concept as `yarn.lock` or `package-lock.json`, but for GitHub Actions.

Commit this file alongside everything else.

### The `agentics-maintenance.yml` File

If any of your workflows use the `expires:` field in safe-outputs, `gh aw compile` will also generate an `agentics-maintenance.yml` file. This is an auto-generated housekeeping workflow that runs daily and **auto-closes expired issues, discussions, and pull requests** created by your agentic workflows.

For example, if your weekly report workflow has `expires: 14`, old report issues will be automatically closed after 14 days so they don't pile up. Commit this file too.

### The `.gitattributes` File

The compiler also creates a `.gitattributes` entry:

```
.github/workflows/*.lock.yml linguist-generated=true merge=ours
```

This does two things: it tells GitHub to treat `.lock.yml` files as generated (they'll be collapsed in PR diffs), and it resolves merge conflicts by keeping your branch's version (since you'd just recompile anyway).

### Running Workflows

For workflows with `workflow_dispatch:` in their triggers, you can run them manually:

```bash
gh aw run weekly-content-report
```

This is equivalent to clicking "Run workflow" in the GitHub Actions UI. The agent spins up on GitHub's infrastructure, reads your instructions, and produces results in about 2-3 minutes.

You can also trigger this from the **GitHub Actions tab** in your browser.

For event-triggered workflows (like `push` or `issues`), you trigger them by creating the actual event - pushing code, opening an issue, or commenting on a PR.

## Building Practical Workflows for My Blog

Now let's put everything together. I built six agentic workflows for this blog's repository. Each one solves a real problem I've encountered while maintaining a technical blog.

### Workflow 1: Article Quality Reviewer

**Problem:** When I push a new article, I sometimes miss a frontmatter field, forget to add exactly 3 tags, or write a description that's too short for good SEO.

**Solution:** This workflow automatically reviews every new article pushed to `content/**` and creates an issue with findings.

```markdown
---
on:
    push:
        branches: [main]
        paths:
            - "content/**"

permissions:
    contents: read
    issues: read
    pull-requests: read

safe-outputs:
    create-issue:
        title-prefix: "[Article Review] "
        labels: [content-review]

tools:
    github:
---

# Article Quality Reviewer

When new or modified blog articles are pushed to the `main` branch,
review them for quality and consistency.

## Required Frontmatter Fields

Every blog article must have ALL of these fields:

- `title` (string)
- `description` (string) - should be 120-160 characters for optimal SEO
- `image` (string, valid URL)
- `keywords` (array of strings) - at least 3
- `type` (string) - usually `page`
- `blog` (string) - usually `post`
- `published` (string) - human-readable format like "2nd March 2025"
- `readTime` (number) - typically between 3 and 20
- `author` (string) - should be "Aleksandar Trpkovski"
- `articleTags` (array of strings) - exactly 3 tags

## What to Review

1. Identify changed files in `content/` from the most recent push
2. Validate frontmatter completeness and types
3. Check SEO quality (description length, keyword count, title length)
4. Check tag consistency (exactly 3 from established list)
5. Check external links include `target="_blank"` and `rel="noopener noreferrer"`
6. Flag very short articles (under 500 words) or very long ones (over 5000 words)

## Output Format

Create a single issue with findings for each article, including
a quality score: Excellent / Good / Needs Attention.
```

### Workflow 2: Weekly Content Health Report

**Problem:** With over 44 articles spanning 5 years, it's hard to keep track of publishing trends, which topics are underrepresented, or which articles are missing audio summaries.

**Solution:** A weekly report generated as a GitHub issue.

```markdown
---
on:
    schedule: weekly
    workflow_dispatch:

permissions:
    contents: read
    issues: read
    pull-requests: read

safe-outputs:
    create-issue:
        title-prefix: "[Weekly Report] "
        labels: [report]
        group: true
        expires: 14

tools:
    github:
---

# Weekly Content Health Report

Generate a comprehensive weekly health report for the blog.

## What to Analyze

1. **Publishing Cadence** - Articles per year, current month vs previous,
   longest gap between publications
2. **Tag Distribution** - Most/least covered topics, underrepresented areas
3. **Audio Summary Coverage** - Cross-reference articles in `content/`
   with audio summaries in `audio-summary/`
4. **SEO Health Check** - Short descriptions, missing keywords,
   overly long titles
5. **Recent Activity** - Latest commits, open issues, merged PRs

## Report Format

Structure as a well-formatted issue with an Executive Summary,
each section as a separate heading, tables where appropriate,
and 3-5 actionable Recommendations at the end.
```

### Workflow 3: Issue Triage

**Problem:** When someone opens an issue on my blog's repository - a bug report, a content request, a typo fix - I want them to get a quick, helpful response even when I'm not available.

**Solution:** Automatic triage with labels and a first-response comment.

```markdown
---
on:
    issues:
        types: [opened, reopened]

permissions:
    contents: read
    issues: read
    pull-requests: read

safe-outputs:
    add-comment: {}
    add-labels:
        allowed: [bug, content-request, enhancement, typo, question]

tools:
    github:
---

# Blog Issue Triage

When a new issue is opened or reopened, analyze it and
provide an initial response with appropriate categorization.

## What to Do

1. Read the issue carefully
2. Research the codebase for context
3. Apply exactly ONE label from the allowed list
4. Leave a helpful comment that includes:
    - Acknowledgment of the issue
    - Your analysis (what you found in the codebase)
    - A friendly note that Aleksandar will review it soon

## Tone

Be friendly, helpful, and professional. Thank the person
for opening the issue.
```

### Workflow 4: PR Content Reviewer

**Problem:** When a pull request modifies blog articles, I want automated feedback on frontmatter validity, formatting consistency, and link safety.

```markdown
---
on:
    pull_request:
        types: [opened, synchronize]

permissions:
    contents: read
    issues: read
    pull-requests: read

safe-outputs:
    add-comment: {}

tools:
    github:
---

# Pull Request Content Reviewer

When a pull request is opened or updated, review the changes
for quality and consistency.

## Review Checklist for Content Changes

1. All required frontmatter fields present with correct types
2. `articleTags` has exactly 3 entries
3. `description` is 120-160 characters
4. Code blocks specify a language for syntax highlighting
5. External links include `target="_blank"` and `rel="noopener noreferrer"`

## Review Checklist for Code Changes

1. TypeScript type safety and Vue 3 Composition API patterns
2. Consistent use of Tailwind CSS utility classes
3. Proper ARIA attributes and semantic HTML

## Comment Format

Post a single review comment with categorized findings
and an overall assessment: Looks Good / Minor Issues / Needs Attention.
```

### Workflow 5: CI Doctor (ChatOps)

**Problem:** When a build fails in CI, debugging means opening the Actions tab, finding the failed run, expanding the logs, and reading through them. It's tedious.

**Solution:** Comment `/fix` on a PR and the agent investigates for you.

```markdown
---
on:
    issue_comment:
        types: [created]

permissions:
    contents: read
    actions: read
    pull-requests: read
    issues: read

safe-outputs:
    add-comment: {}
    create-pull-request:
        title-prefix: "[CI Fix] "
        labels: [ci-fix]

tools:
    github:
---

# CI Doctor

When someone comments `/fix` on a pull request or issue,
investigate failing CI checks and propose fixes.

## What to Do

1. Only act when the first line of the comment is `/fix`
2. Find failing workflow runs associated with the PR
3. Analyze failure logs to identify the specific error
4. Research the codebase for context
5. Post a comment with:
    - **Diagnosis** - what failed and why
    - **Root Cause** - the underlying issue
    - **Suggested Fix** - specific code changes needed
    - **Prevention** - how to avoid this in the future
```

### Workflow 6: Stale Content Detector

**Problem:** Technical blog content goes stale quickly. Articles about Vue 2, Node 16, or old API patterns might mislead readers if left without a disclaimer.

**Solution:** A monthly audit that identifies potentially outdated content.

```markdown
---
on:
    schedule:
        - cron: "0 0 1 * *"
    workflow_dispatch:

permissions:
    contents: read
    issues: read
    pull-requests: read

safe-outputs:
    create-issue:
        title-prefix: "[Content Freshness] "
        labels: [maintenance]
        group: true
        expires: 30

tools:
    github:
---

# Stale Content Detector

Perform a monthly audit of all blog articles to identify
content that may be outdated.

## What to Analyze

1. **Age-Based Staleness** - Articles about fast-moving technologies
   (Vue.js, Node.js, AI) older than 18 months are high risk
2. **Version References** - Scan for specific version numbers,
   deprecated APIs, pinned package versions
3. **Technology Lifecycle** - Flag Vue 2 content, end-of-life
   Node.js versions, rapidly evolving AI libraries

## Report Format

Create a single issue organized by priority:
High (misleading if left as-is), Medium (would benefit from refresh),
and Low (keep on radar). End with summary statistics.
```

## Looking Ahead

GitHub Agentic Workflows is still in technical preview. Things will change - the CLI commands might evolve, new tools will be added, and the security model will mature. But even in this early state, the concept is compelling: describe what you want in plain language, set clear boundaries, and let an AI agent handle the execution.

What I find most interesting is the security architecture. The read-only-by-default model with safe outputs as controlled write channels is a thoughtful approach. The agent can analyse your entire repository, reason about what needs to happen, and propose changes - but it can never directly modify anything without going through the approved channels.

For my blog, these six workflows handle tasks that I used to do manually (or more often, forgot to do entirely). The article quality reviewer catches mistakes before they go live. The weekly report gives me a bird's-eye view I'd never take the time to generate myself. The issue triage provides immediate responses to anyone who opens an issue, even when I'm not at my desk.

If you want to explore further, the official documentation is at <a href="https://github.github.io/gh-aw/" target="_blank" rel="noopener noreferrer">github.github.io/gh-aw</a>, and there's a sample pack of ready-to-use workflows at <a href="https://github.com/githubnext/agentics" target="_blank" rel="noopener noreferrer">github.com/githubnext/agentics</a>. The six workflows I built for this blog are in the <a href="https://github.com/Suv4o/personal-blog-2023" target="_blank" rel="noopener noreferrer">repository</a> under `.github/workflows/`.

Happy automating!
