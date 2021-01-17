import { browser } from "webextension-polyfill-ts";
import { dragElement } from "./dragElement";

export const addIframe = (iframe: HTMLIFrameElement) => {

  iframe.style.background = "#fff";
  iframe.style.height = "100%";
  iframe.style.width = "0px";
  iframe.style.boxShadow = "0px 2px 4px rgba(0,0,0,0.4)";
  iframe.style.position = "fixed";
  iframe.style.top = "0px";
  iframe.style.right = "0px";
  iframe.style.zIndex = "2147483646";
  iframe.frameBorder = "none";

  iframe.src = browser.extension.getURL("popup.html");
  document.body.appendChild(iframe);
};
