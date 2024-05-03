import { ESLintUtils } from "@typescript-eslint/utils";

export const noMixedExports = ESLintUtils.RuleCreator.withoutDocs({
    create(context) {
        let hasDefaultExport = false;
        let hasNamedExport = false;

        return {
            ExportDefaultDeclaration(node) {
                hasDefaultExport = true;

                if (hasNamedExport) {
                    context.report({
                        node,
                        messageId: "noMixedExports",
                    });
                }
            },
            ExportNamedDeclaration(node) {
                hasNamedExport = true;

                if (hasDefaultExport) {
                    context.report({
                        node,
                        messageId: "noMixedExports",
                    });
                }
            },
        };
    },
    meta: {
        messages: {
            noMixedExports:
                "Do not mix exports, a file should either include named exports or a default export.",
        },
        type: "problem",
        schema: [],
    },
    defaultOptions: [],
});
