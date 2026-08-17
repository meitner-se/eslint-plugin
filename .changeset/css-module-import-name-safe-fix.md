---
"@meitner/eslint-plugin": patch
---

Fix `css-module-import-name`'s autofix, which renamed only the import binding and left every usage in the file dangling. The fix now renames the binding together with all of its references, and reports without a fix when the rename cannot be carried out safely: when the file imports more than one stylesheet (they cannot all take the same name), when the expected name is already declared or referenced anywhere in the file, or when a usage doubles as a shorthand property key or an export name.
