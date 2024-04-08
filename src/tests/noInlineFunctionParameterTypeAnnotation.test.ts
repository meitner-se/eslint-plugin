import { RuleTester } from "@typescript-eslint/rule-tester";
import * as vitest from "vitest";
import { noInlineFunctionParameterTypeAnnotation } from "../rules/noInlineFunctionParameterTypeAnnotation";

RuleTester.afterAll = vitest.afterAll;
RuleTester.it = vitest.it;
RuleTester.itOnly = vitest.it.only;
RuleTester.describe = vitest.describe;

const ruleTester = new RuleTester({
    parser: "@typescript-eslint/parser",
});

ruleTester.run(
    "noInlineFunctionParameterTypeAnnotation",
    noInlineFunctionParameterTypeAnnotation,
    {
        valid: [
            "const myFunction = (parameterA: MyType) => {}",
            "function myFunction(parameterA: MyType) {}",
        ],
        invalid: [
            {
                code: "const myFunction = (parameterB: { key: string }) => {}",
                errors: [
                    {
                        messageId: "noInlineFunctionParameterTypeAnnotation",
                    },
                ],
            },
            {
                code: "function myFunction(parameterB: { key: string }) {}",
                errors: [
                    {
                        messageId: "noInlineFunctionParameterTypeAnnotation",
                    },
                ],
            },
        ],
    }
);
