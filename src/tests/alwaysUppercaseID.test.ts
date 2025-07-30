import { RuleTester } from "@typescript-eslint/rule-tester";
import * as vitest from "vitest";
import { alwaysUppercaseID } from "../rules/alwaysUppercaseID";

RuleTester.afterAll = vitest.afterAll;
RuleTester.it = vitest.it;
RuleTester.itOnly = vitest.it.only;
RuleTester.describe = vitest.describe;

const ruleTester = new RuleTester({
    parser: "@typescript-eslint/parser",
});

ruleTester.run("alwaysUppercaseID", alwaysUppercaseID, {
    valid: [
        // Correctly capitalized ID
        "const userID = 123;",
        "function getUserID() { return 123; }",
        "const userIDs = [1, 2, 3];",
        "class UserProfile { static userID = 123; }",
        "const obj = { userID: 123 };",
        "const userIDToRemove = 123;",
        "const identify = () => {};",
        "const identity = x => x;",
        "const userIDsMappedByGroupIDs = 123;",
        "const userIDMappedByGroupIDs = 123;",

        // Import statements should be ignored
        "import { myMagicalId } from 'module';",
        "import { myMagicalIds } from 'module';",
        "import myMagicalId from 'module';",
        "import myMagicalIds from 'module';",
        "import * as myMagicalId from 'module';",
        "import * as myMagicalIds from 'module';",
    ],
    invalid: [
        {
            code: "const userIDsMappedBysGroupIds = 123;",
            errors: [
                {
                    messageId: "useUppercaseID",
                    data: { found: "Ids" },
                },
            ],
        },
        {
            code: "const userIDsMappedByGroupId = 123;",
            errors: [
                {
                    messageId: "useUppercaseID",
                    data: { found: "Id" },
                },
            ],
        },
        {
            code: "const userId = 123;",
            errors: [
                {
                    messageId: "useUppercaseID",
                    data: { found: "Id" },
                },
            ],
        },
        {
            code: "function getUserId() { return 123; }",
            errors: [
                {
                    messageId: "useUppercaseID",
                    data: { found: "Id" },
                },
            ],
        },
        {
            code: "const userIds = [1, 2, 3];",
            errors: [
                {
                    messageId: "useUppercaseID",
                    data: { found: "Ids" },
                },
            ],
        },
        {
            code: "class UserProfile { static userId = 123; }",
            errors: [
                {
                    messageId: "useUppercaseID",
                    data: { found: "Id" },
                },
            ],
        },
        {
            code: "const obj = { userId: 123 };",
            errors: [
                {
                    messageId: "useUppercaseID",
                    data: { found: "Id" },
                },
            ],
        },
        {
            code: "const userIdToRemove = 123;",
            errors: [
                {
                    messageId: "useUppercaseID",
                    data: { found: "Id" },
                },
            ],
        },
        {
            code: "const userId123 = 123;", // 'Id' is not at a word boundary
            errors: [
                {
                    messageId: "useUppercaseID",
                    data: { found: "Id" },
                },
            ],
        },
    ],
});
