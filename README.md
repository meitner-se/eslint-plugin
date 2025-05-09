# @meitner/eslint-plugin

Custom ESLint rules used internally at Meitner

## Rules

-   [prefer-ternary-for-jsx-expressions](#prefer-ternary-for-jsx-expressions)
-   [no-inline-function-parameter-type-annotation](#no-inline-function-parameter-type-annotation)
-   [no-mixed-exports](#no-mixed-exports)
-   [no-use-prefix-for-non-hook](#no-use-prefix-for-non-hook)
-   [no-react-namespace](#no-react-namespace)
-   [no-literal-jsx-style-prop-values](#no-literal-jsx-style-prop-values)
-   [no-exported-types-outside-types-file](#no-exported-types-outside-types-file)

### prefer-ternary-for-jsx-expressions

Using the logical AND operator (`&&`) for conditional rendering in JSX can lead to unintended rendering of falsy values like `0`. This rule encourages using ternary expressions instead, which explicitly handle the falsy case.

Examples of valid code

```tsx
{
    condition ? <Component /> : null;
}

{
    isLoading ? <Spinner /> : null;
}

{
    items.length ? renderItems() : null;
}
```

Examples of invalid code

```tsx
{
    condition && <Component />;
}

{
    isLoading && <Spinner />;
}

{
    items.length && renderItems();
}
```

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

### no-literal-jsx-style-prop-values

Styles should be written in real CSS and applied to elements with `className`, this means less JS code, faster build time, faster load time, better UX and better DX

Often styles will need to be changed based on various conditions, most of the time we can just apply different classNames, but sometimes we need to set styles to dynamic JS values

This rule forbids using literal values in the JSX style prop.

Examples of valid code

```ts
<div style={{ color: myMagicColor }} />

<div style={{ gap: myMagicGap * size }}>

<div style={{ border: `1px solid ${getMagicColor()}` }} />
```

Examples of invalid code

```ts
<div style={{ color: "red" }} />

<div style={{ color: isMagic ? "red" : "blue" }}>

<div style={{ border: `1px solid ${isMagic ? "red" : "blue"}` }} />
```

### always-spread-jsx-props-first

Spreading props is a common pattern in React, but it can also lead to unintended behavior if not used carefully.

By putting the spread props first, we can avoid unintended behavior, such as overriding props with the same name.

This rule forces JSX spread props to always be the first prop in the list, and to only allow the `key` prop before the spread props.

Examples of valid code

```ts
<Component key={myKey} {...props} myProp={myValue} />

<Component {...props} myProp={myValue} />

<Component {...props} />

<Component />
```

Examples of invalid code

```ts
<Component myProp={myValue} {...props} />
```

### no-exported-types-in-tsx-files

Exporting your types from your component's tsx file can lead to dependency loops and make your code harder to maintain.

This rule forbids exporting types from tsx files.

Examples of valid code

```ts
// MyComponent.tsx
import { Props } from "./MyComponent.types";

export default function MyComponent(props: Props) {
    return <div>{props.children}</div>;
}
```

Examples of invalid code

```ts
// MyComponent.tsx
import { Props } from "./MyComponent.types";

export default function MyComponent(props: Props) { // error
    return <div>{props.children}</div>;
}

export type Props = {
    children: ReactNode;
};
```
