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
        // Default option: "classes"
        'import classes from "./styles.module.css";',
        'import classes from "./styles.module.scss";',
        'import classes from "./styles.module.less";',
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
        // Custom option
        {
            code: 'import styles from "./styles.module.css";',
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
            code: 'import s from "./component.module.scss";',
            errors: [
                {
                    messageId: "cssModuleImportName" as const,
                    data: { expected: "classes", actual: "s" },
                },
            ],
            output: 'import classes from "./component.module.scss";',
        },
        {
            code: 'import css from "./component.module.less";',
            errors: [
                {
                    messageId: "cssModuleImportName" as const,
                    data: { expected: "classes", actual: "css" },
                },
            ],
            output: 'import classes from "./component.module.less";',
        },
        // Deeper import path
        {
            code: 'import styles from "../../shared/styles.module.css";',
            errors: [
                {
                    messageId: "cssModuleImportName" as const,
                    data: { expected: "classes", actual: "styles" },
                },
            ],
            output: 'import classes from "../../shared/styles.module.css";',
        },
        // Custom option: should report when not matching custom name
        {
            code: 'import classes from "./styles.module.css";',
            options: [{ name: "styles" }],
            errors: [
                {
                    messageId: "cssModuleImportName" as const,
                    data: { expected: "styles", actual: "classes" },
                },
            ],
            output: 'import styles from "./styles.module.css";',
        },
    ],
});
