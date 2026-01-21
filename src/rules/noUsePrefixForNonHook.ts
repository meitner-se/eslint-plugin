import { ESLintUtils, TSESTree } from "@typescript-eslint/utils";

const PREFIX_REGEX = /^use($|[A-Z])/;

function hasUsePrefix(name: string) {
    return name.match(PREFIX_REGEX) !== null;
}

function calleeHasUsePrefix(callee: TSESTree.LeftHandSideExpression) {
    if (callee.type === "Identifier") {
        return hasUsePrefix(callee.name);
    }

    if (callee.type === "MemberExpression") {
        return callee.property.type === "Identifier"
            ? hasUsePrefix(callee.property.name)
            : false;
    }

    return false;
}

function expressionContainsHookCall(
    expression: TSESTree.Expression | TSESTree.PrivateIdentifier
): boolean {
    if (!expression) {
        return false;
    }

    if (expression.type === "CallExpression") {
        return (
            calleeHasUsePrefix(expression.callee) ||
            (expression.callee.type === "Identifier" &&
                expression.callee.name === "use")
        );
    }

    if (expression.type === "BinaryExpression") {
        return (
            expressionContainsHookCall(expression.left) ||
            expressionContainsHookCall(expression.right)
        );
    }

    if (expression.type === "ConditionalExpression") {
        return (
            expressionContainsHookCall(expression.test) ||
            expressionContainsHookCall(expression.consequent) ||
            expressionContainsHookCall(expression.alternate)
        );
    }

    if (expression.type === "LogicalExpression") {
        return (
            expressionContainsHookCall(expression.left) ||
            expressionContainsHookCall(expression.right)
        );
    }

    if (expression.type === "SequenceExpression") {
        return expression.expressions.some((expr) =>
            expressionContainsHookCall(expr)
        );
    }

    return false;
}

function hasVariableDeclarationWithUsePrefix(
    node: TSESTree.ArrowFunctionExpression | TSESTree.FunctionDeclaration
) {
    return (
        node.body.type === "BlockStatement" &&
        node.body.body.some(
            (statement) =>
                statement.type === "VariableDeclaration" &&
                statement.declarations.some(
                    (declaration) =>
                        declaration.init &&
                        expressionContainsHookCall(declaration.init)
                )
        )
    );
}

function hasReturnStatementWithUsePrefix(
    node: TSESTree.ArrowFunctionExpression | TSESTree.FunctionDeclaration
) {
    return (
        node.body.type === "BlockStatement" &&
        node.body.body.some(
            (statement) =>
                statement.type === "ReturnStatement" &&
                statement.argument &&
                expressionContainsHookCall(statement.argument)
        )
    );
}

function hasFunctionInvokationWithUsePrefix(
    node: TSESTree.ArrowFunctionExpression | TSESTree.FunctionDeclaration
) {
    return (
        node.body.type === "BlockStatement" &&
        node.body.body.some(
            (statement) =>
                statement.type === "ExpressionStatement" &&
                statement.expression.type === "CallExpression" &&
                (calleeHasUsePrefix(statement.expression.callee) ||
                    (statement.expression.callee.type === "Identifier" &&
                        statement.expression.callee.name === "use"))
        )
    );
}

function arrowFunctionHasImplicitReturnWithUsePrefix(
    node: TSESTree.ArrowFunctionExpression
) {
    if (node.body.type === "BlockStatement") {
        return false;
    }
    return expressionContainsHookCall(node.body);
}

function getArrowFunctionName(node: TSESTree.ArrowFunctionExpression) {
    if (!("id" in node.parent)) {
        return;
    }

    if (!node.parent.id) {
        return;
    }

    if (!("name" in node.parent.id)) {
        return;
    }

    return node.parent.id.name;
}

export const noUsePrefixForNonHook = ESLintUtils.RuleCreator.withoutDocs({
    create(context) {
        return {
            ArrowFunctionExpression(node) {
                const name = getArrowFunctionName(node);

                if (!name || !hasUsePrefix(name)) {
                    return;
                }

                // Check if the function uses hooks
                if (
                    hasVariableDeclarationWithUsePrefix(node) ||
                    hasReturnStatementWithUsePrefix(node) ||
                    hasFunctionInvokationWithUsePrefix(node) ||
                    arrowFunctionHasImplicitReturnWithUsePrefix(node)
                ) {
                    return;
                }

                context.report({
                    node,
                    messageId: "noUsePrefixForNonHook",
                });
            },
            FunctionDeclaration(node) {
                const name = node.id?.name;

                if (!name || !hasUsePrefix(name)) {
                    return;
                }

                // Check if the function uses hooks
                if (
                    hasVariableDeclarationWithUsePrefix(node) ||
                    hasReturnStatementWithUsePrefix(node) ||
                    hasFunctionInvokationWithUsePrefix(node)
                ) {
                    return;
                }

                context.report({
                    node,
                    messageId: "noUsePrefixForNonHook",
                });
            },
            VariableDeclaration(node) {
                const declaration = node.declarations[0];

                if (!declaration) {
                    return;
                }

                const name =
                    "name" in declaration.id ? declaration?.id.name : "";

                if (!name || !hasUsePrefix(name)) {
                    return;
                }

                // Check if the variable is assigned an arrow function
                if (
                    declaration.init &&
                    declaration.init.type === "ArrowFunctionExpression"
                ) {
                    // We check arrow functions in the ArrowFunctionExpression visitor
                    return;
                }

                if (
                    declaration.init &&
                    declaration.init.type === "Identifier" &&
                    hasUsePrefix(declaration.init.name)
                ) {
                    return;
                }

                // Check if the variable is assigned a conditional expression with hooks on both branches
                if (
                    declaration.init &&
                    declaration.init.type === "ConditionalExpression" &&
                    declaration.init.consequent.type === "Identifier" &&
                    declaration.init.alternate.type === "Identifier" &&
                    hasUsePrefix(declaration.init.consequent.name) &&
                    hasUsePrefix(declaration.init.alternate.name)
                ) {
                    return;
                }

                // Check if the variable is assigned a function, we accept functions named as hooks or not, since it's quite common to create a hook with a factory function, such as `createStore` from `zustand`
                if (
                    declaration.init &&
                    declaration.init.type === "CallExpression"
                ) {
                    return;
                }

                context.report({
                    node,
                    messageId: "noUsePrefixForNonHook",
                });
            },
        };
    },
    meta: {
        messages: {
            noUsePrefixForNonHook:
                "Do not use 'use' prefix for non-hook functions.",
        },
        type: "problem",
        schema: [],
    },
    defaultOptions: [],
});
