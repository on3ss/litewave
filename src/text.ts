import { updateTextElement } from "./text-utils";
import { traverseObjectByPath, validateScalar } from "./utils";

export const performText = (
  textEls: NodeListOf<Element>,
  properties: Record<string, any>
) => {
  textEls.forEach((element: Element) => {
    const node = element as HTMLElement;
    const recordPath = node.dataset.text;
    if (!recordPath) {
      return;
    }
    const value = traverseObjectByPath(recordPath, properties);
    if (!value) {
      const key = recordPath.split(".").pop();
      throw new Error(
        `Element of key: ${key === "" ? "(empty key)" : key} not found in property!`
      );
    }
    const scalarValue = validateScalar(value);
    updateTextElement(node, "data-text-old", scalarValue);
  });
};
