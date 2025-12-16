module.exports = {
  "!(src/sdk|**/sdk)/**/*.{js,jsx,ts,tsx}": [
    "eslint --fix",
    "prettier --write",
    () => "bun run build",
  ],
  "**/*.{json,md,css,scss,yaml,yml}": ["prettier --write"],
};
