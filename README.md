# eslint-plugin-meitner

Custom ESLint rules used internally at Meitner

## Rules

### no-inline-function-parameter-type-annotation

Writing type annotations inline for function parameters makes the code harder to read, and introduces inconsistency. This rule forces the developer to write a type or interface.

Examples of valid code

```js
const myFunction = (parameterA: MyType) => {};
function myFunction(parameterA: MyType) {}
const myFunction = (parameterA: string) => {};
function myFunction(parameterA: string) {}
```

Examples of invalid code

```js
const myFunction = (parameterA: { foo: string }) => {};
function myFunction(parameterA: { foo: string }) {}
```
