import { recorderOn } from '../recorderOn';

export function startRecording(iframe: HTMLIFrameElement) {
  iframe.style.width = "100px";
  iframe.style.height = "100px"
  recorderOn(iframe)
}
