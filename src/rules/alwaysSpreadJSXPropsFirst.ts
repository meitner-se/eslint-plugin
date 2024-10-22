import { ESLintUtils } from "@typescript-eslint/utils";

export const alwaysSpreadJSXPropsFirst = ESLintUtils.RuleCreator.withoutDocs({
    create(context) {
        return {
            JSXOpeningElement(node) {
                const attributes = node.attributes;

                if (attributes.length === 0) {
                    return;
                }

                const hasSpreadAttribute = attributes.some(
                    (attribute) => attribute.type === "JSXSpreadAttribute"
                );

                if (!hasSpreadAttribute) {
                    return;
                }

                const spreadAttributeIndex = attributes.findIndex(
                    (attribute) => attribute.type === "JSXSpreadAttribute"
                );

                if (spreadAttributeIndex === 0) {
                    return;
                }

                context.report({
                    node,
                    messageId: "alwaysSpreadJSXPropsFirst",
                });
            },
        };
    },
    meta: {
        messages: {
            alwaysSpreadJSXPropsFirst:
                "Always put JSX spread props first to avoid unintended behavior",
        },
        type: "problem",
        schema: [],
    },
    defaultOptions: [],
});
