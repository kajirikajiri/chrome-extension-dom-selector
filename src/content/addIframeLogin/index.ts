import { browser } from "webextension-polyfill-ts";

export const addIframeLogin = (iframe: HTMLIFrameElement) => {
  iframe.style.background = "#fff";
  iframe.style.height = "300px";
  iframe.style.width = "300px";
  iframe.style.boxShadow = "0px 2px 4px rgba(0,0,0,0.4)";
  iframe.style.position = "fixed";
  iframe.style.top = "0px";
  iframe.style.right = "0px";
  iframe.style.zIndex = "2147483646";
  iframe.frameBorder = "none";

  // iframe.src = browser.extension.getURL("login.html");
  // iframe.src = "http://localhost:3000/login"
  iframe.src = 'https://next-puppeteer.vercel.app/login'
  document.body.appendChild(iframe);
};
