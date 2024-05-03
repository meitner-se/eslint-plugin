import {
    ArrowFunctionExpression,
    FunctionDeclaration,
    LeftHandSideExpression,
} from "@typescript-eslint/types/dist/generated/ast-spec";
import { ESLintUtils } from "@typescript-eslint/utils";

const PREFIX_REGEX = /^use[A-Z]/;

function hasUsePrefix(name: string) {
    return name.match(PREFIX_REGEX) !== null;
}

function calleeHasUsePrefix(callee: LeftHandSideExpression) {
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

function hasVariableDeclarationWithUsePrefix(
    node: ArrowFunctionExpression | FunctionDeclaration
) {
    return (
        node.body.type === "BlockStatement" &&
        node.body.body.some(
            (statement) =>
                statement.type === "VariableDeclaration" &&
                statement.declarations.some(
                    (declaration) =>
                        declaration.init &&
                        declaration.init.type === "CallExpression" &&
                        calleeHasUsePrefix(declaration.init.callee)
                )
        )
    );
}

function hasReturnStatementWithUsePrefix(
    node: ArrowFunctionExpression | FunctionDeclaration
) {
    return (
        node.body.type === "BlockStatement" &&
        node.body.body.some(
            (statement) =>
                statement.type === "ReturnStatement" &&
                statement.argument &&
                statement.argument.type === "CallExpression" &&
                calleeHasUsePrefix(statement.argument.callee)
        )
    );
}

function hasFunctionInvokationWithUsePrefix(
    node: ArrowFunctionExpression | FunctionDeclaration
) {
    return (
        node.body.type === "BlockStatement" &&
        node.body.body.some(
            (statement) =>
                statement.type === "ExpressionStatement" &&
                statement.expression.type === "CallExpression" &&
                calleeHasUsePrefix(statement.expression.callee)
        )
    );
}

function arrowFunctionHasImplicitReturnWithUsePrefix(
    node: ArrowFunctionExpression
) {
    return (
        node.body.type !== "BlockStatement" &&
        node.body.type === "CallExpression" &&
        node.body.callee.type === "Identifier" &&
        hasUsePrefix(node.body.callee.name)
    );
}

export const noUsePrefixForNonHook = ESLintUtils.RuleCreator.withoutDocs({
    create(context) {
        return {
            ArrowFunctionExpression(node) {
                const name =
                    "id" in node.parent &&
                    node.parent.id &&
                    "name" in node.parent.id
                        ? node.parent.id?.name
                        : "";

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
