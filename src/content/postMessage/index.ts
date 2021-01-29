import { browser } from "webextension-polyfill-ts";
import { Iframe } from "../iframes/common";
import { IframeLogin } from "../iframes/login";
import { IframeLogout } from "../iframes/logout";
import { IframeMainMenu } from "../iframes/mainMenu";
import { closeLoginAndopenMainMenu } from "./closeLoginAndopenMainMenu";
import { logouted } from "./logouted";
import { logoutFailed } from "./logoutFailed";
import { uuidIsString } from "./uuidIsString";
export const postMessage = (
  closeAllIframe: (ignoreIframes?: Iframe[]) => void,
  iframeMainMenu: IframeMainMenu,
  iframeLogin: IframeLogin,
  iframeLogout: IframeLogout
) => {
  window.addEventListener(
    "message",
    async (event) => {
      browser.storage.local.get(["isLogin"]).then(async ({ isLogin }) => {
        if (event.origin !== process.env.receiveLoginOrigin) return;

        if (typeof event.data.userUuid === "string") {
          await uuidIsString(event);
        } else if (
          event.data.closeLogin === true &&
          event.data.openMainMenu === true
        ) {
          await closeLoginAndopenMainMenu(event, iframeLogin, iframeMainMenu);
        } else if (event.data.logouted === true) {
          await logouted(event, closeAllIframe);
        } else if (event.data.logoutFailed === true) {
          await logoutFailed(iframeLogout, iframeMainMenu);
        }
      });
    },
    false
  );
};
