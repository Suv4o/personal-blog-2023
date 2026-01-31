---
title: How to Run and Debug Your GitHub Workflows Locally
description: Learn how to run and debug GitHub Actions workflows locally using act. This comprehensive guide covers installation, running workflows, handling secrets, matrix builds, caching, and multi-job pipelines. Stop the commit-push-wait-fail cycle and catch issues before they reach your repository.
image: https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_1200,e_sharpen:100/v1769425117/blog/how-to-run-and-debug-your-github-workflows-locally/how-to-run-and-debug-your-github-workflows-locally_afbogh
keywords:
    - GitHub Actions
    - act CLI
    - local workflow testing
    - CI/CD debugging
    - GitHub Actions locally
    - Docker containers
    - workflow automation
    - cron jobs
    - matrix builds
    - secrets management
    - environment variables
    - TypeScript workflows
    - Python workflows
    - multi-job pipelines
    - GitHub runner
    - workflow dispatch
    - dependency caching
    - VSCode extension
    - GitHub Local Actions
    - Apple Silicon
type: page
blog: post
published: 1st February 2026
readTime: 8
author: Aleksandar Trpkovski
articleTags:
    - DevOps
    - Productivity
    - BackEnd
---

# How to Run and Debug Your GitHub Workflows Locally

_{{$document.published}} • {{$document.readTime}} min read — by **[{{$document.author}}](/)**_

::tag-pills{:tags="articleTags"}
::

::audio-player{:audioSrc="https://cdn.jsdelivr.net/gh/Suv4o/personal-blog-2023/audio-summary/2026/02/01/how-to-run-and-debug-your-github-workflows-locally/summary.mp3" :transcriptSrc="https://cdn.jsdelivr.net/gh/Suv4o/personal-blog-2023/audio-summary/2026/02/01/how-to-run-and-debug-your-github-workflows-locally/summary.json"}
::

![Landing Image](https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_750,e_sharpen:100/v1769425117/blog/how-to-run-and-debug-your-github-workflows-locally/how-to-run-and-debug-your-github-workflows-locally_afbogh)

> **_Test your workflows before you push a commit._**

If you've ever worked with GitHub Actions, you've probably experienced this loop: make a change to your workflow file, commit it, push it, wait for the runner to pick it up, watch it fail because of a typo, fix it, commit again, push again, wait again…

For something that's supposed to **automate** work, that feedback loop can feel painfully slow - especially when the mistake is something trivial like a missing indent or a typo in a step name.

What if you could run your GitHub Actions **locally**, on your own machine, and catch those problems instantly?

That's exactly what <a href="https://github.com/nektos/act" target="_blank" rel="noopener noreferrer">**act**</a> does.

**act** is a small CLI tool that executes GitHub Actions workflows locally using Docker. It reads the same `.github/workflows/*.yml` files you already have and runs them in containers that closely resemble GitHub's hosted runners.

In this article, we'll explain how **act** works, then walk through **practical, real-world examples -** from simple push triggers to cron jobs, Python and TypeScript workflows, matrix builds, secrets, caching, and multi-job pipelines.

Let's dive in.

## Why Test GitHub Actions Locally?

![Why Test GitHub Actions Locally](https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_750,e_sharpen:100/v1769425116/blog/how-to-run-and-debug-your-github-workflows-locally/why-test-github-actions-locally_yjdtcz)

Before we dive into the setup, let's talk about why this matters.

GitHub Actions is powerful. It handles CI/CD, automation, scheduled tasks, and much more. But the feedback loop can be painfully slow. Every time you want to test a change, you need to:

1. Commit your changes
2. Push to GitHub
3. Wait for a runner to become available
4. Watch your workflow execute (or fail)
5. Read through logs to find the issue
6. Repeat

For complex workflows, this cycle can eat up hours of your day. And if you're on a team with limited GitHub Actions minutes (for **private repositories**, each GitHub account receives <a href="https://docs.github.com/en/billing/concepts/product-billing/github-actions" target="_blank" rel="noopener noreferrer">2,000 free minutes per month</a>), those failed runs add up quickly.

**act** solves this by bringing the execution environment to your machine. It reads your `.github/workflows/` directory, pulls the necessary Docker images, and runs your workflows locally - with the same environment variables and filesystem structure that GitHub provides.

