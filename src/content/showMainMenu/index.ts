import { browser } from "webextension-polyfill-ts";
import { Iframe } from "../iframes/common";
import { IframeEventList } from "../iframes/eventList";
import { IframeMainMenu } from "../iframes/mainMenu";

export const showMainMenu = (
  closeAllIframe: (ignoreIframes?: Iframe[]) => void,
  loaded: boolean,
  iframeMainMenu: IframeMainMenu
) => {
  if (loaded) {
    iframeMainMenu.toggle();
    closeAllIframe([iframeMainMenu]);
  } else {
    iframeMainMenu.show();
  }
};
