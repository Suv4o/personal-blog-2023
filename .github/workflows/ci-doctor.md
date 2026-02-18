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

When someone comments `/fix` on a pull request or issue, investigate failing CI checks and propose fixes.

## Context

This blog repository has two GitHub Actions workflows:

### 1. Generate Audio Summaries (`generate-audio.yml`)

- **Trigger**: Push to `main` on `content/**` paths
- **What it does**: Installs Node.js 22, runs `scripts/` to generate audio summaries using OpenAI API
- **Common failure points**: OpenAI API errors, missing OPENAI_API_KEY secret, Node.js version incompatibility, script crashes in `scripts/index.ts`
- **Auto-commits**: Changes to `content/**` and `audio-summary/**`

### 2. Deployment Prod (`deployment-prod.yml`)

- **Trigger**: Push to `main` (excluding content/audio-summary) OR after Generate Audio completes
- **What it does**: Installs dependencies with yarn, builds with `yarn generate:prod`, deploys to Netlify
- **Common failure points**: Build errors in Nuxt, TypeScript type errors, dependency resolution issues, Netlify deployment failures
- **Key env vars**: SUBSCRIBE_TO_NEWSLETTERS_URL, CONTACT_FORM_URL, UNSUBSCRIBE_TO_NEWSLETTERS_URL, RE_CAPTCHA_SITE_KEY, GOOGLE_ANALYTICS_ID, NETLIFY_AUTH_TOKEN, NETLIFY_SITE_ID

### Tech Stack

- Nuxt 3 (v4.3.1) with TypeScript
- Yarn 1.22.19 as package manager
- Node.js 22
- Netlify for hosting
- Firebase Cloud Functions (in `functions/` directory)

## What to Do

1. **Detect the command**: Only act when the first line of the comment is `/fix`
2. **Find failing workflows**: Check the pull request (or referenced PR in the issue) for failing CI check runs
3. **Analyze failure logs**: Read the workflow run logs to identify the specific error
4. **Categorize the failure**:
    - **Build error**: TypeScript compilation, Nuxt build, or module resolution issues
    - **Dependency error**: Yarn install failures, version conflicts, missing packages
    - **Deployment error**: Netlify deploy issues, environment variable problems
    - **Audio generation error**: OpenAI API failures, script execution errors
    - **Test/lint error**: Any linting or type-checking failures
5. **Research the codebase**: Look at relevant files to understand the error context
6. **Propose a fix**: Either:
    - Post a detailed comment explaining the root cause and suggesting specific code changes
    - OR create a pull request with the actual fix if the change is straightforward and safe

## Response Format

Post a comment with:

- **Diagnosis**: What failed and why (include relevant log excerpts)
- **Root Cause**: The underlying issue
- **Suggested Fix**: Specific code changes or configuration updates needed
- **Prevention**: How to avoid this issue in the future

If creating a PR with a fix:

- Keep the change minimal and focused
- Explain the fix clearly in the PR description
- Reference the original failing workflow run