The result? You catch issues before they ever reach your repository.

## Prerequisites

Before we begin, you'll need three things installed on your machine:

1. **act** - the CLI tool that lets you run GitHub Actions locally
2. **Docker Desktop** - **act** uses Docker containers to simulate GitHub's runners
3. <a href="https://brew.sh/" target="_blank" rel="noopener noreferrer">**Homebrew**</a> - we'll use it to install **act** and **Docker Desktop** (on macOS or Linux)

> On Windows, Homebrew isn't available - you'll need to use a different package manager.

Let's get everything set up.

### Installing Docker Desktop

If you don't have Docker installed yet, the easiest way on macOS is through Homebrew:

```bash
brew install --cask docker-desktop
```

After installation, open Docker Desktop from your Applications folder. You'll see the Docker whale icon appear in your menu bar once it's running.

To verify Docker is working correctly, run:

```bash
docker --version
```

You should see something like:

```
Docker version 24.0.6, build ed223bc
```

> Make sure Docker Desktop is actually running before you try to use **act**. The Docker daemon needs to be active for **act** to create and manage containers.

### Installing act

With Homebrew ready, installing **act** is straightforward:

```bash
brew install act
```

Verify the installation:

```bash
act --version
```

You should see output like:

```
act version 0.2.84
```

That's it for the prerequisites. You're ready to start running GitHub Actions locally.

## Your First Local Workflow

Let's start with the basics. Create a simple workflow file at `.github/workflows/simple-push.yml`:

```yaml
name: 01 - Simple Push Action

on:
    push:
        branches:
            - main
            - develop
    pull_request:
        branches:
            - main

jobs:
    greeting:
        runs-on: ubuntu-latest
        steps:
            - name: Checkout code
              uses: actions/checkout@v4

            - name: Say Hello
              run: echo "Hello from GitHub Actions!"

            - name: Show current date
              run: date

            - name: List files in repository
              run: ls -la

            - name: Show environment info
              run: |
                  echo "Runner OS: $RUNNER_OS"
                  echo "GitHub Actor: $GITHUB_ACTOR"
                  echo "GitHub Repository: $GITHUB_REPOSITORY"
                  echo "GitHub Event: $GITHUB_EVENT_NAME"
```

This workflow triggers on `push` and `pull request` events, checks out your code, and displays basic information.

Now for the moment of truth - run the following command in your terminal.

```bash
act push
```

The first time you run **act**, it will ask you to choose a default Docker image size:

- **Micro** - Lightweight and fast, but with limited tools
- **Medium** - A good balance (recommended for most use cases)
- **Large** - Full GitHub runner compatibility, but very large (~20GB)

I recommend starting with **Medium**. You can always change this later.

After selecting an image, **act** will pull the necessary Docker container and execute your workflow. You should see output similar to:

```
[01 - Simple Push Action/greeting] ⭐ Run Set up job
[01 - Simple Push Action/greeting]   ✅  Success - Set up job
[01 - Simple Push Action/greeting] ⭐ Run Main Checkout code
[01 - Simple Push Action/greeting]   ✅  Success - Main Checkout code
[01 - Simple Push Action/greeting] ⭐ Run Main Say Hello
[01 - Simple Push Action/greeting]   | Hello from GitHub Actions!
[01 - Simple Push Action/greeting]   ✅  Success - Main Say Hello
...
[01 - Simple Push Action/greeting] 🏁  Job succeeded
```

Congratulations! You just ran your first GitHub Actions workflow locally.

## A Note for macOS and Apple Silicon Users

> If you're on a Mac with an M1, M2, or M3 chip, you might encounter some issues with Docker containers. The GitHub Actions runners are built for x86_64 architecture, and your Mac uses ARM.

To avoid problems, I recommend creating a `.actrc` file in your project root with these settings:

```
# Default act configuration

# Use medium-sized Ubuntu image
-P ubuntu-latest=catthehacker/ubuntu:act-latest
-P ubuntu-22.04=catthehacker/ubuntu:act-22.04
-P ubuntu-20.04=catthehacker/ubuntu:act-20.04

# Enable artifact server for artifact workflows
--artifact-server-path /tmp/artifacts

# macOS / Apple Silicon: Required for Docker Desktop compatibility
--container-architecture linux/amd64
--container-daemon-socket=-
```

