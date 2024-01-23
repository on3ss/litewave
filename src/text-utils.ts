import { ScalarType } from "./types";

export const updateTextElement = (
  node: HTMLElement,
  oldValueAttr: string,
  value: ScalarType
) => {
  const oldValue = node.getAttribute(oldValueAttr);
  const valueToSet = value.toString();
  if (oldValue !== value) {
    node.setAttribute(oldValueAttr, valueToSet);
    node.textContent = valueToSet;
  }
};
