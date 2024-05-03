import type { RuleModule } from "@typescript-eslint/utils/dist/ts-eslint";
import type { ESLint } from "eslint";
import { name, version } from "../package.json";
import { rules } from "./rules";

type RuleKey = keyof typeof rules;

interface Plugin extends Omit<ESLint.Plugin, "rules"> {
    rules: Record<RuleKey, RuleModule<string>>;
}

const plugin: Plugin = {
    meta: {
        name,
        version,
    },
    rules,
};

export = plugin;
