export function endRecording(iframeMainMenu: HTMLIFrameElement, iframeEndButton: HTMLIFrameElement, iframeEventList: HTMLIFrameElement) {
  iframeMainMenu.style.width = "20%";
  iframeMainMenu.style.height = "100px";

  iframeEndButton.style.width = '0px'

  iframeEventList.style.width = '0px'
}
