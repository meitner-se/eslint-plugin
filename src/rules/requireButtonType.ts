import { ESLintUtils } from "@typescript-eslint/utils";

export const requireButtonType = ESLintUtils.RuleCreator.withoutDocs({
    create(context) {
        return {
            JSXOpeningElement(node) {
                // Only target native <button> elements, not React components like <Button />
                if (
                    node.name.type !== "JSXIdentifier" ||
                    node.name.name !== "button"
                ) {
                    return;
                }

                const hasTypeAttribute = node.attributes.some(
                    (attribute) =>
                        attribute.type === "JSXAttribute" &&
                        attribute.name.type === "JSXIdentifier" &&
                        attribute.name.name === "type"
                );

                if (hasTypeAttribute) {
                    return;
                }

                context.report({
                    node,
                    messageId: "requireButtonType",
                });
            },
        };
    },
    meta: {
        messages: {
            requireButtonType:
                'type="submit" is the default for <button> elements, please explicitly specify the type.',
        },
        type: "problem",
        schema: [],
    },
    defaultOptions: [],
});
