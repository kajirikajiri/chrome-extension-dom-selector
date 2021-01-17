export function toggle(iframe: HTMLIFrameElement) {
  if (iframe.style.width == "0px") {
    iframe.style.width = "20%";
  } else {
    iframe.style.width = "0px";
  }
}
