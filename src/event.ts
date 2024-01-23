import {
  interpolateParameters,
  parseCalculationString,
} from "./function-utils";
import { isEmpty, traverseObjectByPath } from "./utils";

export const performEvent = (
  eventEls: NodeListOf<Element>,
  properties: Record<string, any>
) => {
  eventEls.forEach((element: Element) => {
    const eventsAndHandlersString = (element as HTMLElement).dataset.event;
    console.log(eventsAndHandlersString);
    if (isEmpty(eventsAndHandlersString)) {
      throw new Error("Invalid or no events and handlers defined!");
    }

    const eventsAndHandlersArray = eventsAndHandlersString
      ?.split(",")
      .map(item => item.split(":"));

    eventsAndHandlersArray?.forEach((eventAndHandler: string[]) => {
      console.log(eventAndHandler);
      const { functionName, parameters } = parseCalculationString(
        eventAndHandler[1]
      );
      const eventHandler = traverseObjectByPath(functionName, properties);
      if (typeof eventHandler === "function") {
        element.addEventListener(eventAndHandler[0], event => {
          event.preventDefault();
          properties[functionName](
            ...interpolateParameters(parameters, properties)
          );
        });
      }
    });
  });
};
