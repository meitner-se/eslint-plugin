# @meitner/eslint-plugin

Custom ESLint rules used internally at Meitner

## Rules

-   [no-inline-function-parameter-type-annotation](#no-inline-function-parameter-type-annotation)
-   [no-mixed-exports](#no-mixed-exports)
-   [no-use-prefix-for-non-hook](#no-use-prefix-for-non-hook)
-   [no-react-namespace](#no-react-namespace)

### no-inline-function-parameter-type-annotation

Writing type annotations inline for function parameters makes the code harder to read, and introduces inconsistency. This rule forces the developer to write a type or interface.

Examples of valid code

```ts
const myFunction = (parameterA: MyType) => {};
function myFunction(parameterA: MyType) {}
const myFunction = (parameterA: string) => {};
function myFunction(parameterA: string) {}
```

Examples of invalid code

```ts
const myFunction = (parameterA: { foo: string }) => {};
function myFunction(parameterA: { foo: string }) {}
```

### no-mixed-exports

Mixed exports refers to a file having both a default and one or more named exports.

Mixing exports can make the code hard to navigate and unpredictable. This rule forbids mixing exports.

Examples of valid code

```ts
// types.ts
export type Options = {
    value: number
};

// index.ts
import { Options } from "./types.ts";

export default myFunction(parameters: Options) {...}
```

Examples of invalid code

```ts
// index.ts
export type Options = {
    value: number
};

export default myFunction(parameters: Options) {...}
```

### no-use-prefix-for-non-hook

Custom hooks are identified using a `use` prefix, naming normal functions, variables or others with a `use` prefix can cause confusion.

This rule forbids functions and variables being prefixed with `use` if they do not contain other hooks.

Examples of valid code

```ts
const useCustom = () => {
    const [state, setState] = useState("");

    return { state, setState };
};

const useCustom = () => useState("");

const useCustom = useState;
```

Examples of invalid code

```ts
const useCustom = () => {
    return "Hello world";
};

const useCustom = () => new Date();

const useCustom = new Date();
```

### no-react-namespace

React functions and types can be either imported individually, or used as a member of the default exported React namespace, mixing these two strategies introduces inconsistency.

It has no real effect on performance or function, but importing functions and types individually makes the code more consistent with modern Javascript packages which tend to not use default export due to tree shaking.

This rule forbids using the React namespace.

Examples of valid code

```ts
const [state, setState] = useState("");

type Props = {
    children: ReactNode;
    style: CSSProperties;
};

export default memo(MyComponent);
```

Examples of invalid code

```ts
const [state, setState] = React.useState("");

type Props = {
    children: React.ReactNode;
    style: React.CSSProperties;
};

export default React.memo(MyComponent);
```
