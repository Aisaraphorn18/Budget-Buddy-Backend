#!/usr/bin/env sh

# Shared utility functions for Husky git hooks
# This script provides common functionality for finding and using bun

# Function to find bun executable across different platforms and installation methods
find_bun() {
  # Check common bun installation paths
  local bun_paths=(
    "$HOME/.bun/bin/bun"           # Default bun installation
    "/opt/homebrew/bin/bun"        # macOS Homebrew (Apple Silicon)
    "/usr/local/bin/bun"           # macOS Homebrew (Intel) / Linux
    "/usr/bin/bun"                 # Linux system installation
    "/usr/local/share/bun/bin/bun" # Alternative Linux installation
    "$(which bun 2>/dev/null)"     # Check if bun is in PATH
  )
  
  for bun_path in "${bun_paths[@]}"; do
    if [ -n "$bun_path" ] && [ -x "$bun_path" ]; then
      echo "$bun_path"
      return 0
    fi
  done
  
  return 1
}

# Function to ensure bun is available and set BUN_EXEC variable
ensure_bun() {
  BUN_EXEC=$(find_bun)
  if [ -z "$BUN_EXEC" ]; then
    echo ""
    echo "❌ Bun is required for this project but not found!"
    echo "📥 Please install bun: https://bun.sh/docs/installation"
    echo ""
    echo "Quick install commands:"
    echo "  # Using install script (recommended):"
    echo "  curl -fsSL https://bun.sh/install | bash"
    echo ""
    echo "  # Using package managers:"
    echo "  brew install bun          # macOS Homebrew"
    echo "  scoop install bun         # Windows Scoop"
    echo "  npm install -g bun        # npm (fallback)"
    echo ""
    echo "After installation, restart your terminal and try again."
    echo ""
    exit 1
  fi
  
  echo "✅ Using bun: $BUN_EXEC"
  export BUN_EXEC
}

# Function to run bun commands with proper error handling
run_bun() {
  if [ -z "$BUN_EXEC" ]; then
    ensure_bun
  fi
  
  "$BUN_EXEC" "$@"
}

# Function to run bunx commands with proper error handling
run_bunx() {
  if [ -z "$BUN_EXEC" ]; then
    ensure_bun
  fi
  
  "$BUN_EXEC"x "$@"
}