With this configuration, **act** will automatically use the correct architecture and settings every time you run it.

Alternatively, you can pass these flags manually:

```bash
act push --container-architecture linux/amd64 --container-daemon-socket=-
```

## Running Scheduled Workflows (Cron Jobs)

GitHub Actions supports scheduled workflows using cron expressions. Let's create one.

Create `.github/workflows/cron-schedule.yml`:

```yaml
name: 02 - Cron Scheduled Action

on:
    schedule:
        # Runs every day at midnight UTC
        - cron: "0 0 * * *"
        # Runs every Monday at 9am UTC
        - cron: "0 9 * * 1"
    # Allow manual trigger for testing
    workflow_dispatch:

jobs:
    scheduled-task:
        runs-on: ubuntu-latest
        steps:
            - name: Checkout code
              uses: actions/checkout@v4

            - name: Display scheduled run info
              run: |
                  echo "Scheduled job running!"
                  echo "Current time: $(date)"
                  echo "Triggered by: ${{ github.event_name }}"

            - name: Simulate daily cleanup task
              run: |
                  echo "Performing daily cleanup..."
                  echo "Checking for stale files..."
                  echo "Cleanup complete!"

            - name: Generate daily report
              run: |
                  echo "=== Daily Report ==="
                  echo "Date: $(date +%Y-%m-%d)"
                  echo "Repository: $GITHUB_REPOSITORY"
                  echo "Branch: $GITHUB_REF"
                  echo "===================="
```

To run this locally, use the `schedule` event:

```bash
act schedule -W .github/workflows/cron-schedule.yml
```

The `-W` flag specifies which workflow file to run. This is useful when you have multiple workflows and want to test a specific one.

## Running Python in GitHub Actions

Let's get more practical. Here's a workflow that sets up Python, runs a script, and executes inline Python code.

First, create a Python script at `scripts/hello.py`:

```python
#!/usr/bin/env python3
"""
Simple Python script for GitHub Actions demonstration.
"""

import os
from datetime import datetime

def main():
    print("=" * 50)
    print("Hello from Python GitHub Action!")
    print("=" * 50)
    print(f"Current time: {datetime.now()}")
    print(f"Working directory: {os.getcwd()}")

    # Show some environment variables if available
    github_vars = [
        "GITHUB_REPOSITORY",
        "GITHUB_ACTOR",
        "GITHUB_EVENT_NAME",
        "GITHUB_REF",
    ]

    print("\nGitHub Environment Variables:")
    for var in github_vars:
        value = os.environ.get(var, "Not set")
        print(f"  {var}: {value}")

    print("=" * 50)
    print("Python script executed successfully!")
    print("=" * 50)

if __name__ == "__main__":
    main()
```

Now create the workflow at `.github/workflows/python-action.yml`:

```yaml
name: 03 - Python Action

on:
    push:
        paths:
            - "**.py"
            - ".github/workflows/python-action.yml"
    workflow_dispatch:

jobs:
    python-job:
        runs-on: ubuntu-latest
        steps:
            - name: Checkout code
              uses: actions/checkout@v4

            - name: Set up Python
              uses: actions/setup-python@v5
              with:
                  python-version: "3.12"

            - name: Display Python version
              run: python --version

            - name: Run Python script
              run: python scripts/hello.py

            - name: Run inline Python code
              run: |
                  python << 'EOF'
                  import sys
                  import platform
                  import datetime

                  print("=" * 50)
                  print("Python Runtime Information")
                  print("=" * 50)
                  print(f"Python Version: {sys.version}")
                  print(f"Platform: {platform.platform()}")
                  print(f"Current Time: {datetime.datetime.now()}")
                  print("=" * 50)

                  # Simple calculation
                  numbers = [1, 2, 3, 4, 5]
                  print(f"Sum of {numbers} = {sum(numbers)}")
                  print(f"Average = {sum(numbers) / len(numbers)}")
                  print("=" * 50)
                  EOF
```

Run it:

```bash
act push -W .github/workflows/python-action.yml -j python-job
```

The `-j` flag lets you run a specific job within a workflow. This is handy when your workflow has multiple jobs and you only want to test one.

## Running TypeScript in GitHub Actions

