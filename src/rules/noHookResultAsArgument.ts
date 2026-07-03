import { ESLintUtils } from "@typescript-eslint/utils";

const HOOK_NAME = /^use[A-Z]/;

export const noHookResultAsArgument = ESLintUtils.RuleCreator.withoutDocs({
    create(context) {
        return {
            CallExpression(node) {
                if (
                    node.callee.type !== "Identifier" ||
                    !HOOK_NAME.test(node.callee.name)
                ) {
                    return;
                }

                const parent = node.parent;

                if (
                    (parent.type === "CallExpression" ||
                        parent.type === "NewExpression") &&
                    parent.arguments.includes(node)
                ) {
                    context.report({
                        node,
                        messageId: "noHookResultAsArgument",
                        data: {
                            hook: node.callee.name,
                        },
                    });
                }
            },
        };
    },
    meta: {
        messages: {
            noHookResultAsArgument:
                "Assign the result of {{ hook }}() to a variable instead of passing the call directly as an argument.",
        },
        type: "problem",
        schema: [],
    },
    defaultOptions: [],
});
