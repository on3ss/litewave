import {
  interpolateParameters,
  parseCalculationString,
} from "./function-utils";
import { updateTextElement } from "./text-utils";
import { traverseObjectByPath } from "./utils";

const calculateAndReturn = (
  element: Element,
  properties: Record<string, any>
) => {
  const calculationString = (element as HTMLElement).dataset.textCalc;
  if (!calculationString) {
    return;
  }
  const { functionName, parameters } =
    parseCalculationString(calculationString);
  const calculationFunction = traverseObjectByPath(functionName, properties);

  if (typeof calculationFunction === "function") {
    return calculationFunction(
      ...interpolateParameters(parameters, properties)
    );
  } else {
    console.warn(
      `Calculation function ${functionName} not found or not a function.`
    );
    return undefined;
  }
};

export const performTextCalculated = (
  textEls: NodeListOf<Element>,
  properties: Record<string, any>
) => {
  textEls.forEach((element: Element) => {
    updateTextElement(
      element as HTMLElement,
      "data-text-calculate-old",
      calculateAndReturn(element, properties)
    );
  });
};
