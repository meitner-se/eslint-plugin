---
"@meitner/eslint-plugin": minor
---

Add `no-hook-result-member-access` and `no-hook-result-as-argument` rules, which require a hook's result to be assigned to a variable (or destructured) instead of being accessed or passed inline, e.g. `useHook().property` or `doSomething(useHook())`.
