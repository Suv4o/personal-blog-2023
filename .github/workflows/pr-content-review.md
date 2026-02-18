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

When a pull request is opened or updated, review the changes for quality, consistency, and correctness - with special attention to blog content files.

## Context

This is a Nuxt 3 blog using `@nuxt/content`. Key technical details:

- **Articles**: Markdown files at `content/YYYY/MM/DD/article-slug.md` with YAML frontmatter
- **Schema**: Defined in `content.config.ts` using Zod - requires: title, description, image (URL), keywords (array), type, blog, published, readTime (number), author, articleTags (array)
- **Components**: 33 Vue components in `app/components/` (Vue 3 `<script setup lang="ts">`)
- **Custom Nuxt Content components**: Articles use `::tag-pills`, `::audio-player`, `::posts`, `::further-reading` syntax
- **External links pattern**: Should use `<a href="..." target="_blank" rel="noopener noreferrer">`
- **Images**: Hosted on Cloudinary (`https://res.cloudinary.com/`)
- **Audio summaries**: Stored at `audio-summary/YYYY/MM/DD/slug/summary.mp3` with matching `summary.json`
- **Build**: `yarn generate:prod` with Node.js 22
- **Deployment**: Netlify via GitHub Actions

## Review Checklist for Content Changes (content/\*\*)

If the PR modifies files in `content/`:

1. **Frontmatter validation**:
    - All required fields present (title, description, image, keywords, type, blog, published, readTime, author, articleTags)
    - `image` is a valid URL (preferably Cloudinary)
    - `articleTags` has exactly 3 entries
    - `readTime` is a reasonable number (3-20 minutes)
    - `published` follows the human-readable date format (e.g., "15th February 2026")

2. **Content quality**:
    - Markdown syntax is valid
    - Code blocks specify a language for syntax highlighting
    - Custom Nuxt Content components are properly formatted (e.g., `::tag-pills{:tags="articleTags"}`)
    - No broken or empty links

3. **SEO check**:
    - `description` is 120-160 characters
    - `keywords` has at least 3 entries
    - `title` is under 60 characters

4. **Link safety**:
    - External `<a>` tags include `target="_blank"` and `rel="noopener noreferrer"`

## Review Checklist for Code Changes (app/**, server/**)

If the PR modifies Vue components or server code:

1. **TypeScript**: Check for type safety and proper use of Vue 3 Composition API
2. **Component patterns**: Verify consistency with existing component patterns (e.g., `<script setup lang="ts">`)
3. **Accessibility**: Check for proper ARIA attributes, semantic HTML
4. **CSS**: Should use Tailwind utility classes consistent with the existing codebase

## Review Checklist for Configuration Changes

If the PR modifies `nuxt.config.ts`, `content.config.ts`, `package.json`, or workflow files:

1. **Breaking changes**: Flag any changes that could break the build or deployment
2. **Security**: Check for exposed secrets or sensitive configuration
3. **Dependencies**: Note any new dependencies added

## Comment Format

Post a single, well-organized review comment with:

- A brief summary of what the PR changes
- Categorized findings (Content, Code, Configuration) with pass/fail indicators
- Specific line-level feedback where applicable
- An overall assessment: Looks Good / Minor Issues / Needs Attention
- Be constructive and specific - suggest fixes, don't just point out problems