TypeScript workflows are similar, but we need to set up Node.js and install a TypeScript runner. I recommend using `tsx` as it handles ESM modules gracefully.

Create `scripts/hello.ts`:

```ts
#!/usr/bin/env ts-node
/**
 * Simple TypeScript script for GitHub Actions demonstration.
 */

interface GitHubEnvVars {
    repository: string;
    actor: string;
    eventName: string;
    ref: string;
}

function getGitHubEnvVars(): GitHubEnvVars {
    return {
        repository: process.env.GITHUB_REPOSITORY || "Not set",
        actor: process.env.GITHUB_ACTOR || "Not set",
        eventName: process.env.GITHUB_EVENT_NAME || "Not set",
        ref: process.env.GITHUB_REF || "Not set",
    };
}

function main(): void {
    console.log("=".repeat(50));
    console.log("Hello from TypeScript GitHub Action!");
    console.log("=".repeat(50));
    console.log(`Current time: ${new Date().toISOString()}`);
    console.log(`Working directory: ${process.cwd()}`);

    const envVars = getGitHubEnvVars();

    console.log("\nGitHub Environment Variables:");
    console.log(`  GITHUB_REPOSITORY: ${envVars.repository}`);
    console.log(`  GITHUB_ACTOR: ${envVars.actor}`);
    console.log(`  GITHUB_EVENT_NAME: ${envVars.eventName}`);
    console.log(`  GITHUB_REF: ${envVars.ref}`);

    console.log("=".repeat(50));
    console.log("TypeScript script executed successfully!");
    console.log("=".repeat(50));
}

main();
```

And the workflow at `.github/workflows/typescript-action.yml`:

```yaml
name: 04 - TypeScript Action

on:
    push:
        paths:
            - "**.ts"
            - "**.js"
            - ".github/workflows/typescript-action.yml"
    workflow_dispatch:

jobs:
    typescript-job:
        runs-on: ubuntu-latest
        steps:
            - name: Checkout code
              uses: actions/checkout@v4

            - name: Set up Node.js
              uses: actions/setup-node@v4
              with:
                  node-version: "20"

            - name: Display Node.js version
              run: node --version

            - name: Install TypeScript
              run: npm install -g typescript tsx

            - name: Run TypeScript script
              run: npx tsx scripts/hello.ts
```

Run it:

```bash
act push -W .github/workflows/typescript-action.yml -j typescript-job
```

## Manual Triggers with Input Parameters

Sometimes you want to trigger a workflow manually with custom inputs - like deploying to a specific environment or running with debug mode enabled.

Create `.github/workflows/workflow-dispatch.yml`:

```yaml
name: 05 - Manual Trigger (workflow_dispatch)

on:
    workflow_dispatch:
        inputs:
            environment:
                description: "Deployment environment"
                required: true
                default: "staging"
                type: choice
                options:
                    - development
                    - staging
                    - production
            log_level:
                description: "Log level"
                required: false
                default: "info"
                type: choice
                options:
                    - debug
                    - info
                    - warning
                    - error
            dry_run:
                description: "Perform a dry run without making changes"
                required: false
                default: true
                type: boolean
            version:
                description: "Version to deploy (e.g., v1.0.0)"
                required: false
                type: string

jobs:
    deploy:
        runs-on: ubuntu-latest
        steps:
            - name: Checkout code
              uses: actions/checkout@v4

            - name: Display inputs
              run: |
                  echo "=== Workflow Dispatch Inputs ==="
                  echo "Environment: ${{ inputs.environment }}"
                  echo "Log Level: ${{ inputs.log_level }}"
                  echo "Dry Run: ${{ inputs.dry_run }}"
                  echo "Version: ${{ inputs.version || 'latest' }}"
                  echo "================================"

            - name: Simulate deployment
              run: |
                  echo "Starting deployment process..."
                  echo "Target environment: ${{ inputs.environment }}"

                  if [ "${{ inputs.dry_run }}" = "true" ]; then
                    echo "[DRY RUN] Would deploy version ${{ inputs.version || 'latest' }} to ${{ inputs.environment }}"
                  else
                    echo "Deploying version ${{ inputs.version || 'latest' }} to ${{ inputs.environment }}"
                  fi

                  echo "Deployment simulation complete!"
```

To run this with custom inputs:

