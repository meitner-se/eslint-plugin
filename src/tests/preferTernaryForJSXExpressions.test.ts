import { RuleTester } from "@typescript-eslint/rule-tester";
import * as vitest from "vitest";
import { preferTernaryForJSXExpressions } from "../rules/preferTernaryForJSXExpressions";

RuleTester.afterAll = vitest.afterAll;
RuleTester.it = vitest.it;
RuleTester.itOnly = vitest.it.only;
RuleTester.describe = vitest.describe;

const ruleTester = new RuleTester({
    parser: "@typescript-eslint/parser",
});

ruleTester.run(
    "preferTernaryForJSXExpressions",
    preferTernaryForJSXExpressions,
    {
        valid: [
            {
                code: "myValue ? <Component /> : null",
                parserOptions: { ecmaFeatures: { jsx: true } },
            },
            {
                code: "myValue ? null : <Component />",
                parserOptions: { ecmaFeatures: { jsx: true } },
            },
            {
                code: "myValue ? <>My Component Yo</> : null",
                parserOptions: { ecmaFeatures: { jsx: true } },
            },
            {
                code: "myValue ? null : <>My Content Yo</>",
                parserOptions: { ecmaFeatures: { jsx: true } },
            },
            {
                code: "myValue ? renderMyComponent() : null",
                parserOptions: { ecmaFeatures: { jsx: true } },
            },
            {
                code: "myValue ? null : renderMyComponent()",
                parserOptions: { ecmaFeatures: { jsx: true } },
            },
            {
                code: "myValue && myMagicValue ? renderMyComponent() : null",
                parserOptions: { ecmaFeatures: { jsx: true } },
            },
            {
                code: "<Component />",
                parserOptions: { ecmaFeatures: { jsx: true } },
            },
            {
                code: "renderMyComponent()",
                parserOptions: { ecmaFeatures: { jsx: true } },
            },
        ],
        invalid: [
            {
                code: "myValue && <Component />",
                parserOptions: { ecmaFeatures: { jsx: true } },
                errors: [
                    {
                        messageId: "preferTernaryForJSXExpressions",
                    },
                ],
                output: "myValue ? <Component /> : null",
            },
            {
                code: "myValue && renderMyComponent()",
                parserOptions: { ecmaFeatures: { jsx: true } },
                errors: [
                    {
                        messageId: "preferTernaryForJSXExpressions",
                    },
                ],
                output: "myValue ? renderMyComponent() : null",
            },
        ],
    }
);
