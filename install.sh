#!/bin/sh
set -e

if ! command -v npx >/dev/null 2>&1; then
  echo "Error: npx is required but was not found on your PATH." >&2
  echo "Install Node.js, then re-run this script." >&2
  exit 1
fi

# One agent only (default Claude Code). Without --agent a non-interactive run
# installs into every supported agent, which writes into dozens of folders.
# Usage: ./install.sh [agent-id]   e.g. ./install.sh codex
npx skills add https://github.com/fnlowl/skills --global --yes --agent "${1:-claude-code}"
