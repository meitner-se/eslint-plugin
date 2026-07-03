import { ESLintUtils } from "@typescript-eslint/utils";

const REDUCE_METHODS = new Set(["reduce", "reduceRight"]);

export const requireReduceInitialValue = ESLintUtils.RuleCreator.withoutDocs({
    create(context) {
        return {
            CallExpression(node) {
                if (
                    node.arguments.length === 1 &&
                    node.callee.type === "MemberExpression" &&
                    node.callee.property.type === "Identifier" &&
                    REDUCE_METHODS.has(node.callee.property.name)
                ) {
                    context.report({
                        node: node.callee.property,
                        messageId: "requireReduceInitialValue",
                        data: {
                            method: node.callee.property.name,
                        },
                    });
                }
            },
        };
    },
    meta: {
        messages: {
            requireReduceInitialValue: "Provide initialValue to .{{ method }}().",
        },
        type: "problem",
        schema: [],
    },
    defaultOptions: [],
});
