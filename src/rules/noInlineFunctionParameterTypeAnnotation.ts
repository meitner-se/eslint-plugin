import { AST_NODE_TYPES } from "@typescript-eslint/types";
import type { Parameter } from "@typescript-eslint/types/dist/generated/ast-spec";
import { ESLintUtils } from "@typescript-eslint/utils";

function paramsHaveInlineTypeAnnotation(params: Parameter[]) {
    return params.some((param) => {
        if (!("typeAnnotation" in param)) {
            return false;
        }

        return (
            param.typeAnnotation?.typeAnnotation.type ===
            AST_NODE_TYPES.TSTypeLiteral
        );
    });
}

export const noInlineFunctionParameterTypeAnnotation =
    ESLintUtils.RuleCreator.withoutDocs({
        create(context) {
            return {
                ArrowFunctionExpression(node) {
                    if (!paramsHaveInlineTypeAnnotation(node.params)) {
                        return;
                    }

                    context.report({
                        node,
                        messageId: "noInlineFunctionParameterTypeAnnotation",
                    });
                },
                FunctionDeclaration(node) {
                    if (!paramsHaveInlineTypeAnnotation(node.params)) {
                        return;
                    }

                    context.report({
                        node,
                        messageId: "noInlineFunctionParameterTypeAnnotation",
                    });
                },
            };
        },
        meta: {
            messages: {
                noInlineFunctionParameterTypeAnnotation:
                    "Do not use inline type annotations for function parameters. Use a separate type annotation instead",
            },
            type: "problem",
            schema: [],
        },
        defaultOptions: [],
    });
