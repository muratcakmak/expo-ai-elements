# Release Infrastructure Setup Guide

This guide sets up automated npm publishing with OIDC trusted publishing, conventional commits, changelog automation, and GitHub Actions CI/CD — matching the expo-ai-composer setup.

## Prerequisites

- Node.js >= 22
- pnpm installed
- `gh` CLI authenticated
- npm account with 2FA

---

## Step 1: Update package.json for publishing

Add these fields to the root `package.json`:

```json
{
  "publishConfig": {
    "access": "public"
  },
  "files": [
    "src/",
    "README.md",
    "LICENSE"
  ],
  "repository": {
    "type": "git",
    "url": "git+https://github.com/muratcakmak/expo-ai-elements.git"
  },
  "bugs": {
    "url": "https://github.com/muratcakmak/expo-ai-elements/issues"
  },
  "homepage": "https://github.com/muratcakmak/expo-ai-elements#readme"
}
```

Add release scripts to `"scripts"`:

```json
{
  "release": "standard-version",
  "release:patch": "standard-version --release-as patch",
  "release:minor": "standard-version --release-as minor",
  "release:major": "standard-version --release-as major",
  "release:dry": "standard-version --dry-run",
  "prepare": "husky"
}
```

Add dev dependencies:

```bash
pnpm add -D @commitlint/cli @commitlint/config-conventional husky standard-version
```

---

## Step 2: Create CHANGELOG.md

Create `CHANGELOG.md` in the repo root:

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2025-03-24

### Added

- Initial implementation: 48 React Native components for AI chat interfaces
- Expo port of Vercel AI Elements
- Working example app

[Unreleased]: https://github.com/muratcakmak/expo-ai-elements/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/muratcakmak/expo-ai-elements/releases/tag/v0.1.0
```

---

## Step 3: Add standard-version config

Create `.versionrc.js`:

```js
module.exports = {
  types: [
    { type: 'feat', section: 'Added' },
    { type: 'fix', section: 'Fixed' },
    { type: 'perf', section: 'Changed' },
    { type: 'refactor', section: 'Changed' },
    { type: 'revert', section: 'Removed' },
    { type: 'docs', hidden: true },
    { type: 'style', hidden: true },
    { type: 'chore', hidden: true },
    { type: 'test', hidden: true },
    { type: 'build', hidden: true },
    { type: 'ci', hidden: true },
  ],
  commitUrlFormat:
    'https://github.com/muratcakmak/expo-ai-elements/commit/{{hash}}',
  compareUrlFormat:
    'https://github.com/muratcakmak/expo-ai-elements/compare/{{previousTag}}...{{currentTag}}',
  issueUrlFormat:
    'https://github.com/muratcakmak/expo-ai-elements/issues/{{id}}',
  releaseCommitMessageFormat: 'chore(release): {{currentTag}}',
  tagPrefix: 'v',
  packageFiles: ['package.json'],
  bumpFiles: ['package.json'],
};
```

---

## Step 4: Add commitlint config

Create `commitlint.config.js`:

```js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', 'fix', 'docs', 'style', 'refactor',
        'perf', 'test', 'chore', 'ci', 'build', 'revert',
      ],
    ],
    'subject-max-length': [2, 'always', 72],
  },
};
```

---

## Step 5: Set up husky

```bash
npx husky init
```

Create `.husky/commit-msg`:

```bash
npx --no -- commitlint --edit "$1"
```

Make it executable:

```bash
chmod +x .husky/commit-msg
```

---

## Step 6: Create GitHub Actions workflow

Create `.github/workflows/publish.yml`:

```yaml
name: Publish to npm

on:
  push:
    tags:
      - "v*"

permissions:
  contents: write
  id-token: write

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: "22"
          registry-url: "https://registry.npmjs.org"

      - run: npm publish --provenance --access public

      - name: Create GitHub Release
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          TAG_NAME: ${{ github.ref_name }}
          REPO: ${{ github.repository }}
        run: |
          gh release create "$TAG_NAME" \
            --title "$TAG_NAME" \
            --generate-notes \
            --repo "$REPO"
```

---

## Step 7: Create GitHub repo and push

```bash
# Create repo
gh repo create expo-ai-elements --public --source=. --push

# Tag initial release
git tag v0.1.0 -m "chore(release): v0.1.0"
git push --tags
```

---

## Step 8: Initial npm publish (one-time)

The first publish must be done manually since the package doesn't exist on npm yet:

```bash
npm publish --access public
```

This will prompt for 2FA. After this succeeds, the package exists on npm.

---

## Step 9: Configure OIDC trusted publisher on npm

1. Go to `https://www.npmjs.com/package/expo-ai-elements/access`
2. Under **Trusted Publisher**, click **GitHub Actions**
3. Fill in:
   - **Organization or user**: `muratcakmak`
   - **Repository**: `expo-ai-elements`
   - **Workflow filename**: `publish.yml`
4. Click **Set up connection** and authenticate with 2FA

After this, all future publishes happen automatically via GitHub Actions — no tokens needed.

---

## How to release going forward

```bash
# 1. Write code with conventional commits
git commit -m "feat: add new chat bubble component"

# 2. Run release (bumps version, updates changelog, creates tag)
pnpm release:minor

# 3. Push — GitHub Actions publishes to npm automatically
git push --follow-tags
```

## Version bump guide

| Change type | Command | Example |
|-------------|---------|---------|
| Bug fix | `pnpm release:patch` | 0.1.0 → 0.1.1 |
| New feature | `pnpm release:minor` | 0.1.0 → 0.2.0 |
| Breaking change | `pnpm release:major` | 0.1.0 → 1.0.0 |
