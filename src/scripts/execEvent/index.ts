import { browser } from "webextension-polyfill-ts";

export const execEvent = async (selector: string, index: number) => {
  const tabs = await browser.tabs.query({ active: true, currentWindow: true });
  const { success } = await browser.tabs.sendMessage(tabs[0].id, {
    selector,
    index,
  });
};
