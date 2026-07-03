import { RuleTester } from "@typescript-eslint/rule-tester";
import * as vitest from "vitest";
import { noHookResultAsArgument } from "../rules/noHookResultAsArgument";

RuleTester.afterAll = vitest.afterAll;
RuleTester.it = vitest.it;
RuleTester.itOnly = vitest.it.only;
RuleTester.describe = vitest.describe;

const ruleTester = new RuleTester({
    parser: "@typescript-eslint/parser",
});

ruleTester.run("noHookResultAsArgument", noHookResultAsArgument, {
    valid: [
        // Assigned to a variable first, then passed
        "const value = useHook(); doSomething(value);",
        // Assigned, not passed inline
        "const value = useHook();",
        // Bare call, result discarded
        "useHook();",
        // The hook's own arguments are not hook calls
        "const value = useHook(callback, deps);",
        // Passing the hook reference (not calling it) is fine
        "wrap(useHook);",
        // Argument is not a hook call
        "new SomeClass(getValue());",
        "doSomething(computeValue());",
        // Immediately invoking the hook result is a call position, not an
        // argument position — intentionally out of scope for this rule
        "useHook()();",
    ],
    invalid: [
        {
            code: "const instance = new SomeClass(useHook());",
            errors: [
                {
                    messageId: "noHookResultAsArgument",
                    data: { hook: "useHook" },
                },
            ],
        },
        {
            code: "doSomething(useHook());",
            errors: [
                {
                    messageId: "noHookResultAsArgument",
                    data: { hook: "useHook" },
                },
            ],
        },
        // The hook call itself is the argument, even when it takes its own args
        {
            code: "doSomething(useOther(config));",
            errors: [
                {
                    messageId: "noHookResultAsArgument",
                    data: { hook: "useOther" },
                },
            ],
        },
        // A hook argument alongside other arguments
        {
            code: "new SomeClass(useHook(), other);",
            errors: [
                {
                    messageId: "noHookResultAsArgument",
                    data: { hook: "useHook" },
                },
            ],
        },
        // Multiple hook arguments each report
        {
            code: "combine(useA(), useB());",
            errors: [
                {
                    messageId: "noHookResultAsArgument",
                    data: { hook: "useA" },
                },
                {
                    messageId: "noHookResultAsArgument",
                    data: { hook: "useB" },
                },
            ],
        },
    ],
});
