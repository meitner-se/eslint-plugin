import { RuleTester } from "@typescript-eslint/rule-tester";
import * as vitest from "vitest";
import { alwaysSpreadJSXPropsFirst } from "../rules/alwaysSpreadJSXPropsFirst";

RuleTester.afterAll = vitest.afterAll;
RuleTester.it = vitest.it;
RuleTester.itOnly = vitest.it.only;
RuleTester.describe = vitest.describe;

const ruleTester = new RuleTester({
    parser: "@typescript-eslint/parser",
});

ruleTester.run("alwaysSpreadJSXPropsFirst", alwaysSpreadJSXPropsFirst, {
    valid: [
        {
            code: "<Component {...props} myProp={myValue} />",
            parserOptions: { ecmaFeatures: { jsx: true } },
        },
        {
            code: "<Component {...props} />",
            parserOptions: { ecmaFeatures: { jsx: true } },
        },
        {
            code: "<Component myProp={myValue} />",
            parserOptions: { ecmaFeatures: { jsx: true } },
        },
        {
            code: "<Component />",
            parserOptions: { ecmaFeatures: { jsx: true } },
        },
    ],
    invalid: [
        {
            code: "<Component myProp={myValue} {...props} />",
            parserOptions: { ecmaFeatures: { jsx: true } },
            errors: [
                {
                    messageId: "alwaysSpreadJSXPropsFirst",
                },
            ],
        },
    ],
});
