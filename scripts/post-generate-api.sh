#!/bin/bash

# Post-generation script to customize generated API code
# This script runs after openapi-typescript-codegen generates the code

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
GENERATED_DIR="apps/web-antd/src/api/generated"
TEMPLATES_DIR="apps/web-antd/src/api/generated-templates"

echo "Running post-generation customization..."

# Remove eslint-disable comments from generated files
find "$GENERATED_DIR" -name '*.ts' ! -name 'request.ts' ! -name 'configure.ts' -exec sed -i '/\/\* eslint-disable \*\//d' {} +
echo "✓ Removed eslint-disable comments"

# Copy custom request.ts from templates
if [ -f "$TEMPLATES_DIR/request.ts" ]; then
  cp "$TEMPLATES_DIR/request.ts" "$GENERATED_DIR/core/request.ts"
  echo "✓ Applied custom request.ts"
fi

# Copy configure.ts from templates
if [ -f "$TEMPLATES_DIR/configure.ts" ]; then
  cp "$TEMPLATES_DIR/configure.ts" "$GENERATED_DIR/configure.ts"
  echo "✓ Applied custom configure.ts"
fi

echo "Post-generation customization complete!"