```bash
act workflow_dispatch -W .github/workflows/workflow-dispatch.yml \
  --input environment=production \
  --input log_level=debug \
  --input dry_run=false \
  --input version=v2.0.0
```

This is incredibly useful for testing deployment scripts before actually deploying.

## Multi-Job Workflows with Dependencies

Real-world CI/CD pipelines often have multiple jobs that depend on each other. Let's create a workflow that demonstrates this pattern.

Create `.github/workflows/multi-job-dependencies.yml`:

```yaml
name: 06 - Multi-Job with Dependencies

on:
    push:
        branches:
            - main
    workflow_dispatch:

jobs:
    build:
        runs-on: ubuntu-latest
        outputs:
            build_id: ${{ steps.build_step.outputs.build_id }}
        steps:
            - name: Checkout code
              uses: actions/checkout@v4

            - name: Build step
              id: build_step
              run: |
                  echo "Building the project..."
                  BUILD_ID="build-$(date +%Y%m%d%H%M%S)"
                  echo "build_id=$BUILD_ID" >> $GITHUB_OUTPUT
                  echo "Build ID: $BUILD_ID"
                  echo "Build completed successfully!"

    test:
        needs: build
        runs-on: ubuntu-latest
        steps:
            - name: Checkout code
              uses: actions/checkout@v4

            - name: Run tests
              run: |
                  echo "Running tests for build: ${{ needs.build.outputs.build_id }}"
                  echo "Test 1: Unit tests... PASSED"
                  echo "Test 2: Integration tests... PASSED"
                  echo "Test 3: E2E tests... PASSED"
                  echo "All tests passed!"

    lint:
        needs: build
        runs-on: ubuntu-latest
        steps:
            - name: Checkout code
              uses: actions/checkout@v4

            - name: Run linting
              run: |
                  echo "Running linting for build: ${{ needs.build.outputs.build_id }}"
                  echo "Checking code style..."
                  echo "Checking for common issues..."
                  echo "Linting passed!"

    deploy:
        needs: [test, lint]
        runs-on: ubuntu-latest
        steps:
            - name: Checkout code
              uses: actions/checkout@v4

            - name: Deploy
              run: |
                  echo "All checks passed!"
                  echo "Deploying build: ${{ needs.build.outputs.build_id }}"
                  echo "Deployment successful!"
```

Notice how:

- `test` and `lint` both depend on `build` (they run in parallel after build completes)
- `deploy` depends on both `test` and `lint` (it only runs after both pass)
- The `build_id` output is passed between jobs using `$GITHUB_OUTPUT`

Run it:

```bash
act push -W .github/workflows/multi-job-dependencies.yml
```

## Matrix Builds

Matrix builds let you test across multiple configurations - different Node versions, operating systems, or any combination of parameters.

Create `.github/workflows/matrix-build.yml`:

```yaml
name: 07 - Matrix Build Strategy

on:
    push:
        branches:
            - main
    workflow_dispatch:

jobs:
    matrix-simple:
        runs-on: ubuntu-latest
        strategy:
            matrix:
                node: [18, 20, 22]
        steps:
            - name: Checkout code
              uses: actions/checkout@v4

            - name: Setup Node.js ${{ matrix.node }}
              uses: actions/setup-node@v4
              with:
                  node-version: ${{ matrix.node }}

            - name: Display versions
              run: |
                  echo "Node version: $(node --version)"
                  echo "npm version: $(npm --version)"
```

To run a specific matrix combination:

```bash
act push -W .github/workflows/matrix-build.yml --matrix node:20
```

## Working with Secrets and Environment Variables

Workflows often need access to secrets - API keys, deployment tokens, and so on. Here's how to handle them with act.

Create `.github/workflows/secrets-and-env.yml`:

```yaml
name: 08 - Secrets and Environment Variables

on:
    push:
        branches:
            - main
    workflow_dispatch:

env:
    # Workflow-level environment variables
    APP_NAME: "my-awesome-app"
    APP_VERSION: "1.0.0"

jobs:
    secrets-demo:
        runs-on: ubuntu-latest
        steps:
            - name: Checkout code
              uses: actions/checkout@v4

            - name: Use secrets (masked in logs)
              env:
                  API_KEY: ${{ secrets.API_KEY }}
                  DATABASE_PASSWORD: ${{ secrets.DATABASE_PASSWORD }}
              run: |
                  echo "=== Working with Secrets ==="
                  echo "Secrets are automatically masked in logs"

                  if [ -n "$API_KEY" ]; then
                    echo "API_KEY is set (value hidden)"
                  else
                    echo "API_KEY is not set - provide via 'act -s API_KEY=value'"
                  fi
```

