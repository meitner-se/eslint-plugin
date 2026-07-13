import { ESLintUtils } from "@typescript-eslint/utils";

const HOOK_NAME = /^use[A-Z]/;

export const noHookResultMemberAccess = ESLintUtils.RuleCreator.withoutDocs({
    create(context) {
        return {
            MemberExpression(node) {
                if (
                    node.object.type === "CallExpression" &&
                    node.object.callee.type === "Identifier" &&
                    HOOK_NAME.test(node.object.callee.name)
                ) {
                    context.report({
                        node: node.object,
                        messageId: "noHookResultMemberAccess",
                        data: {
                            hook: node.object.callee.name,
                        },
                    });
                }
            },
        };
    },
    meta: {
        messages: {
            noHookResultMemberAccess:
                "Assign the result of {{ hook }}() to a variable, or destructure it, instead of accessing its members on the call directly.",
        },
        type: "problem",
        schema: [],
    },
    defaultOptions: [],
});
