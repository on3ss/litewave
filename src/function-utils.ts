import { traverseObjectByPath } from "./utils";

export const parseCalculationString = (calculationString: string) => {
  const [functionName, parameters] = calculationString.split("(");
  const trimmedParams = parameters
    .slice(0, -1)
    .split(",")
    .map(param => param.trim())
    .filter(param => param !== "");
  return { functionName: functionName.trim(), parameters: trimmedParams };
};

export const interpolateParameters = (
  parameters: string[],
  properties: Record<string, any>
) => parameters.map(param => traverseObjectByPath(param, properties));
