import { RuleTester } from "@typescript-eslint/rule-tester";
import * as vitest from "vitest";
import { noUselessFragmentConditional } from "../rules/noUselessFragmentConditional";

RuleTester.afterAll = vitest.afterAll;
RuleTester.it = vitest.it;
RuleTester.itOnly = vitest.it.only;
RuleTester.describe = vitest.describe;

const ruleTester = new RuleTester({
    parser: "@typescript-eslint/parser",
});

ruleTester.run("noUselessFragmentConditional", noUselessFragmentConditional, {
    valid: [
        {
            code: "return <>{isMagic ? <Component /> : null}<AnotherComponent /></>",
            parserOptions: { ecmaFeatures: { jsx: true } },
        },
        {
            code: "return <><AnotherComponent /></>",
            parserOptions: { ecmaFeatures: { jsx: true } },
        },
        {
            code: "return <>{isMagic ? <Component /> : null}hello</>",
            parserOptions: { ecmaFeatures: { jsx: true } },
        },
    ],
    invalid: [
        {
            code: "return <>{isMagic ? <Component /> : null}</>",
            parserOptions: { ecmaFeatures: { jsx: true } },
            errors: [
                {
                    messageId: "noUselessFragmentConditional",
                },
            ],
        },
        {
            code: `return <>
                    {isMagic ? (<Component />) : null}
            </>`,
            parserOptions: { ecmaFeatures: { jsx: true } },
            errors: [
                {
                    messageId: "noUselessFragmentConditional",
                },
            ],
        },
    ],
});
