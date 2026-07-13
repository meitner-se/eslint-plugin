import path from "node:path";

import { RuleTester } from "@typescript-eslint/rule-tester";
import * as vitest from "vitest";

import { noSelfPackageImport } from "../rules/noSelfPackageImport";

RuleTester.afterAll = vitest.afterAll;
RuleTester.it = vitest.it;
RuleTester.itOnly = vitest.it.only;
RuleTester.describe = vitest.describe;

const ruleTester = new RuleTester({
    parser: "@typescript-eslint/parser",
});

// A file inside this repo resolves (via package.json walk-up) to the plugin's
// own name, "@meitner/eslint-plugin".
const fileInThisPackage = path.join(process.cwd(), "src", "example.ts");
const parserOptions = { ecmaVersion: 2020, sourceType: "module" } as const;

ruleTester.run("noSelfPackageImport", noSelfPackageImport, {
    valid: [
        {
            code: `import { x } from "./sibling";`,
            filename: fileInThisPackage,
            parserOptions,
        },
        {
            code: `import { x } from "@meitner/other-package/foo";`,
            filename: fileInThisPackage,
            parserOptions,
        },
        {
            code: `import react from "react";`,
            filename: fileInThisPackage,
            parserOptions,
        },
        {
            // Prefix of the package name but a different package — must not match.
            code: `import { x } from "@meitner/eslint-plugin-extra/foo";`,
            filename: fileInThisPackage,
            parserOptions,
        },
    ],
    invalid: [
        {
            code: `import { x } from "@meitner/eslint-plugin";`,
            filename: fileInThisPackage,
            parserOptions,
            errors: [{ messageId: "selfImport" }],
        },
        {
            code: `import { x } from "@meitner/eslint-plugin/rules/foo";`,
            filename: fileInThisPackage,
            parserOptions,
            errors: [{ messageId: "selfImport" }],
        },
        {
            code: `export { x } from "@meitner/eslint-plugin/rules/foo";`,
            filename: fileInThisPackage,
            parserOptions,
            errors: [{ messageId: "selfImport" }],
        },
        {
            code: `export * from "@meitner/eslint-plugin/rules/foo";`,
            filename: fileInThisPackage,
            parserOptions,
            errors: [{ messageId: "selfImport" }],
        },
    ],
});
