import { alwaysUppercaseID } from "./alwaysUppercaseID";
import { alwaysSpreadJSXPropsFirst } from "./alwaysSpreadJSXPropsFirst";
import { noExportedTypesInTsxFiles } from "./noExportedTypesInTsxFiles";
import { noInlineFunctionParameterTypeAnnotation } from "./noInlineFunctionParameterTypeAnnotation";
import { noLiteralJSXStylePropValues } from "./noLiteralJSXStylePropValues";
import { noMixedExports } from "./noMixedExports";
import { noReactNamespace } from "./noReactNamespace";
import { noUsePrefixForNonHook } from "./noUsePrefixForNonHook";
import { preferTernaryForJSXExpressions } from "./preferTernaryForJSXExpressions";

const rules = {
    "always-uppercase-id": alwaysUppercaseID,
    "no-inline-function-parameter-type-annotation":
        noInlineFunctionParameterTypeAnnotation,
    "no-mixed-exports": noMixedExports,
    "no-use-prefix-for-non-hook": noUsePrefixForNonHook,
    "no-react-namespace": noReactNamespace,
    "no-literal-jsx-style-prop-values": noLiteralJSXStylePropValues,
    "always-spread-props-first": alwaysSpreadJSXPropsFirst,
    "no-exported-types-in-tsx-files": noExportedTypesInTsxFiles,
    "prefer-ternary-for-jsx-expressions": preferTernaryForJSXExpressions,
};

export { rules };
