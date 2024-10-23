import { ESLintUtils, TSESTree } from "@typescript-eslint/utils";

export const noExportedTypesInTsxFiles = ESLintUtils.RuleCreator.withoutDocs({
    create(context) {
        const filename = context.filename;
        const isTsxFile = filename.endsWith(".tsx");

        return {
            TSInterfaceDeclaration(node: TSESTree.TSInterfaceDeclaration) {
                checkExportedType(node);
            },
            TSTypeAliasDeclaration(node: TSESTree.TSTypeAliasDeclaration) {
                checkExportedType(node);
            },
            TSEnumDeclaration(node: TSESTree.TSEnumDeclaration) {
                checkExportedType(node);
            },
        };

        function checkExportedType(node: TSESTree.Node) {
            const isExported = node.parent?.type === "ExportNamedDeclaration";

            if (isExported && isTsxFile) {
                context.report({
                    node,
                    messageId: "noExportedTypesInTsxFiles",
                });
            }
        }
    },
    meta: {
        type: "problem",
        messages: {
            noExportedTypesInTsxFiles:
                "Exported types are not allowed in '.tsx' files.",
        },
        schema: [],
    },
    defaultOptions: [],
});
