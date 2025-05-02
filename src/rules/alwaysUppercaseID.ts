import { ESLintUtils } from "@typescript-eslint/utils";

export const alwaysUppercaseID = ESLintUtils.RuleCreator.withoutDocs({
    create(context) {
        return {
            Identifier(node) {
                const name = node.name;

                if (
                    (name.endsWith("Id") || name.endsWith("Ids")) &&
                    !(name.endsWith("ID") || name.endsWith("IDs"))
                ) {
                    let found = "";

                    if (name.endsWith("id")) {
                        found = "id";
                    } else if (name.endsWith("ids")) {
                        found = "ids";
                    } else if (name.endsWith("Id")) {
                        found = "Id";
                    } else if (name.endsWith("Ids")) {
                        found = "Ids";
                    }

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
