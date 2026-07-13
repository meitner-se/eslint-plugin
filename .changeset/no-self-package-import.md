---
"@meitner/eslint-plugin": minor
---

Add `no-self-package-import` rule: forbids a package from importing its own name (bare or subpath) — sibling modules should use relative paths. Reads each file's owning `package.json` name, so it needs no per-package configuration.
