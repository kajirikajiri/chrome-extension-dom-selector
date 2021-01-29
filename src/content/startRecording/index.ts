import { Iframe } from "../iframes/common";
import { IframeEndButton } from "../iframes/endButton";
import { IframeEventList } from "../iframes/eventList";
import { Recorder } from "../recorder";

export function startRecording(
  closeAllIframe: (ignoreIframes?: Iframe[]) => void,
  recorder: Recorder,
  iframeEndButton: IframeEndButton,
  iframeEventList: IframeEventList
) {
  iframeEndButton.show();
  iframeEventList.show({ top: "110px", right: "0px" });
  closeAllIframe([iframeEndButton, iframeEventList]);

  recorder.on();
}
