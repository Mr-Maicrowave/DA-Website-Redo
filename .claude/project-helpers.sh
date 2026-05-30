#!/bin/bash
# Project-specific governance helpers

source "$HOME/.claude-governance/config/governance-config.json" 2>/dev/null || true

# Project-specific commands based on detected tools
case "$1" in
    "test")
        echo "🧪 Running project tests..."
        if [ -f "package.json" ]; then
            npm test
        elif [ -f "Cargo.toml" ]; then
            cargo test
        elif [ -f "go.mod" ]; then
            go test ./...
        elif [ -f "requirements.txt" ]; then
            python -m pytest
        else
            echo "No test framework detected"
        fi
        ;;
    "lint")
        echo "🔍 Running linting..."
        if command -v eslint >/dev/null 2>&1; then
            eslint .
        elif command -v cargo >/dev/null 2>&1; then
            cargo clippy
        elif command -v golint >/dev/null 2>&1; then
            golint ./...
        else
            echo "No linter detected"
        fi
        ;;
    "build")
        echo "🔨 Building project..."
        if [ -f "package.json" ]; then
            npm run build 2>/dev/null || npm run dev
        elif [ -f "Cargo.toml" ]; then
            cargo build
        elif [ -f "go.mod" ]; then
            go build
        else
            echo "No build script detected"
        fi
        ;;
    "status")
        echo "📊 Project Status:"
        echo "  Type: $(jq -r '.projectType' .claude-project.json 2>/dev/null || echo 'Unknown')"
        echo "  Stack: $(jq -r '.techStack' .claude-project.json 2>/dev/null || echo 'Unknown')"
        if git rev-parse --git-dir >/dev/null 2>&1; then
            echo "  Branch: $(git branch --show-current)"
            echo "  Uncommitted: $(git status --porcelain | wc -l) files"
        fi
        ;;
    *)
        echo "Available commands: test, lint, build, status"
        ;;
esac
