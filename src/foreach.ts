import { parseCalculationString } from "./function-utils";
import { convertToCamelCase, isEmpty, traverseObjectByPath } from "./utils";

const interpolateForText = (
  node: HTMLElement,
  dataKey: string,
  index: number
) => {
  node.querySelectorAll("[data-text]").forEach((element: Element) => {
    const key = (element as HTMLElement).dataset.text;
    element.setAttribute("data-text", `${dataKey}.${index}.${key}`);
  });
};

const updateFunction = (
  element: Element,
  attribute: string,
  dataKey: string,
  index: number
) => {
  const calculationString = (element as HTMLElement).dataset[
    convertToCamelCase(attribute)
  ];
  if (!calculationString) {
    return;
  }
  const { functionName, parameters } =
    parseCalculationString(calculationString);
  const formattedParameters = parameters.map(
    param => `${dataKey}.${index}.${param}`
  );
  element.setAttribute(
    `data-${attribute}`,
    `${functionName}(${formattedParameters.join(",")})`
  );
};

const interpolateForTextCalculated = (
  node: HTMLElement,
  dataKey: string,
  index: number
) => {
  node.querySelectorAll("[data-text-calc]").forEach((element: Element) => {
    updateFunction(element, "text-calc", dataKey, index);
  });
};

const updateEventsFunctions = (
  element: Element,
  dataKey: string,
  index: number
) => {
  const eventsAndHandlersString = (element as HTMLElement).dataset.event;
  if (isEmpty(eventsAndHandlersString)) {
    throw new Error("Invalid or no events and handlers defined!");
  }

  const eventsAndHandlersArray: string[][] | undefined = eventsAndHandlersString
    ?.split(",")
    .map(item => item.split(":"));
  if (!eventsAndHandlersArray) {
    throw new Error("Invalid or no events and handlers defined!");
  }
  const formattedEventArray = eventsAndHandlersArray?.map(
    (eventAndHandler: string[]) => {
      const { functionName, parameters } = parseCalculationString(
        eventAndHandler[1]
      );
      const formattedParameters = parameters.map(
        param => `${dataKey}.${index}.${param}`
      );
      const formattedFunctionWithParams = `${functionName}(${formattedParameters.join(",")})`;
      return [eventAndHandler[0], formattedFunctionWithParams];
    }
  );

  const formattedEventString = formattedEventArray
    .map(item => item.join(":"))
    .join(",");

  element.setAttribute("data-event", formattedEventString);
};

const interpolateForEvents = (
  node: HTMLElement,
  dataKey: string,
  index: number
) => {
  node.querySelectorAll("[data-event]").forEach((element: Element) => {
    updateEventsFunctions(element, dataKey, index);
  });
};

const cloneAndInterpolate = (
  element: HTMLTemplateElement,
  dataKey: string,
  index: number
): Element | null => {
  if (!element) {
    return null;
  }
  const clonedElement = element.content.cloneNode(true) as HTMLElement;
  interpolateForText(clonedElement, dataKey, index);
  interpolateForTextCalculated(clonedElement, dataKey, index);
  interpolateForEvents(clonedElement, dataKey, index);

  return clonedElement.firstElementChild;
};

export const performForEach = (
  element: HTMLTemplateElement,
  properties: Record<string, any>
) => {
  const dataKey: string | undefined = element.dataset.foreach?.trim();
  if (!dataKey) throw new Error("foreach definition not given!");

  const fragment: DocumentFragment = document.createDocumentFragment();
  const dataArray = traverseObjectByPath(dataKey, properties);

  if (Array.isArray(dataArray)) {
    dataArray.forEach((_, index) => {
      const cloned = cloneAndInterpolate(element, dataKey, index);
      if (cloned) {
        fragment.appendChild(cloned);
      }
    });
    const container = document.createElement("div");
    container.setAttribute("data-foreach-id", dataKey);
    container.appendChild(fragment);
    element.insertAdjacentElement("afterend", container);
  } else {
    console.warn(`properties[${dataKey}] is not an array.`);
  }
};
