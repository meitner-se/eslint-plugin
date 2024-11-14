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

                const beforeSpread = attributes.slice(0, spreadAttributeIndex);

                const hasOnlyKeyBeforeSpread = beforeSpread.every(
                    (attribute) =>
                        attribute.type === "JSXAttribute" &&
                        attribute.name.name === "key"
                );

                if (!hasOnlyKeyBeforeSpread) {
                    context.report({
                        node,
                        messageId: "alwaysSpreadJSXPropsFirst",
                    });
                }
            },
        };
    },
    meta: {
        messages: {
            alwaysSpreadJSXPropsFirst:
                "Only 'key' prop is allowed before JSX spread props.",
        },
        type: "problem",
        schema: [],
    },
    defaultOptions: [],
});
