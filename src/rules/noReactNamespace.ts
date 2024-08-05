import { ESLintUtils } from "@typescript-eslint/utils";

export const noReactNamespace = ESLintUtils.RuleCreator.withoutDocs({
    create(context) {
        return {
            MemberExpression(node) {
                if (
                    node.object.type === "Identifier" &&
                    node.object.name === "React"
                ) {
                    context.report({
                        node,
                        messageId: "noReactNamespace",
                    });
                }
            },
            TSTypeAnnotation(node) {
                if (
                    node.typeAnnotation.type === "TSTypeReference" &&
                    node.typeAnnotation.typeName.type === "TSQualifiedName" &&
                    node.typeAnnotation.typeName.left.type === "Identifier" &&
                    node.typeAnnotation.typeName.left.name === "React"
                ) {
                    context.report({
                        node,
                        messageId: "noReactNamespace",
                    });
                }
            },
        };
    },
    meta: {
        messages: {
            noReactNamespace:
                "Do not use the React namespace, import the specific functions or types you need instead.",
        },
        type: "problem",
        schema: [],
    },
    defaultOptions: [],
});
