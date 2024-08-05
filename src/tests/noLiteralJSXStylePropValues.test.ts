import { RuleTester } from "@typescript-eslint/rule-tester";
import * as vitest from "vitest";
import { noLiteralJSXStylePropValues } from "../rules/noLiteralJSXStylePropValues";

RuleTester.afterAll = vitest.afterAll;
RuleTester.it = vitest.it;
RuleTester.itOnly = vitest.it.only;
RuleTester.describe = vitest.describe;

const ruleTester = new RuleTester({
    parser: "@typescript-eslint/parser",
});

ruleTester.run("noLiteralJSXStylePropValues", noLiteralJSXStylePropValues, {
    valid: [
        {
            code: "<div />",
            parserOptions: { ecmaFeatures: { jsx: true } },
        },
        {
            code: "<div style={myMagicStyle} />",
            parserOptions: { ecmaFeatures: { jsx: true } },
        },
        {
            code: "<div style={{ color: myMagicColor }} />",
            parserOptions: { ecmaFeatures: { jsx: true } },
        },
        {
            code: "<div style={{ color: myMagicColor, backgroundColor: myMagicBackgroundColor }} />",
            parserOptions: { ecmaFeatures: { jsx: true } },
        },
        {
            code: "<div style={{ gap: myMagicGap * size }} />",
            parserOptions: { ecmaFeatures: { jsx: true } },
        },
        {
            code: "<div style={{ gap: getMagicColor() }} />",
            parserOptions: { ecmaFeatures: { jsx: true } },
        },
        {
            code: "<div style={{ gap: isMagic ? getMagicColor() : undefined }} />",
            parserOptions: { ecmaFeatures: { jsx: true } },
        },
        {
            code: "<div style={{ border: `1px solid ${myMagicBorderColor}` }} />",
            parserOptions: { ecmaFeatures: { jsx: true } },
        },
        {
            code: "<div style={{ border: `1px solid ${getMagicBorderColor()}` }} />",
            parserOptions: { ecmaFeatures: { jsx: true } },
        },
        {
            code: "<div style={{ border: `1px solid ${isMagic ? getMagicColor() : getNormalColor()}` }} />",
            parserOptions: { ecmaFeatures: { jsx: true } },
        },
    ],
    invalid: [
        {
            code: '<div style={{ color: "red" }} />',
            parserOptions: { ecmaFeatures: { jsx: true } },
            errors: [
                {
                    messageId: "noLiteralJSXStylePropValues",
                },
            ],
        },
        {
            code: '<div style={{ color: myMagicColor, backgroundColor: "white" }} />',
            parserOptions: { ecmaFeatures: { jsx: true } },
            errors: [
                {
                    messageId: "noLiteralJSXStylePropValues",
                },
            ],
        },
        {
            code: '<div style={{ color: isMagic ? "red" : "blue" }} />',
            parserOptions: { ecmaFeatures: { jsx: true } },
            errors: [
                {
                    messageId: "noLiteralJSXStylePropValues",
                },
            ],
        },
        {
            code: '<div style={{ color: isMagic ? getMagicColor() : "blue" }} />',
            parserOptions: { ecmaFeatures: { jsx: true } },
            errors: [
                {
                    messageId: "noLiteralJSXStylePropValues",
                },
            ],
        },
        {
            code: '<div style={{ border: `1px solid ${isMagic ? "red" : "blue"}` }} />',
            parserOptions: { ecmaFeatures: { jsx: true } },
            errors: [
                {
                    messageId: "noLiteralJSXStylePropValues",
                },
            ],
        },
        {
            code: '<div style={{ border: `1px solid ${isMagic ? myMagicBorderColor : "blue"}` }} />',
            parserOptions: { ecmaFeatures: { jsx: true } },
            errors: [
                {
                    messageId: "noLiteralJSXStylePropValues",
                },
            ],
        },
        {
            code: "<div style={{ border: `1px solid blue` }} />",
            parserOptions: { ecmaFeatures: { jsx: true } },
            errors: [
                {
                    messageId: "noLiteralJSXStylePropValues",
                },
            ],
        },
        {
            code: '<div style={{ border: `1px solid ${"blue"}` }} />',
            parserOptions: { ecmaFeatures: { jsx: true } },
            errors: [
                {
                    messageId: "noLiteralJSXStylePropValues",
                },
            ],
        },
    ],
});
