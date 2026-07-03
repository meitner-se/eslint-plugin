import { RuleTester } from "@typescript-eslint/rule-tester";
import * as vitest from "vitest";
import { requireButtonType } from "../rules/requireButtonType";

RuleTester.afterAll = vitest.afterAll;
RuleTester.it = vitest.it;
RuleTester.itOnly = vitest.it.only;
RuleTester.describe = vitest.describe;

const ruleTester = new RuleTester({
    parser: "@typescript-eslint/parser",
});

ruleTester.run("requireButtonType", requireButtonType, {
    valid: [
        {
            code: '<button type="button">Click</button>',
            parserOptions: { ecmaFeatures: { jsx: true } },
        },
        {
            code: '<button type="submit">Submit</button>',
            parserOptions: { ecmaFeatures: { jsx: true } },
        },
        {
            code: '<button type="reset" />',
            parserOptions: { ecmaFeatures: { jsx: true } },
        },
        {
            code: "<button type={buttonType}>Click</button>",
            parserOptions: { ecmaFeatures: { jsx: true } },
        },
        {
            code: '<button onClick={handleClick} type="button">Click</button>',
            parserOptions: { ecmaFeatures: { jsx: true } },
        },
        // Not a native <button>, so it is ignored
        {
            code: "<Button>Click</Button>",
            parserOptions: { ecmaFeatures: { jsx: true } },
        },
        {
            code: "<div>Not a button</div>",
            parserOptions: { ecmaFeatures: { jsx: true } },
        },
    ],
    invalid: [
        {
            code: "<button>Click</button>",
            parserOptions: { ecmaFeatures: { jsx: true } },
            errors: [
                {
                    messageId: "requireButtonType",
                },
            ],
        },
        {
            code: "<button />",
            parserOptions: { ecmaFeatures: { jsx: true } },
            errors: [
                {
                    messageId: "requireButtonType",
                },
            ],
        },
        {
            code: "<button onClick={handleClick}>Click</button>",
            parserOptions: { ecmaFeatures: { jsx: true } },
            errors: [
                {
                    messageId: "requireButtonType",
                },
            ],
        },
        // A spread attribute does not count as an explicit type
        {
            code: "<button {...props}>Click</button>",
            parserOptions: { ecmaFeatures: { jsx: true } },
            errors: [
                {
                    messageId: "requireButtonType",
                },
            ],
        },
    ],
});
