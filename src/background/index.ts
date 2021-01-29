import { browser } from "webextension-polyfill-ts";

interface Req {
  setLoadedIcon?: true;
  setLoadingIcon?: true;
}

browser.browserAction.onClicked.addListener((tab) => {
  (async () => {
    browser.tabs.sendMessage(tab.id, { toggle: true });
  })();
});

browser.runtime.onMessage.addListener((request: Req) => {
  if (request.setLoadedIcon) {
    (async () => {
      await browser.browserAction.setIcon({ path: "../icon16-loaded.png" });
    })();
    return Promise.resolve({ success: true });
  } else if (request.setLoadingIcon) {
    (async () => {
      browser.browserAction.setIcon({ path: "../icon16-loading.png" });
    })();
    return Promise.resolve({ success: true });
  }
});
