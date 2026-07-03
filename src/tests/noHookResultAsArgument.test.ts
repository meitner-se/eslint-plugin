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
        "const search = useLocationSearch(); new URLSearchParams(search);",
        // Assigned, not passed inline
        "const params = useSearchParams();",
        // Bare statement, result discarded
        "useEffect(() => {}, []);",
        // The hook's own arguments are not hook calls
        "const value = useMemo(() => compute(), []);",
        // Passing the hook reference (not calling it) is fine
        "wrapHook(useLocation);",
        // Argument is not a hook call
        "new URLSearchParams(getSearch());",
        "doSomething(computeValue());",
        // Immediately invoking the hook result is a call position, not an
        // argument position — intentionally out of scope for this rule
        "useEventHandler()();",
    ],
    invalid: [
        {
            code: "const search = new URLSearchParams(useLocationSearch());",
            errors: [
                {
                    messageId: "noHookResultAsArgument",
                    data: { hook: "useLocationSearch" },
                },
            ],
        },
        {
            code: "foo(useX());",
            errors: [
                {
                    messageId: "noHookResultAsArgument",
                    data: { hook: "useX" },
                },
            ],
        },
        // The hook call itself is the argument, even when it takes its own args
        {
            code: "doSomething(useSelector(selector));",
            errors: [
                {
                    messageId: "noHookResultAsArgument",
                    data: { hook: "useSelector" },
                },
            ],
        },
        // A hook argument alongside other arguments
        {
            code: "new Foo(useBar(), other);",
            errors: [
                {
                    messageId: "noHookResultAsArgument",
                    data: { hook: "useBar" },
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
