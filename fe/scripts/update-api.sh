#!/bin/bash
set -e

SDK_DIR="sdk"
OPENAPI_URL="http://localhost:8000/api/openapi.json"
OPENAPI_FILE="${SDK_DIR}/openapi.json"
OUTPUT_FILE="${SDK_DIR}/output/client.gen.ts"

mkdir -p "${SDK_DIR}"

# Fetch OpenAPI spec
curl -f "${OPENAPI_URL}" -o "${OPENAPI_FILE}"

# Generate TypeScript client
bun openapi-ts

# Copy template if needed
cp "${SDK_DIR}/templates/client.gen.txt" "${OUTPUT_FILE}"
