#!/bin/bash

# Vercel Ignored Build Step Script
# Usage: Set "Ignored Build Step" command in Vercel to: bash apps/frontend/vercel-ignore-build.sh

# 1. Get current branch (Vercel sets VERCEL_GIT_COMMIT_REF)
BRANCH=${VERCEL_GIT_COMMIT_REF:-$(git rev-parse --abbrev-ref HEAD)}
echo "📍 Current branch: $BRANCH"

# 2. RULE: Only deploy 'main' branch
# Change 'main' to 'master' or 'prod' if you use a different name.
if [[ "$BRANCH" != "main" ]]; then
  echo "🛑 Skipping build: Not on 'main' branch."
  # Exit 0 tells Vercel to CANCEL the build (save resources)
  exit 0
fi

# 3. RULE: Only deploy if changes occurred in apps/frontend
# We check the difference between the current commit (HEAD) and the previous one (HEAD^)
# relative to the apps/frontend directory.
echo "🔍 Checking for changes in apps/frontend..."

# git diff --quiet returns:
# 1 if there ARE changes (Process continues)
# 0 if there are NO changes (Process cancels)
git diff --quiet HEAD^ HEAD apps/frontend/
