---
on:
  push:
    branches: [main]
    paths:
      - "content/**"
  workflow_dispatch:

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

When new or modified blog articles are pushed to the `main` branch, review them for quality and consistency.

## Context

This is a Nuxt 3 blog using `@nuxt/content`. Articles are Markdown files in `content/` organized by date: `content/YYYY/MM/DD/article-slug.md`. Each article requires YAML frontmatter validated by a Zod schema in `content.config.ts`.

## Required Frontmatter Fields

Every blog article (files where `type: page` and `blog: post`) must have ALL of these fields:

- `title` (string) - The article title
- `description` (string) - SEO meta description, should be 120-160 characters for optimal SEO
- `image` (string, valid URL) - Cover image, typically a Cloudinary URL starting with `https://res.cloudinary.com/`
- `keywords` (array of strings) - SEO keywords, should have at least 3
- `type` (string) - Content type, usually `page`
- `blog` (string) - Content category, usually `post`
- `published` (string) - Publication date in human-readable format like "2nd March 2025"
- `readTime` (number) - Estimated reading time in minutes, typically between 3 and 20
- `author` (string) - Should be "Aleksandar Trpkovski"
- `articleTags` (array of strings) - Exactly 3 topic tags from established tags: FrontEnd, BackEnd, Vue.js, React.js, Nuxt.js, JavaScript, TypeScript, Node.js, Python, NestJS, Nitro, CSS, Firebase, AI, AWS, LangChain, DevOps, Hobby

## What to Review

1. **Identify changed files**: Look at the most recent push to `main` and find which files in `content/` were added or modified
2. **Skip non-article files**: Ignore files like `index.md`, `about-me.md`, `get-in-touch.md`, `unsubscribe.md`, and files under `the-keyboard-lab/` or `through-the-lens/`
3. **Validate frontmatter**: Check each article has all required fields with correct types
4. **Check SEO quality**:
   - Is the `description` between 120-160 characters?
   - Are there at least 3 `keywords`?
   - Does the `title` accurately reflect the content?
5. **Check tag consistency**: Verify `articleTags` contains exactly 3 tags from the established list
6. **Check content patterns**: Look for proper use of Nuxt Content components (`::tag-pills`, `::audio-player`, `::posts`)
7. **Check external links**: Verify `<a>` tags targeting external URLs include `target="_blank"` and `rel="noopener noreferrer"`
8. **Check readability**: Flag very short articles (under 500 words) or very long ones (over 5000 words) that might need splitting

## Output Format

Create a single issue summarizing findings for all reviewed articles. For each article, include:

- **File path** and article title
- **Pass/Fail** status for each check category
- **Specific issues** found with suggestions for improvement
- An overall **quality score** (Excellent / Good / Needs Attention)

If all articles pass all checks, still create the issue but note that everything looks good.
