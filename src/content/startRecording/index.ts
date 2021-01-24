import { recorderOn } from '../recorderOn';

export function startRecording(iframeMainMenu: HTMLIFrameElement, iframeEndButton: HTMLIFrameElement, iframeEventList: HTMLIFrameElement) {
  iframeEndButton.style.width = "100px";
  iframeEndButton.style.height = "100px"

  iframeMainMenu.style.width = '0px'

  iframeEventList.style.width = '100px'
  iframeEventList.style.height = '500px'

  recorderOn(iframeEndButton)
}
