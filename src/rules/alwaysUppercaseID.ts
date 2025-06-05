import { ESLintUtils } from "@typescript-eslint/utils";

export const alwaysUppercaseID = ESLintUtils.RuleCreator.withoutDocs({
    create(context) {
        return {
            Identifier(node) {
                const name = node.name;

                // Match "Ids" that are not part of "IDs" so we can catch multiple matches in a single string, eg. userIDsMappedByGroupIds
                const idsPattern = /Ids(?!D)/g;

                // Match "Id" that are not part of "ID" so we can catch multiple matches in a single string, eg. userIdMappedByGroupId
                const idPattern = /Id(?!s?D)/g;

                const idsMatches = name.match(idsPattern);
                const idMatches = name.match(idPattern);

                if (idsMatches) {
                    context.report({
                        node,
                        messageId: "useUppercaseID",
                        data: { found: "Ids" },
                    });
                } else if (idMatches) {
                    context.report({
                        node,
                        messageId: "useUppercaseID",
                        data: { found: "Id" },
                    });
                }
            },
        };
    },
    meta: {
        type: "problem",
        docs: {
            description: "enforce 'ID' or 'IDs' instead of 'Id', or 'Ids'",
        },
        schema: [],
        messages: {
            useUppercaseID: "Use 'ID' or 'IDs' instead of '{{ found }}'.",
        },
    },
    defaultOptions: [],
});
