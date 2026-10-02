#!/bin/sh
set -e

if ! command -v npx >/dev/null 2>&1; then
  echo "Error: npx is required but was not found on your PATH." >&2
  echo "Install Node.js, then re-run this script." >&2
  exit 1
fi

npx skills add --all --global --yes https://github.com/fnlowl/skills
