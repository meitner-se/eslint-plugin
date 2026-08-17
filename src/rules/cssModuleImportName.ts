import { ESLintUtils, TSESLint, TSESTree } from "@typescript-eslint/utils";

const CSS_MODULE_EXTENSIONS = [".module.css", ".module.scss", ".module.less"];

function isCSSModuleImport(source: string): boolean {
    return CSS_MODULE_EXTENSIONS.some((ext) => source.endsWith(ext));
}

interface CSSModuleImport {
    declaration: TSESTree.ImportDeclaration;
    specifier: TSESTree.ImportDefaultSpecifier;
}

/**
 * Returns the declaration paired with its sole default specifier, or null when
 * the statement is not a single-default-specifier CSS module import.
 */
function getCSSModuleImport(
    statement: TSESTree.ProgramStatement
): CSSModuleImport | null {
    if (statement.type !== "ImportDeclaration") {
        return null;
    }

    const source = statement.source.value;

    if (typeof source !== "string" || !isCSSModuleImport(source)) {
        return null;
    }

    if (statement.specifiers.length !== 1) {
        return null;
    }

    const specifier = statement.specifiers[0];

    if (!specifier || specifier.type !== "ImportDefaultSpecifier") {
        return null;
    }

    return { declaration: statement, specifier };
}

/**
 * Whether `name` is declared or referenced anywhere below `scope`. Renaming a
 * binding to a name that is already taken would either redeclare it or make an
 * existing reference resolve to the wrong binding.
 */
function isNameTaken(scope: TSESLint.Scope.Scope, name: string): boolean {
    if (scope.variables.some((variable) => variable.name === name)) {
        return true;
    }

    // References that escape this scope unresolved — a global named `name`.
    if (scope.through.some((ref) => ref.identifier.name === name)) {
        return true;
    }

    return scope.childScopes.some((child) => isNameTaken(child, name));
}

/**
 * Renaming a reference that doubles as a property key or an export name would
 * change that key or the public export, not just the local binding.
 */
function isRenameableReference(ref: TSESLint.Scope.Reference): boolean {
    const parent = ref.identifier.parent;

    if (parent.type === "Property" && parent.shorthand) {
        return false;
    }

    return parent.type !== "ExportSpecifier";
}

/**
 * A fix renaming the binding together with every one of its usages, or null
 * when the rename cannot be carried out safely.
 */
function createRenameFix(
    sourceCode: TSESLint.SourceCode,
    { declaration, specifier }: CSSModuleImport,
    expectedName: string
): TSESLint.ReportFixFunction | null {
    const [variable] = sourceCode.getDeclaredVariables(declaration);

    if (!variable) {
        return null;
    }

    if (!variable.references.every(isRenameableReference)) {
        return null;
    }

    if (isNameTaken(sourceCode.getScope(declaration), expectedName)) {
        return null;
    }

    return (fixer) => [
        fixer.replaceText(specifier.local, expectedName),
        ...variable.references.map((ref) =>
            fixer.replaceText(ref.identifier, expectedName)
        ),
    ];
}

type Options = [{ name: string }];

export const cssModuleImportName = ESLintUtils.RuleCreator.withoutDocs<
    Options,
    "cssModuleImportName"
>({
    create(context, [options]) {
        const expectedName = options.name;

        return {
            Program(program) {
                const imports = program.body
                    .map(getCSSModuleImport)
                    .filter(
                        (entry): entry is CSSModuleImport => entry !== null
                    );

                // Every stylesheet in the file would be renamed to the same
                // name, so a file holding several of them cannot be fixed.
                const isSoleStylesheet = imports.length === 1;

                for (const cssModuleImport of imports) {
                    const { specifier } = cssModuleImport;

                    if (specifier.local.name === expectedName) {
                        continue;
                    }

                    context.report({
                        node: specifier,
                        messageId: "cssModuleImportName",
                        data: {
                            expected: expectedName,
                            actual: specifier.local.name,
                        },
                        fix: isSoleStylesheet
                            ? createRenameFix(
                                  context.sourceCode,
                                  cssModuleImport,
                                  expectedName
                              )
                            : null,
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
