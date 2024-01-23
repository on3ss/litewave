import { ScalarType } from "./types";

export const traverseObjectByPath = (
  path: string,
  properties: Record<string, any>
) =>
  path.split(".").reduce((current, component) => {
    if (Array.isArray(current) && !isNaN(parseInt(component))) {
      return current[parseInt(component)];
    }
    if (
      typeof current === "object" &&
      current !== null &&
      current.hasOwnProperty(component)
    ) {
      return current[component];
    }
    return undefined;
  }, properties);

export const convertToCamelCase = (str: string) => {
  return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
};

const isScalar = (item: any) =>
  [
    "[object String]",
    "[object Number]",
    "[object Boolean]",
    "[object Null]",
  ].includes(Object.prototype.toString.call(item));

export const validateScalar = (value: any): ScalarType =>
  isScalar(value)
    ? value
    : (() => {
        throw new Error(
          "Cannot render non-scalar types! Please check key specified in data-text attribute!"
        );
      })();

export const isEmpty = (value: string | null | undefined): boolean => {
  return value === null || value === undefined || value.trim() === "";
};
