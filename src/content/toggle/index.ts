export function toggle(iframeMainMenu: HTMLIFrameElement, iframeLogin:HTMLIFrameElement) {
  if (iframeMainMenu.style.width == "0px") {
    iframeMainMenu.style.width = "20%";
  } else {
    iframeMainMenu.style.width = "0px";
  }
  iframeLogin.style.width = "0px"
}
