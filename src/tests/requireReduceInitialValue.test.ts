import { RuleTester } from "@typescript-eslint/rule-tester";
import * as vitest from "vitest";
import { requireReduceInitialValue } from "../rules/requireReduceInitialValue";

RuleTester.afterAll = vitest.afterAll;
RuleTester.it = vitest.it;
RuleTester.itOnly = vitest.it.only;
RuleTester.describe = vitest.describe;

const ruleTester = new RuleTester({
    parser: "@typescript-eslint/parser",
});

ruleTester.run("requireReduceInitialValue", requireReduceInitialValue, {
    valid: [
        "arr.reduce((acc, cur) => acc + cur, 0);",
        "arr.reduce(reducer, initialValue);",
        "arr.reduce(reducer, {});",
        // A different method entirely
        "arr.map(fn);",
        // A bare function call, not a member call
        "reduce(fn);",
        // reduceRight is not covered by the selector
        "arr.reduceRight(fn);",
        // Computed access is intentionally not matched (mirrors the original
        // selector, which only targets `Identifier.property`)
        'arr["reduce"](fn);',
    ],
    invalid: [
        {
            code: "arr.reduce((acc, cur) => acc + cur);",
            errors: [{ messageId: "requireReduceInitialValue" }],
        },
        {
            code: "arr.reduce(reducer);",
            errors: [{ messageId: "requireReduceInitialValue" }],
        },
        {
            code: "arr.filter(Boolean).reduce(reducer);",
            errors: [{ messageId: "requireReduceInitialValue" }],
        },
        {
            code: "arr?.reduce(reducer);",
            errors: [{ messageId: "requireReduceInitialValue" }],
        },
    ],
});
