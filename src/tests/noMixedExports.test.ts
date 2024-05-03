import { RuleTester } from "@typescript-eslint/rule-tester";
import * as vitest from "vitest";
import { noMixedExports } from "../rules/noMixedExports";

RuleTester.afterAll = vitest.afterAll;
RuleTester.it = vitest.it;
RuleTester.itOnly = vitest.it.only;
RuleTester.describe = vitest.describe;

const ruleTester = new RuleTester({
    parser: "@typescript-eslint/parser",
});

ruleTester.run("noMixedExports", noMixedExports, {
    valid: ["export const myExport = () => {}", "export default () => {}"],
    invalid: [
        {
            code: "export const myExport = () => {}; export default () => {}",
            errors: [
                {
                    messageId: "noMixedExports",
                },
            ],
        },
    ],
});
