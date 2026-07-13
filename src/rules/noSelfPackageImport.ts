import fs from "node:fs";
import path from "node:path";

import { ESLintUtils, TSESTree } from "@typescript-eslint/utils";

/** dir -> owning package name (or null), memoized across files. */
const packageNameCache = new Map<string, string | null>();

/**
 * Walk up from a file to the nearest package.json and return its `name`.
 */
function packageNameForFile(filename: string): string | null {
    let dir = path.dirname(filename);
    const visited: string[] = [];

    while (dir && dir !== path.dirname(dir)) {
        const cached = packageNameCache.get(dir);
        if (cached !== undefined) {
            for (const entry of visited) packageNameCache.set(entry, cached);
            return cached;
        }
        visited.push(dir);

        const pkgPath = path.join(dir, "package.json");
        if (fs.existsSync(pkgPath)) {
            let name: string | null = null;
            try {
                const parsed: unknown = JSON.parse(
                    fs.readFileSync(pkgPath, "utf8")
                );
                if (
                    typeof parsed === "object" &&
                    parsed !== null &&
                    "name" in parsed &&
                    typeof parsed.name === "string"
                ) {
                    name = parsed.name;
                }
            } catch {
                name = null;
            }
            for (const entry of visited) packageNameCache.set(entry, name);
            return name;
        }

        dir = path.dirname(dir);
    }

    for (const entry of visited) packageNameCache.set(entry, null);
    return null;
}

type SourcedNode =
    | TSESTree.ImportDeclaration
    | TSESTree.ExportNamedDeclaration
    | TSESTree.ExportAllDeclaration;

export const noSelfPackageImport = ESLintUtils.RuleCreator.withoutDocs({
    create(context) {
        const ownPackage = packageNameForFile(context.filename);
        if (ownPackage === null) {
            return {};
        }

        function check(node: SourcedNode) {
            const source = node.source;
            if (source === null || typeof source.value !== "string") {
                return;
            }
            const specifier = source.value;
            if (
                specifier === ownPackage ||
                specifier.startsWith(`${ownPackage}/`)
            ) {
                context.report({
                    node: source,
                    messageId: "selfImport",
                    data: { pkg: ownPackage },
                });
            }
        }

        return {
            ImportDeclaration: check,
            ExportNamedDeclaration: check,
            ExportAllDeclaration: check,
        };
    },
    meta: {
        messages: {
            selfImport:
                "Import sibling modules with a relative path, not this package's own name '{{pkg}}'.",
        },
        type: "problem",
        schema: [],
    },
    defaultOptions: [],
});
