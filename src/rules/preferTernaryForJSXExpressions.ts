import { ESLintUtils } from "@typescript-eslint/utils";

export const preferTernaryForJSXExpressions =
    ESLintUtils.RuleCreator.withoutDocs({
        create(context) {
            return {
                LogicalExpression(node) {
                    // Only target logical AND expressions with JSX on the right side of the operator
                    const isJSXElement =
                        node.operator === "&&" &&
                        (node.right.type === "JSXElement" ||
                            node.right.type === "JSXFragment" ||
                            (node.right.type === "CallExpression" &&
                                node.right.callee.type === "Identifier" &&
                                /^render[A-Z]/.test(node.right.callee.name)));

                    if (isJSXElement) {
                        context.report({
                            node,
                            messageId: "preferTernaryForJSXExpressions",
                            fix: (fixer) => {
                                // Replace "condition && component" with "condition ? component : null" with shortcut in your editor
                                return fixer.replaceText(
                                    node,
                                    `${context.sourceCode.getText(node.left)} ? ${context.sourceCode.getText(node.right)} : null`
                                );
                            },
                        });
                    }
                },
            };
        },
        meta: {
            messages: {
                preferTernaryForJSXExpressions:
                    "Prefer ternary operator over '&&' for conditional rendering",
            },
            type: "suggestion",
            schema: [],
            fixable: "code",
        },
        defaultOptions: [],
    });
