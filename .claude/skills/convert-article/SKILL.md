---
name: convert-article
description: Convert a draft Markdown article sitting in the repo root into a fully structured blog post under content/YYYY/MM/DD/. Use when the user asks to convert, publish, format, or "process" a draft article for the blog, or says things like "convert my draft", "publish this article", or "run the convert". Handles frontmatter, SEO keywords, tags, Cloudinary image modifiers, link formatting, folder structure, and index.md placeholders.
argument-hint: "[path to draft .md file]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# Convert Draft Article

Convert a draft Markdown article into a fully structured blog article that matches the conventions of the existing articles in `content/`.

This replaces the old `yarn convert` script (`scripts/convert-article.ts`, which used the GitHub Copilot SDK). The steps below are the same pipeline, executed directly.

## Inputs

- If `$ARGUMENTS` is a path to a `.md` file, that is the draft.
- Otherwise, find the draft by listing `*.md` files in the repo root and **excluding** these non-article files:
  `README.md`, `CLAUDE.md`, `MEMORY.md`, `LOOP_REPORT.md`, and any `*_LOOP_PROMPT.md` / `*_PROMPT.md`.
- If exactly one candidate remains, use it. If more than one remains, list them and ask the user which to convert. If none remain, stop and report that there is no draft to convert.

## Step 1 — Gather context

Read these before writing anything:

1. **The draft** — the full file, so the content is preserved exactly.
2. **The tag list** — `app/utils/categories.ts`. The `CATEGORIES` array is the single source of truth for valid tags; the `tag` field of each entry is the exact string to use. Never invent a tag that is not in that array.
3. **Two reference articles** — the two most recently modified `.md` files under `content/` excluding `index.md`:
   ```bash
   find content -name "*.md" ! -name "index.md" -exec stat -f "%m %N" {} \; | sort -rn | head -2 | cut -d" " -f2-
   ```
   Match their formatting exactly.

## Step 2 — Work out the date and paths

Use **today's date** unless the user names a different publish date.

- `published` string: day with an ordinal suffix, full month name, full year — e.g. `11th June 2026`.
  Suffixes: `st` for 1, 21, 31; `nd` for 2, 22; `rd` for 3, 23; `th` for everything else (4–20 are always `th`).
- Target folder: `content/YYYY/MM/DD/` with zero-padded month and day.
- Slug: from the article title — lowercase, words joined with hyphens, no special characters (drop colons, apostrophes, commas, `+`, `.` in product names becomes part of the word or a hyphen — follow the pattern of existing filenames). Example: `"Mixing Two AI Brains: OpenCLIP + all-MiniLM-L12-v2"` → `mixing-two-ai-brains-openclip-and-all-minilm-l12-v2`.
- Final path: `content/YYYY/MM/DD/<slug>.md`

## Step 3 — Build the frontmatter

The schema is enforced by `content.config.ts` — every field below is required and typed. Emit them in this exact order:

```yaml
---
title: "Article Title Here"
description: Two to three sentences of compelling SEO copy describing what the reader will learn.
image: https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_1200,e_sharpen:100/v<version>/blog/<folder>/<name>
keywords:
    - keyword one
    - keyword two
type: page
blog: post
published: 11th June 2026
readTime: 8
author: Aleksandar Trpkovski
articleTags:
    - AI
    - Python
    - TypeScript
---
```

Rules:

- `title` — quote it only when it contains a colon or other YAML-significant character; otherwise leave unquoted.
- `description` — unquoted plain text, 2–3 sentences. Do not wrap in quotes unless it starts with a character YAML would choke on.
- `image` — the first/main Cloudinary image from the draft, with the `w_1200` modifier set (see Step 5).
- `keywords` — a YAML block list (4-space indent, `- ` items), 15–25 entries, lowercase except proper nouns.
- `published` — unquoted, ordinal format from Step 2.
- `readTime` — a plain number (no quotes, no "min"). Estimate at roughly 200 words per minute of prose, and count fenced code blocks at about half weight. Cross-check against similar-length existing articles.
- `articleTags` — a YAML block list of **exactly 3** tags, each copied verbatim from `CATEGORIES` in `app/utils/categories.ts`.

## Step 4 — Build the article header

Immediately after the closing `---`, in this order and nothing else between them:

```markdown
# Article Title Here

_{{$document.published}} • {{$document.readTime}} min read — by **[{{$document.author}}](/)**_

::tag-pills{:tags="articleTags"}
::
```

The separators in the metadata line are a bullet (`•`) and an em dash (`—`) — copy the line verbatim.

**Do not add an `::audio-player` block.** The `Generate Audio Summaries` GitHub Action (`.github/workflows/generate-audio.yml` → `scripts/index.ts`) generates the audio and injects the player after the `::tag-pills` block once the article is pushed to `main`.

The landing image goes after the header block, as a normal Markdown image.

## Step 5 — Images

Keep every Cloudinary base URL, version segment, and path exactly as in the draft. Only normalise the transformation segment (the part between `/upload/` and `/v<version>/`):

- Frontmatter `image`: `q_auto,f_auto,w_1200,e_sharpen:100`
- Inline images in the body: `q_auto,f_auto,w_750,e_sharpen:100` (use `w_850` for wide diagrams or screenshots that need the extra width)

If a URL has no transformation segment, insert one after `/upload/`.

## Step 6 — Links

- Every **external** link must be raw HTML: `<a href="URL" target="_blank" rel="noopener noreferrer">text</a>` — never Markdown link syntax.
- **Internal** links to other articles on the blog use `<NuxtLink to="/YYYY/MM/DD/slug">text</NuxtLink>`.
- The author link in the metadata line is the one exception and stays as written in Step 4.

## Step 7 — Content integrity

- Preserve all headings, prose, code blocks, and technical content **exactly** as in the draft.
- Fix only mechanical Markdown issues: inconsistent heading levels, missing language hints on fenced code blocks, stray whitespace, list formatting.
- Do **not** rewrite, summarise, expand, reword, or "improve" the author's writing. The draft's voice is final.

## Step 8 — Write the files

1. Create `content/YYYY/`, `content/YYYY/MM/`, and `content/YYYY/MM/DD/` if they don't exist.
2. In each of those three directories, create `index.md` **if it does not already exist**, containing exactly:
   ```
   ::Error404
   ::
   ```
   (trailing newline, nothing else). Never overwrite an existing `index.md`.
3. Write the converted article to `content/YYYY/MM/DD/<slug>.md`.

## Step 9 — Verify before cleaning up

Check all of the following, and fix anything that fails:

- The file exists at the expected path and starts with `---`.
- All ten frontmatter fields are present and typed as `content.config.ts` requires (`keywords` and `articleTags` are lists, `readTime` is a number, `image` is a valid URL).
- `articleTags` contains exactly 3 tags, each present in `CATEGORIES`.
- The H1, metadata line, and `::tag-pills` block are present and in order.
- No `::audio-player` block was added.
- No Markdown-syntax external links remain: `grep -n "](http" content/YYYY/MM/DD/<slug>.md` should return nothing outside code blocks.
- The three `index.md` files exist.

## Step 10 — Remove the draft

Only after Step 9 passes, delete the original draft from the repo root. If the draft is tracked by git or lives outside the repo root, ask before deleting.

## Step 11 — Report

Tell the user:

- The new article path.
- The slug, published date, readTime, and the 3 chosen tags (and why those tags).
- Which reference articles were used for formatting.
- That the audio summary and player will be generated by CI on push to `main`.
