import { RuleTester } from "@typescript-eslint/rule-tester";
import * as vitest from "vitest";
import { noHookResultMemberAccess } from "../rules/noHookResultMemberAccess";

RuleTester.afterAll = vitest.afterAll;
RuleTester.it = vitest.it;
RuleTester.itOnly = vitest.it.only;
RuleTester.describe = vitest.describe;

const ruleTester = new RuleTester({
    parser: "@typescript-eslint/parser",
});

ruleTester.run("noHookResultMemberAccess", noHookResultMemberAccess, {
    valid: [
        // Destructured — the preferred form
        "const { property } = useHook();",
        // Assigned to a variable first, then accessed
        "const result = useHook(); const property = result.property;",
        // Assigned without any member access
        "const value = useHook(config);",
        // Bare call, no member access
        "useHook();",
        // Not a hook name
        "notAHook().property;",
        "getValue().property;",
        // A namespaced call is not a bare hook identifier
        "obj.useHook().property;",
    ],
    invalid: [
        {
            code: "const property = useHook().property;",
            errors: [
                {
                    messageId: "noHookResultMemberAccess",
                    data: { hook: "useHook" },
                },
            ],
        },
        {
            code: "useHook().property;",
            errors: [{ messageId: "noHookResultMemberAccess" }],
        },
        // Member access on a hook result, even nested inside another expression
        {
            code: "const instance = new SomeClass(useHook().property);",
            errors: [
                {
                    messageId: "noHookResultMemberAccess",
                    data: { hook: "useHook" },
                },
            ],
        },
        {
            code: "const value = useOther().value;",
            errors: [
                {
                    messageId: "noHookResultMemberAccess",
                    data: { hook: "useOther" },
                },
            ],
        },
        // Optional chaining still accesses a member on the call
        {
            code: "const x = useHook()?.property;",
            errors: [{ messageId: "noHookResultMemberAccess" }],
        },
        // Computed access
        {
            code: 'const x = useHook()["property"];',
            errors: [{ messageId: "noHookResultMemberAccess" }],
        },
        // Calling a method on the hook result is member access, so this rule
        // owns it (not no-hook-result-as-argument)
        {
            code: "useHook().doSomething();",
            errors: [{ messageId: "noHookResultMemberAccess" }],
        },
    ],
});
