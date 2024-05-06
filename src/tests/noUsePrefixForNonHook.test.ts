import { RuleTester } from "@typescript-eslint/rule-tester";
import * as vitest from "vitest";
import { noUsePrefixForNonHook } from "../rules/noUsePrefixForNonHook";

RuleTester.afterAll = vitest.afterAll;
RuleTester.it = vitest.it;
RuleTester.itOnly = vitest.it.only;
RuleTester.describe = vitest.describe;

const ruleTester = new RuleTester({
    parser: "@typescript-eslint/parser",
});

ruleTester.run("noUsePrefixForNonHook", noUsePrefixForNonHook, {
    valid: [
        'const useCustom = () => {const [state, setState] = useState(""); return {state, setState};};',
        'const useCustom = () => {const [state, setState] = useState(""); return {state, setState};};',
        "const useCustom = () => {const query = Queries.useUserQuery(); return query};",
        'const useCustom = () => {return useState("");};',
        "const useCustom = () => {useEffect(() => {});};",
        'const useCustom = () => useState("");',
        "const useCustom = useState;",
        "const myFunction = () => {};",
        "const userFunction = () => {};",
        'function useCustom() {const [state, setState] = useState(""); return {state, setState};}',
        "function useCustom() {const query = Queries.useUserQuery(); return query};",
        'function useCustom() {return useState("");}',
        "function useCustom() {useEffect(() => {});}",
        "function myFunction() {}",
        "function userFunction() {}",
        "const user = null;",
        "const myVariable = null;",
        "const data = useUserData();",
    ],
    invalid: [
        {
            code: "const useCustom = () => {};",
            errors: [
                {
                    messageId: "noUsePrefixForNonHook",
                },
            ],
        },
        {
            code: "const useCustom = () => {return userFunction();};",
            errors: [
                {
                    messageId: "noUsePrefixForNonHook",
                },
            ],
        },
        {
            code: "const useCustom = () => {const data = userFunction(); return data;};",
            errors: [
                {
                    messageId: "noUsePrefixForNonHook",
                },
            ],
        },
        {
            code: "function useCustom() {}",
            errors: [
                {
                    messageId: "noUsePrefixForNonHook",
                },
            ],
        },
        {
            code: "function useCustom() {return userFunction();}",
            errors: [
                {
                    messageId: "noUsePrefixForNonHook",
                },
            ],
        },
        {
            code: "function useCustom() {const data = userFunction(); return data;}",
            errors: [
                {
                    messageId: "noUsePrefixForNonHook",
                },
            ],
        },
        {
            code: "const useCustom = null;",
            errors: [
                {
                    messageId: "noUsePrefixForNonHook",
                },
            ],
        },
        {
            code: "function myFunction() {}; const useCustom = myFunction;",
            errors: [
                {
                    messageId: "noUsePrefixForNonHook",
                },
            ],
        },
        {
            code: "const myVariable = null; const useCustom = myVariable;",
            errors: [
                {
                    messageId: "noUsePrefixForNonHook",
                },
            ],
        },
    ],
});
