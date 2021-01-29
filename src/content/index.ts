import { browser } from "webextension-polyfill-ts";
import { startRecording } from "./startRecording";
import { endRecording } from "./endRecording";
import { postMessage } from "./postMessage";
import { IframeLogin } from "./iframes/login";
import { IframeMainMenu } from "./iframes/mainMenu";
import { IframeLogout } from "./iframes/logout";
import { IframeEndButton } from "./iframes/endButton";
import { IframeEventList } from "./iframes/eventList";
import { IframeEventPlayer } from "./iframes/eventPlayer";
import { Iframe } from "./iframes/common";
import { showRecordingData } from "./showRecordingData";
import { showLogout } from "./showLogout";
import { execSmoothScroll } from "./execSmoothScroll";
import { execLoadedAction } from "./execLoadedAction";
import { showLogin } from "./showLogin";
import { showMainMenu } from "./showMainMenu";
import { execSetLogin } from "./execSetLogin";

interface Req {
  toggle?: true;
  recording?: "start" | "end";
  loaded?: true;
  selector?: string;
  index?: number;
  loginSuccess?: true;
  showRecordingData?: true;
  quickClick?: true;
  showLogout?: true;
}

(async () => {
  await browser.runtime.sendMessage({ setLoadingIcon: true });
  await browser.storage.local.set({ isLogin: false, loaded: false });
})();

const iframeMainMenu = new IframeMainMenu();
const iframeEndButton = new IframeEndButton();
const iframeEventList = new IframeEventList();
const iframeLogin = new IframeLogin();
const iframeLogout = new IframeLogout();
const iframeEventPlayer = new IframeEventPlayer();
const allIframe = [
  iframeMainMenu,
  iframeEndButton,
  iframeEventList,
  iframeLogin,
  iframeLogout,
  iframeEventPlayer,
];

const closeAllIframe = (ignoreIframes?: Iframe[]) => {
  if (typeof ignoreIframes === "undefined") {
    allIframe.forEach((iframe) => {
      iframe.hide();
    });
  } else {
    allIframe.forEach((iframe) => {
      if (!ignoreIframes.includes(iframe)) {
        iframe.hide();
      }
    });
  }
};

window.onload = () => {
  iframeMainMenu.appendChild();
  iframeEndButton.appendChild();
  iframeEventList.appendChild();
  iframeLogin.appendChild();
  iframeLogout.appendChild();
  iframeEventPlayer.appendChild();
};

browser.runtime.onMessage.addListener((req: Req) => {
  const res = browser.storage.local
    .get(["isLogin", "loaded"])
    .then(({ isLogin, loaded }) => {
      if (req.loaded === true) {
        const res = execLoadedAction();
        return res;
      } else if (isLogin === false && req.toggle === true) {
        showLogin(loaded, iframeLogin);
        return Promise.resolve({ success: true });
      } else if (isLogin === true && req.toggle === true) {
        showMainMenu(loaded, iframeMainMenu);
        return Promise.resolve({ success: true });
      } else if (isLogin === false || typeof isLogin === "undefined") {
        if (req.loginSuccess === true) {
          const res = execSetLogin();
          return res;
        }
      } else if (req.recording === "start") {
        startRecording(closeAllIframe, iframeEndButton, iframeEventList);
        return Promise.resolve({ success: true });
      } else if (req.recording === "end") {
        endRecording(closeAllIframe, iframeMainMenu);
        return Promise.resolve({ success: true });
      } else if (req.selector && "index" in req && req.quickClick === true) {
        execSmoothScroll(req.selector, req.index);
        return Promise.resolve({ success: true });
      } else if (req.selector && "index" in req) {
        const el = document.querySelectorAll(req.selector)[req.index];
        el.scrollIntoView({ behavior: "smooth" });
        return Promise.resolve({ success: true });
      } else if (req.showRecordingData === true) {
        showRecordingData(closeAllIframe, iframeEventPlayer, iframeMainMenu);
        return Promise.resolve({ success: true });
      } else if (req.showLogout === true) {
        showLogout(closeAllIframe, iframeLogout);
        return Promise.resolve({ success: true });
      }
    });
  return res;
});

postMessage(closeAllIframe, iframeMainMenu, iframeLogin, iframeLogout);
