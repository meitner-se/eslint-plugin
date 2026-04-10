import { ESLintUtils } from "@typescript-eslint/utils";

const CSS_MODULE_EXTENSIONS = [".module.css", ".module.scss", ".module.less"];

function isCSSModuleImport(source: string): boolean {
    return CSS_MODULE_EXTENSIONS.some((ext) => source.endsWith(ext));
}

type Options = [{ name: string }];

export const cssModuleImportName = ESLintUtils.RuleCreator.withoutDocs<
    Options,
    "cssModuleImportName"
>({
    create(context, [options]) {
        const expectedName = options.name;

        return {
            ImportDeclaration(node) {
                const source = node.source.value;

                if (typeof source !== "string" || !isCSSModuleImport(source)) {
                    return;
                }

                if (node.specifiers.length !== 1) {
                    return;
                }

                const specifier = node.specifiers[0];

                if (specifier.type !== "ImportDefaultSpecifier") {
                    return;
                }

                if (specifier.local.name !== expectedName) {
                    context.report({
                        node: specifier,
                        messageId: "cssModuleImportName",
                        data: {
                            expected: expectedName,
                            actual: specifier.local.name,
                        },
                        fix(fixer) {
                            return fixer.replaceText(
                                specifier.local,
                                expectedName,
                            );
                        },
                    });
                }
            },
        };
    },
    meta: {
        messages: {
            cssModuleImportName:
                'CSS module imports should be named "{{ expected }}", found "{{ actual }}".',
        },
        type: "suggestion",
        fixable: "code",
        schema: [
            {
                type: "object",
                properties: {
                    name: {
                        type: "string",
                    },
                },
                additionalProperties: false,
            },
        ],
    },
    defaultOptions: [{ name: "classes" }],
});
