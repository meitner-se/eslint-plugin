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
        "const { pathname } = useLocation();",
        // Assigned to a variable first, then accessed
        "const location = useLocation(); const p = location.pathname;",
        // Assigned without any member access
        "const value = useMemo(() => compute(), []);",
        "const ref = useRef(0);",
        // Effect hook called for its side effect, no member access
        "useEffect(() => {}, []);",
        // Not a hook name
        "notAHook().pathname;",
        "getState().value;",
        // A namespaced call is not a bare hook identifier
        "foo.useBar().baz;",
    ],
    invalid: [
        {
            code: "const pathname = useLocation().pathname;",
            errors: [
                {
                    messageId: "noHookResultMemberAccess",
                    data: { hook: "useLocation" },
                },
            ],
        },
        {
            code: "useLocation().pathname;",
            errors: [{ messageId: "noHookResultMemberAccess" }],
        },
        // Member access on a hook result, even nested inside another expression
        {
            code: "const p = new URLSearchParams(useLocation().search);",
            errors: [
                {
                    messageId: "noHookResultMemberAccess",
                    data: { hook: "useLocation" },
                },
            ],
        },
        {
            code: "const t = useTranslation().t;",
            errors: [{ messageId: "noHookResultMemberAccess" }],
        },
        // Optional chaining still accesses a member on the call
        {
            code: "const x = useLocation()?.pathname;",
            errors: [{ messageId: "noHookResultMemberAccess" }],
        },
        // Computed access
        {
            code: 'const x = useLocation()["pathname"];',
            errors: [{ messageId: "noHookResultMemberAccess" }],
        },
        // Calling a method on the hook result is member access, so this rule
        // owns it (not no-hook-result-as-argument)
        {
            code: "useStore().subscribe();",
            errors: [{ messageId: "noHookResultMemberAccess" }],
        },
    ],
});
