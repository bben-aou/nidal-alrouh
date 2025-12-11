#!/bin/bash

# Vercel Ignored Build Step Script

# Ensure we are in the repository root so paths work correctly
cd "$(git rev-parse --show-toplevel)"

# 1. Get current branch (Vercel sets VERCEL_GIT_COMMIT_REF)
BRANCH=${VERCEL_GIT_COMMIT_REF:-$(git rev-parse --abbrev-ref HEAD)}
echo "📍 Current branch: $BRANCH"

# 2. RULE: Only deploy 'main' branch
if [[ "$BRANCH" != "main" ]]; then
  echo "🛑 Skipping build: Not on 'main' branch."
  exit 0
fi

# 3. RULE: Only deploy if changes occurred in apps/frontend
echo "🔍 Checking for changes in apps/frontend..."

# git diff --quiet returns:
# 1 if there ARE changes (Process continues)
# 0 if there are NO changes (Process cancels)
git diff --quiet HEAD^ HEAD apps/frontend/
