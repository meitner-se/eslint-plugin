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
    ],
});
