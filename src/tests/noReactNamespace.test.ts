import { RuleTester } from "@typescript-eslint/rule-tester";
import * as vitest from "vitest";
import { noReactNamespace } from "../rules/noReactNamespace";

RuleTester.afterAll = vitest.afterAll;
RuleTester.it = vitest.it;
RuleTester.itOnly = vitest.it.only;
RuleTester.describe = vitest.describe;

const ruleTester = new RuleTester({
    parser: "@typescript-eslint/parser",
});

ruleTester.run("noReactNamespace", noReactNamespace, {
    valid: [
        'const [state, setState] = useState("");',
        "const style: CSSProperties = {};",
    ],
    invalid: [
        {
            code: "const [state, setState] = React.useState('');",
            errors: [
                {
                    messageId: "noReactNamespace",
                },
            ],
        },
        {
            code: "const style: React.CSSProperties = {};",
            errors: [
                {
                    messageId: "noReactNamespace",
                },
            ],
        },
    ],
});
