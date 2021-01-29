import { Iframe } from "../iframes/common";
import { IframeEventPlayer } from "../iframes/eventPlayer";
import { IframeMainMenu } from "../iframes/mainMenu";

export function showRecordingData(
  closeAllIframe: (ignoreIframes?: Iframe[]) => void,
  iframeEventPlayer: IframeEventPlayer,
  iframeMainMenu: IframeMainMenu
) {
  iframeEventPlayer.show();
  iframeMainMenu.show();
  closeAllIframe([iframeEventPlayer, iframeMainMenu]);
}
