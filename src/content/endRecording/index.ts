import { Iframe } from "../iframes/common";
import { IframeMainMenu } from "../iframes/mainMenu";
export function endRecording(
  closeAllIframe: (ignoreIframes?: Iframe[]) => void,
  iframeMainMenu: IframeMainMenu
) {
  iframeMainMenu.show();
  closeAllIframe([iframeMainMenu]);
}
