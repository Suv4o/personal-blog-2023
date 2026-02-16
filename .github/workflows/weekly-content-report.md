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

Generate a comprehensive weekly health report for the blog, analyzing content quality, publishing trends, and identifying areas for improvement.

## Context

This is a personal technical blog built with Nuxt 3 and `@nuxt/content`. Blog articles are Markdown files organized at `content/YYYY/MM/DD/article-slug.md`. Audio summaries for articles are stored at `audio-summary/YYYY/MM/DD/article-slug/summary.mp3`. The blog covers topics including FrontEnd, BackEnd, Vue.js, React.js, Nuxt.js, JavaScript, TypeScript, Node.js, Python, AI, DevOps, and more.

## What to Analyze

### 1. Publishing Cadence
- Count articles published per year (2021-2026)
- Count articles published in the current month and compare to previous months
- Identify the longest gap between publications
- Note if publishing frequency is increasing or decreasing

### 2. Tag Distribution
- Count how many articles use each `articleTags` value
- Identify the most and least covered topics
- Suggest underrepresented tags that could benefit from more content (e.g., if there are many FrontEnd articles but few BackEnd ones)

### 3. Audio Summary Coverage
- Cross-reference articles in `content/` with audio summaries in `audio-summary/`
- List articles that are missing audio summaries
- Calculate the percentage of articles with audio summaries

### 4. SEO Health Check
- Find articles with `description` shorter than 100 characters (poor SEO)
- Find articles with fewer than 3 `keywords`
- Find articles where the `title` is longer than 60 characters (may be truncated in search results)

### 5. Content Quality Indicators
- Average `readTime` across all articles
- Distribution of `readTime` values (find outliers)
- Articles with unusually short or long content relative to their `readTime`

### 6. Recent Activity
- Summarize the most recent 5 commits to the repository
- Note any open issues or pull requests
- Highlight any recently merged PRs

## Report Format

Structure the report as a well-formatted GitHub issue with:

- A brief **Executive Summary** (2-3 sentences) at the top
- Each analysis section as a separate heading with clear findings
- Use tables where appropriate for data presentation
- End with **Recommendations** - 3 to 5 actionable suggestions for improving the blog
- Include relevant statistics and percentages

Keep the tone professional but friendly. The blog author is Aleksandar Trpkovski.
