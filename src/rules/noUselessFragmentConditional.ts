import { ESLintUtils } from "@typescript-eslint/utils";

export const noUselessFragmentConditional = ESLintUtils.RuleCreator.withoutDocs({
    create(context) {
        return {
            ReturnStatement(node) {
                if (node.argument === null) {
                    return;
                }

                if (node.argument.type !== "JSXFragment") {
                    return;
                }

                const filteredChildren = node.argument.children.filter(child => {
                    // Ignore empty text nodes, for example line breaks.
                    if (child.type === "JSXText" && child.raw.trim() === "") {
                        return false;
                    }

                    return true;
                });

                if (filteredChildren.length !== 1) {
                    return;
                }

                const child = filteredChildren[0];

                if (child === undefined) {
                    return;
                }

                if (child.type !== "JSXExpressionContainer" || child.expression.type !== "ConditionalExpression") {
                    return;
                }

                context.report({
                    node,
                    messageId: "noUselessFragmentConditional",
                });
            },
        };
    },
    meta: {
        messages: {
            noUselessFragmentConditional:
                "Do not use a fragment with only a conditional rendering, prefer multiple returns instead.",
        },
        type: "problem",
        schema: [],
    },
    defaultOptions: [],
});
