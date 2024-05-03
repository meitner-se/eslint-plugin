import { noInlineFunctionParameterTypeAnnotation } from "./noInlineFunctionParameterTypeAnnotation";
import { noUsePrefixForNonHook } from "./noUsePrefixForNonHook";

const rules = {
    "no-inline-function-parameter-type-annotation":
        noInlineFunctionParameterTypeAnnotation,
    "no-use-prefix-for-non-hook": noUsePrefixForNonHook,
};

export { rules };
