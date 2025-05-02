import { ESLintUtils } from "@typescript-eslint/utils";

export const alwaysUppercaseID = ESLintUtils.RuleCreator.withoutDocs({
    create(context) {
        return {
            Identifier(node) {
                const name = node.name;
                let found = "";

                if (name.includes("Ids") && !name.includes("IDs")) {
                    found = "Ids";
                } else if (name.includes("Id") && !name.includes("ID")) {
                    found = "Id";
                }

                if (found) {
                    context.report({
                        node,
                        messageId: "useUppercaseID",
                        data: { found },
                    });
                }
            },
        };
    },
    meta: {
        type: "problem",
        docs: {
            description:
                "enforce 'ID' or 'IDs' instead of 'Id', or 'Ids' in suffixes",
        },
        schema: [],
        messages: {
            useUppercaseID: "Use 'ID' or 'IDs' instead of '{{ found }}'.",
        },
    },
    defaultOptions: [],
});
