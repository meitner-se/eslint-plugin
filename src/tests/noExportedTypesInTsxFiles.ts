import { RuleTester } from "@typescript-eslint/rule-tester";
import * as vitest from "vitest";
import { noExportedTypesInTsxFiles } from "../rules/noExportedTypesInTsxFiles";

RuleTester.afterAll = vitest.afterAll;
RuleTester.it = vitest.it;
RuleTester.itOnly = vitest.it.only;
RuleTester.describe = vitest.describe;

const ruleTester = new RuleTester({
    parser: "@typescript-eslint/parser",
});

ruleTester.run("noExportedTypesInTsxFiles", noExportedTypesInTsxFiles, {
    valid: [
        {
            code: `
          export interface MyInterface {
            prop: string;
          }
        `,
            filename: "types.ts",
            parserOptions: { ecmaVersion: 2020, sourceType: "module" },
        },
        {
            code: `
          interface MyInterface {
            prop: string;
          }
        `,
            filename: "component.tsx",
            parserOptions: { ecmaVersion: 2020, sourceType: "module" },
        },
        {
            code: `
          export type MyType = string;
        `,
            filename: "someFile.ts",
            parserOptions: { ecmaVersion: 2020, sourceType: "module" },
        },
    ],
    invalid: [
        {
            code: `
          export interface MyInterface {
            prop: string;
          }
        `,
            filename: "component.tsx",
            parserOptions: { ecmaVersion: 2020, sourceType: "module" },
            errors: [
                {
                    messageId: "noExportedTypesInTsxFiles",
                },
            ],
        },
        {
            code: `
          export type MyType = string;
        `,
            filename: "component.tsx",
            parserOptions: { ecmaVersion: 2020, sourceType: "module" },
            errors: [
                {
                    messageId: "noExportedTypesInTsxFiles",
                },
            ],
        },
    ],
});
