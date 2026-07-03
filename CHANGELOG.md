# @meitner/eslint-plugin

## 1.10.0

### Minor Changes

- [#25](https://github.com/meitner-se/eslint-plugin/pull/25) [`3b7e17b`](https://github.com/meitner-se/eslint-plugin/commit/3b7e17b0832563881f1c13ad944bd42a212746fc) Thanks [@MattisAbrahamsson](https://github.com/MattisAbrahamsson)! - Added `require-button-type` rule

- [#28](https://github.com/meitner-se/eslint-plugin/pull/28) [`26e687c`](https://github.com/meitner-se/eslint-plugin/commit/26e687cba61cd0c69cb1e2609b8bd90e4e77cdd1) Thanks [@MattisAbrahamsson](https://github.com/MattisAbrahamsson)! - Added `require-reduce-initial-value` rule, which requires an `initialValue` argument to be passed to `.reduce()` and `.reduceRight()`.

## 1.9.0

### Minor Changes

- [`312315d`](https://github.com/meitner-se/eslint-plugin/commit/312315dfff2f9101606903d5563ae59eff1fed3d) Thanks [@MattisAbrahamsson](https://github.com/MattisAbrahamsson)! - Added css-module-import-name rule

## 1.8.0

### Minor Changes

- Added `css-module-import-name` rule to enforce consistent naming of CSS module imports

### Patch Changes

- `no-use-prefix-for-non-hook`: Added support for expressions

## 1.7.0

### Minor Changes

- `no-use-prefix-for-non-hook`: Added support for React 19 `use()`

## 1.6.0

### Patch Changes

- Removed `always-capitalize-id` rule

## 1.5.6

### Patch Changes

- Version bump

## 1.5.4

### Minor Changes

- Added `always-capitalize-id` rule
- `prefer-ternary-for-jsx-expressions`: Only require ternary when rendering JSX elements

## 1.5.1

### Patch Changes

- `no-literal-jsx-style-prop-values`: Fixed spread in style prop causing false positive

## 1.5.0

### Minor Changes

- Added `no-exported-types-in-tsx-files` rule
- `always-spread-jsx-props-first`: Updated to allow `key` prop before spread

### Patch Changes

- Added Prettier as a dependency
- Updated rule-tester

## 1.3.0

### Minor Changes

- Added `no-literal-jsx-style-prop-values` rule
- Added `no-react-namespace` rule

### Patch Changes

- `no-use-prefix-for-non-hook`: Fixed allowing call expression assignment

## 1.2.0

### Minor Changes

- Added `no-use-prefix-for-non-hook` rule

## 1.0.0

### Major Changes

- Initial release
- Added `no-inline-function-parameter-type-annotation` rule
- Added `no-mixed-exports` rule
- Added `prefer-ternary-for-jsx-expressions` rule
