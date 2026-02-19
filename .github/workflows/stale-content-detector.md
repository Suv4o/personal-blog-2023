---
on:
    schedule:
        - cron: "0 0 1 * *"

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

Perform a monthly audit of all blog articles to identify content that may be outdated or in need of updates.

## Context

This is a technical blog with articles dating from 2021 to 2026. Technical content goes stale quickly - frameworks release new versions, APIs change, best practices evolve. The blog covers fast-moving technologies including Vue.js, Nuxt.js, React.js, TypeScript, Node.js, Python, Firebase, AWS, and AI/LangChain.

Articles are stored at `content/YYYY/MM/DD/article-slug.md` with YAML frontmatter including `published` date, `articleTags`, `title`, and `keywords`.

## What to Analyze

### 1. Age-Based Staleness

Evaluate each article's staleness risk based on its age and topic:

- **High risk** (flag immediately): Articles older than 18 months about: Vue.js, Nuxt.js, React.js, Node.js, TypeScript, AI, LangChain, DevOps, AWS, Firebase
- **Medium risk** (note for review): Articles older than 24 months about any technology topic
- **Low risk** (informational only): Articles about general concepts, Hobby topics, or CSS fundamentals older than 36 months

### 2. Version References

Scan article content for:

- Specific version numbers (e.g., "Vue 3.2", "Node 16", "Nuxt 3.0") that may no longer be current
- References to deprecated APIs, packages, or tools
- `npm install` or `yarn add` commands with pinned versions that may be outdated
- Import statements referencing packages that may have been renamed or deprecated

### 3. Technology Lifecycle

Flag articles about technologies that have undergone major changes:

- Vue 2 to Vue 3 migration (any Vue 2-specific content)
- Nuxt 2 to Nuxt 3 migration
- Node.js versions that have reached end-of-life
- Package managers (npm vs yarn vs pnpm changes)
- AI libraries and APIs that evolve rapidly (OpenAI, LangChain, etc.)

### 4. External Link Health

For each article, check if external links referenced in the content:

- Point to domains that are still likely active
- Reference documentation pages that may have moved (e.g., old doc site URLs)
- Link to GitHub repositories that may have been archived

### 5. Content Relevance

Identify articles that could benefit from:

- A "Last Updated" note or disclaimer
- A follow-up article covering the modern approach
- Merging with related newer content
- Complete rewrite due to fundamental technology changes

## Report Format

Create a single, well-organized issue with the following structure:

### Priority: High

Articles that are most likely to mislead readers if left as-is. Include:

- File path and title
- Publication date
- Specific concerns (what's likely outdated)
- Recommended action (update, add disclaimer, or rewrite)

### Priority: Medium

Articles that would benefit from a refresh. Same format as above.

### Priority: Low

Articles to keep on the radar. Brief listing with file path and age.

### Summary Statistics

- Total articles analyzed
- Articles flagged by priority level
- Most common staleness reasons
- Oldest article that hasn't been flagged (i.e., timeless content that's aging well)

Keep the report actionable and focused. Don't flag articles unnecessarily - only flag content where readers could genuinely encounter outdated or incorrect information.
