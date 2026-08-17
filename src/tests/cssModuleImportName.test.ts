import { RuleTester } from "@typescript-eslint/rule-tester";
import * as vitest from "vitest";
import { cssModuleImportName } from "../rules/cssModuleImportName";

RuleTester.afterAll = vitest.afterAll;
RuleTester.it = vitest.it;
RuleTester.itOnly = vitest.it.only;
RuleTester.describe = vitest.describe;

const ruleTester = new RuleTester({
    parser: "@typescript-eslint/parser",
});

ruleTester.run("cssModuleImportName", cssModuleImportName, {
    valid: [
        // Default option: "classes" with different filenames and extensions
        'import classes from "./styles.module.css";',
        'import classes from "./Component.module.scss";',
        'import classes from "./header.module.less";',
        // Non-CSS-module imports should be ignored
        'import styles from "./styles.css";',
        'import foo from "./foo";',
        'import React from "react";',
        // Named imports should be ignored
        'import { something } from "./styles.module.css";',
        // Side-effect imports should be ignored
        'import "./styles.module.css";',
        // Namespace imports should be ignored
        'import * as styles from "./styles.module.css";',
        // Default + named together should be ignored
        'import classes, { something } from "./styles.module.css";',
        // Custom option with different filenames
        {
            code: 'import styles from "./Button.module.css";',
            options: [{ name: "styles" }],
        },
        {
            code: 'import styles from "./layout.module.scss";',
            options: [{ name: "styles" }],
        },
        {
            code: 'import styles from "./theme.module.less";',
            options: [{ name: "styles" }],
        },
    ],
    invalid: [
        {
            code: 'import styles from "./styles.module.css";',
            errors: [
                {
                    messageId: "cssModuleImportName" as const,
                    data: { expected: "classes", actual: "styles" },
                },
            ],
            output: 'import classes from "./styles.module.css";',
        },
        {
            code: 'import s from "./Button.module.scss";',
            errors: [
                {
                    messageId: "cssModuleImportName" as const,
                    data: { expected: "classes", actual: "s" },
                },
            ],
            output: 'import classes from "./Button.module.scss";',
        },
        {
            code: 'import css from "./header.module.less";',
            errors: [
                {
                    messageId: "cssModuleImportName" as const,
                    data: { expected: "classes", actual: "css" },
                },
            ],
            output: 'import classes from "./header.module.less";',
        },
        // Deeper import path
        {
            code: 'import styles from "../../shared/layout.module.css";',
            errors: [
                {
                    messageId: "cssModuleImportName" as const,
                    data: { expected: "classes", actual: "styles" },
                },
            ],
            output: 'import classes from "../../shared/layout.module.css";',
        },
        // Custom option: should report when not matching custom name
        {
            code: 'import classes from "./Card.module.css";',
            options: [{ name: "styles" }],
            errors: [
                {
                    messageId: "cssModuleImportName" as const,
                    data: { expected: "styles", actual: "classes" },
                },
            ],
            output: 'import styles from "./Card.module.css";',
        },
        // Usages are renamed together with the binding
        {
            code: [
                'import styles from "./Button.module.css";',
                "const a = styles.root;",
                "const b = styles['sub-part'];",
                "type Keys = keyof typeof styles;",
                "export function Button() {",
                "    return <div className={styles.root} styles={styles} />;",
                "}",
            ].join("\n"),
            parserOptions: { ecmaFeatures: { jsx: true } },
            errors: [{ messageId: "cssModuleImportName" as const }],
            output: [
                'import classes from "./Button.module.css";',
                "const a = classes.root;",
                "const b = classes['sub-part'];",
                "type Keys = keyof typeof classes;",
                "export function Button() {",
                "    return <div className={classes.root} styles={classes} />;",
                "}",
            ].join("\n"),
        },
        // Report-only: several stylesheets in one file cannot all be renamed
        {
            code: [
                'import baseClasses from "../BaseChipInput/style.module.css";',
                'import chipClasses from "../style.module.css";',
                "const a = baseClasses.root + chipClasses.root;",
            ].join("\n"),
            errors: [
                {
                    messageId: "cssModuleImportName" as const,
                    data: { expected: "classes", actual: "baseClasses" },
                },
                {
                    messageId: "cssModuleImportName" as const,
                    data: { expected: "classes", actual: "chipClasses" },
                },
            ],
            output: null,
        },
        // Report-only: one stylesheet already bound as `classes`
        {
            code: [
                'import classes from "./a.module.css";',
                'import base from "./b.module.css";',
                "const a = classes.root + base.root;",
            ].join("\n"),
            errors: [
                {
                    messageId: "cssModuleImportName" as const,
                    data: { expected: "classes", actual: "base" },
                },
            ],
            output: null,
        },
        // Report-only: `classes` already bound by something else in the file
        {
            code: [
                'import styles from "./a.module.css";',
                'import { classes } from "./helpers";',
                "const a = styles.root + classes;",
            ].join("\n"),
            errors: [{ messageId: "cssModuleImportName" as const }],
            output: null,
        },
        // Report-only: `classes` bound in an inner scope a usage sits in
        {
            code: [
                'import styles from "./a.module.css";',
                "function f() {",
                "    const classes = 1;",
                "    return styles.root + classes;",
                "}",
            ].join("\n"),
            errors: [{ messageId: "cssModuleImportName" as const }],
            output: null,
        },
        // Report-only: `classes` referenced as a global
        {
            code: [
                'import styles from "./a.module.css";',
                "const a = styles.root + classes;",
            ].join("\n"),
            errors: [{ messageId: "cssModuleImportName" as const }],
            output: null,
        },
        // Report-only: usage is a shorthand property, whose key would change
        {
            code: [
                'import styles from "./a.module.css";',
                "const a = { styles };",
            ].join("\n"),
            errors: [{ messageId: "cssModuleImportName" as const }],
            output: null,
        },
        // Report-only: usage is an export specifier, whose export name would change
        {
            code: [
                'import styles from "./a.module.css";',
                "export { styles };",
            ].join("\n"),
            errors: [{ messageId: "cssModuleImportName" as const }],
            output: null,
        },
    ],
});
