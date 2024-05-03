import { noInlineFunctionParameterTypeAnnotation } from "./noInlineFunctionParameterTypeAnnotation";
import { noMixedExports } from "./noMixedExports";

const rules = {
    "no-inline-function-parameter-type-annotation":
        noInlineFunctionParameterTypeAnnotation,
    "no-mixed-exports": noMixedExports,
};

export { rules };
