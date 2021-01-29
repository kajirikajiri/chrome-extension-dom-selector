import { Iframe } from "../iframes/common";
import { IframeMainMenu } from "../iframes/mainMenu";
import { Recorder } from "../recorder";
export function endRecording(
  closeAllIframe: (ignoreIframes?: Iframe[]) => void,
  recorder: Recorder,
  iframeMainMenu: IframeMainMenu
) {
  recorder.off();
  iframeMainMenu.show();
  closeAllIframe([iframeMainMenu]);
}
