import { ESLintUtils } from "@typescript-eslint/utils";

export const requireReduceInitialValue = ESLintUtils.RuleCreator.withoutDocs({
    create(context) {
        return {
            CallExpression(node) {
                if (
                    node.arguments.length === 1 &&
                    node.callee.type === "MemberExpression" &&
                    node.callee.property.type === "Identifier" &&
                    node.callee.property.name === "reduce"
                ) {
                    context.report({
                        node: node.callee.property,
                        messageId: "requireReduceInitialValue",
                    });
                }
            },
        };
    },
    meta: {
        messages: {
            requireReduceInitialValue: "Provide initialValue to .reduce().",
        },
        type: "problem",
        schema: [],
    },
    defaultOptions: [],
});
