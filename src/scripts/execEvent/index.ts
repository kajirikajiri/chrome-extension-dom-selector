import { browser } from "webextension-polyfill-ts";
import { Event } from "../../types/event";

export const execEvent = async (event: Event, hover = false) => {
  const tabs = await browser.tabs.query({ active: true, currentWindow: true });
  const { success } = await browser.tabs.sendMessage(tabs[0].id, {
    event,
    hover,
  });
};
