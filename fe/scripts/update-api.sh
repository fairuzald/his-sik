#!/bin/bash
mkdir -p sdk
curl http://localhost:8000/api/openapi.json -o sdk/openapi.json
bun openapi-ts
