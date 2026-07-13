import { alwaysSpreadJSXPropsFirst } from "./alwaysSpreadJSXPropsFirst";
import { cssModuleImportName } from "./cssModuleImportName";
import { noExportedTypesInTsxFiles } from "./noExportedTypesInTsxFiles";
import { noHookResultAsArgument } from "./noHookResultAsArgument";
import { noHookResultMemberAccess } from "./noHookResultMemberAccess";
import { noInlineFunctionParameterTypeAnnotation } from "./noInlineFunctionParameterTypeAnnotation";
import { noLiteralJSXStylePropValues } from "./noLiteralJSXStylePropValues";
import { noMixedExports } from "./noMixedExports";
import { noReactNamespace } from "./noReactNamespace";
import { noSelfPackageImport } from "./noSelfPackageImport";
import { noUsePrefixForNonHook } from "./noUsePrefixForNonHook";
import { preferTernaryForJSXExpressions } from "./preferTernaryForJSXExpressions";
import { requireButtonType } from "./requireButtonType";
import { requireReduceInitialValue } from "./requireReduceInitialValue";

const rules = {
    "css-module-import-name": cssModuleImportName,
    "no-inline-function-parameter-type-annotation":
        noInlineFunctionParameterTypeAnnotation,
    "no-mixed-exports": noMixedExports,
    "no-use-prefix-for-non-hook": noUsePrefixForNonHook,
    "no-react-namespace": noReactNamespace,
    "no-self-package-import": noSelfPackageImport,
    "no-literal-jsx-style-prop-values": noLiteralJSXStylePropValues,
    "always-spread-props-first": alwaysSpreadJSXPropsFirst,
    "no-exported-types-in-tsx-files": noExportedTypesInTsxFiles,
    "prefer-ternary-for-jsx-expressions": preferTernaryForJSXExpressions,
    "require-button-type": requireButtonType,
    "require-reduce-initial-value": requireReduceInitialValue,
    "no-hook-result-member-access": noHookResultMemberAccess,
    "no-hook-result-as-argument": noHookResultAsArgument,
};

export { rules };
