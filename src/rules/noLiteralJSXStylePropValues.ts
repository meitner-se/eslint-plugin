import {
    ConditionalExpression,
    ObjectLiteralElement,
    TemplateLiteral,
} from "@typescript-eslint/types/dist/generated/ast-spec";
import { ESLintUtils } from "@typescript-eslint/utils";

function isConditionalExpressionValid(expression: ConditionalExpression) {
    // If the consequent value of a conditional expression is a literal we should report it. Consequent means the value that is returned if the condition is true.
    if (expression.consequent.type === "Literal") {
        return false;
    }

    // If the alternate value of a conditional expression is a literal we should report it. Alternate means the value that is returned if the condition is false.
    if (expression.alternate.type === "Literal") {
        return false;
    }

    return true;
}

function isTemplateLiteralValid(literal: TemplateLiteral) {
    const expressions = literal.expressions;

    if (expressions.length === 0) {
        return false;
    }

    const literalExpressions = literal.expressions.filter(
        (expression) => expression.type === "Literal"
    );

    if (literalExpressions.length > 0) {
        return false;
    }

    const hasInvalidConditionalExpressions = expressions.some(
        (expression) =>
            expression.type === "ConditionalExpression" &&
            !isConditionalExpressionValid(expression)
    );

    if (hasInvalidConditionalExpressions) {
        return false;
    }

    return true;
}

function isExpressionPropertyValid(property: ObjectLiteralElement) {
    if (property.type === "SpreadElement") {
        return true;
    }

    if (property.type !== "Property") {
        return false;
    }

    // If the value is a literal, it's static and we should report it.
    if (property.value.type === "Literal") {
        return false;
    }

    // If the value is a conditional expression, we need to check if it's valid
    if (
        property.value.type === "ConditionalExpression" &&
        !isConditionalExpressionValid(property.value)
    ) {
        return false;
    }

    if (
        property.value.type === "TemplateLiteral" &&
        !isTemplateLiteralValid(property.value)
    ) {
        return false;
    }

    return true;
}

export const noLiteralJSXStylePropValues = ESLintUtils.RuleCreator.withoutDocs({
    create(context) {
        return {
            JSXElement(node) {
                const styleAttribute = node.openingElement.attributes.find(
                    (attribute) =>
                        attribute.type === "JSXAttribute" &&
                        attribute.name.name === "style"
                );

                if (
                    styleAttribute === undefined ||
                    styleAttribute.type !== "JSXAttribute"
                ) {
                    return;
                }

                const value = styleAttribute.value;

                if (value === null || value.type !== "JSXExpressionContainer") {
                    return;
                }

                const expression = value.expression;

                if (expression.type !== "ObjectExpression") {
                    return;
                }

                const arePropertiesValid = expression.properties.every(
                    isExpressionPropertyValid
                );

                if (arePropertiesValid) {
                    return;
                }

                context.report({
                    node,
                    messageId: "noLiteralJSXStylePropValues",
                    loc: styleAttribute.loc,
                });
            },
        };
    },
    meta: {
        messages: {
            noLiteralJSXStylePropValues:
                "Do not use literal values in JSX style props.",
        },
        type: "problem",
        schema: [],
    },
    defaultOptions: [],
});