To pass secrets to act:

```bash
# Inline secrets
act push -s API_KEY=my-api-key -s DATABASE_PASSWORD=my-password

# From a file (create .secrets with KEY=value pairs)
act push --secret-file .secrets

# Using GitHub CLI token
act push -s GITHUB_TOKEN="$(gh auth token)"
```

> Never commit your `.secrets` file! Add it to `.gitignore`.

## Caching Dependencies

Caching can significantly speed up your workflows. Here's how to set it up.

First, make sure you have `package.json` and `requirements.txt` in your project root:

**package.json:**

```json
{
    "name": "act-demo",
    "version": "1.0.0",
    "dependencies": {
        "lodash": "^4.17.21"
    }
}
```

**requirements.txt:**

```
requests==2.31.0
```

Generate the lock file:

```bash
npm install --package-lock-only
```

Now create `.github/workflows/caching.yml`:

```yaml
name: 11 - Caching Dependencies

on:
    push:
        branches:
            - main
    workflow_dispatch:

jobs:
    cache-npm:
        runs-on: ubuntu-latest
        steps:
            - name: Checkout code
              uses: actions/checkout@v4

            - name: Setup Node.js with cache
              uses: actions/setup-node@v4
              with:
                  node-version: "20"
                  cache: "npm"

            - name: Install dependencies
              run: npm install

            - name: Verify installation
              run: |
                  echo "Node modules installed:"
                  ls node_modules/

    cache-pip:
        runs-on: ubuntu-latest
        steps:
            - name: Checkout code
              uses: actions/checkout@v4

            - name: Setup Python with cache
              uses: actions/setup-python@v5
              with:
                  python-version: "3.12"
                  cache: "pip"

            - name: Install dependencies
              run: pip install -r requirements.txt

            - name: Verify installation
              run: |
                  python -c "import requests; print(f'requests version: {requests.__version__}')"
```

Run it:

```bash
act push -W .github/workflows/caching.yml
```

The first run will install dependencies. Subsequent runs will restore them from cache - much faster!

## The VSCode Extension

By now, we've been running GitHub Actions locally through the command line - and for many developers, that's perfectly fine. But if you prefer a more visual approach, there's a fantastic VSCode extension called <a href="https://sanjulaganepola.github.io/github-local-actions-docs/" target="_blank" rel="noopener noreferrer">**GitHub Local Actions**</a> that lets you run workflows with the click of a button.

The extension is built on top of the same **act** CLI we've been using, so everything we've learned still applies. It just wraps it in a friendly interface that integrates directly into your editor.

### Running a Workflow

With the extension, running a workflow is as simple as:

1. Open the **Workflows** view in the sidebar
2. Find your workflow (e.g., "Simple Push Action")
3. Click the **play button** next to it

The extension builds the appropriate **act** command behind the scenes and runs it as a VSCode task. You'll see the output in the integrated terminal, complete with the same colourful logs you'd see from the CLI.

You can also right-click on a specific job within a workflow to run just that job - useful when you're debugging one part of a multi-job pipeline.

### Managing Secrets and Variables

Remember how we passed secrets via `-s API_KEY=value` on the command line? The extension makes this easier:

1. Open the **Settings** view
2. Navigate to **Secrets**
3. Add your secrets with their values

They're stored securely and automatically passed to your workflow runs. The same goes for variables, inputs, and runner configurations.

## Wrapping Up

This is a tool I wish I'd known about much earlier - it would have saved me a lot of time. It's simple but powerful, and for workflows that need testing, it can dramatically reduce iteration time.

I've documented this for myself so I can come back sometime in the future when I need to test my workflows and remind myself from this article.

I've shown a few examples here, but there are even more in the following repo. You can find all these examples and additional ones here:

**Repository**: <a href="https://github.com/Suv4o/run-your-github-actions-locally-with-act" target="_blank" rel="noopener noreferrer">run-your-github-actions-locally-with-act</a>

Happy testing!
