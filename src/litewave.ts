import { performEvent } from "./event";
import { performForEach } from "./foreach";
import { performText } from "./text";
import { performTextCalculated } from "./text-calculated";

const callIfExists = (obj: Record<string, any>, funcName: string) =>
  obj.hasOwnProperty(funcName) && obj[funcName]();

export const LiteWave = (domain: string, properties: Record<string, any>) => {
  // TODO: Set handlers
  const proxiedProperties: Record<string, any> = new Proxy(properties, {});
  // TODO: Use querySelectorAll afterwards
  const rootEl: HTMLElement | null = document.querySelector(
    `[data-domain="${domain}"]`
  );

  if (!rootEl) {
    return;
  }

  const mountOnReady = () => {
    callIfExists(properties, "onMount");
  };

  mountOnReady();

  // TODO: Use querySelectorAll afterwards
  const forEachEl: HTMLTemplateElement | null =
    rootEl.querySelector("[data-foreach]");
  if (forEachEl) {
    performForEach(forEachEl, proxiedProperties);
  }

  const textEls: NodeListOf<Element> | null =
    rootEl.querySelectorAll("[data-text]");
  if (textEls) {
    performText(textEls, proxiedProperties);
  }

  const textCalculatedEls: NodeListOf<Element> | null =
    rootEl.querySelectorAll("[data-text-calc]");
  if (textCalculatedEls) {
    performTextCalculated(textCalculatedEls, proxiedProperties);
  }

  const eventEls: NodeListOf<Element> | null =
    rootEl.querySelectorAll("[data-event]");
  if (eventEls) {
    performEvent(eventEls, proxiedProperties);
  }
};
