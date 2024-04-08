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

function getParametersWithInlineTypeAnnotations(params: Parameter[]) {
    return params.filter((param) => {
        if (!("typeAnnotation" in param)) {
            return false;
        }

        return (
            param.typeAnnotation?.typeAnnotation.type ===
            AST_NODE_TYPES.TSTypeLiteral
        );
    });
}

function getLoc(params: Parameter[]) {
    const firstParameter = params[0];
    const lastParameter = params[params.length - 1];

    if (!firstParameter || !lastParameter) {
        return;
    }

    return {
        start: firstParameter.loc.start,
        end: lastParameter.loc.end,
    };
}

export const noInlineFunctionParameterTypeAnnotation =
    ESLintUtils.RuleCreator.withoutDocs({
        create(context) {
            return {
                ArrowFunctionExpression(node) {
                    const parameters = getParametersWithInlineTypeAnnotations(
                        node.params
                    );

                    if (parameters.length === 0) {
                        return;
                    }

                    const loc = getLoc(parameters);

                    context.report({
                        node,
                        messageId: "noInlineFunctionParameterTypeAnnotation",
                        loc,
                    });
                },
                FunctionDeclaration(node) {
                    const parameters = getParametersWithInlineTypeAnnotations(
                        node.params
                    );

                    if (parameters.length === 0) {
                        return;
                    }

                    const loc = getLoc(parameters);

                    context.report({
                        node,
                        messageId: "noInlineFunctionParameterTypeAnnotation",
                        loc,
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
