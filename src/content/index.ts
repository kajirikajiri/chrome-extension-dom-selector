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
import { Recorder } from "./recorder";
import { Event } from "../types/event";

interface Req {
  toggle?: true;
  recording?: "start" | "stop";
  loaded?: true;
  event?: Event;
  hover?: true;
  loginSuccess?: true;
  showRecordingData?: true;
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

const recorder = new Recorder([iframeEndButton, iframeEventList]);

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
        showMainMenu(closeAllIframe, loaded, iframeMainMenu);
        return Promise.resolve({ success: true });
      } else if (isLogin === false || typeof isLogin === "undefined") {
        if (req.loginSuccess === true) {
          const res = execSetLogin();
          return res;
        }
      } else if (req.recording === "start") {
        startRecording(
          closeAllIframe,
          recorder,
          iframeEndButton,
          iframeEventList
        );
        return Promise.resolve({ success: true });
      } else if (req.recording === "stop") {
        endRecording(closeAllIframe, recorder, iframeMainMenu);
        return Promise.resolve({ success: true });
      } else if ("event" in req && req.hover === true) {
        const el = <HTMLElement>(
          document.querySelectorAll(req.event.selector)[req.event.index]
        );
        el.scrollIntoView();
        const originBackground = el.style.background;
        const originTransition = el.style.transition;
        el.style.background =
          "linear-gradient(217deg, rgba(255,0,0,.8), rgba(255,0,0,0) 70.71%), linear-gradient(127deg, rgba(0,255,0,.8), rgba(0,255,0,0) 70.71%), linear-gradient(336deg, rgba(0,0,255,.8), rgba(0,0,255,0) 70.71%)";
        el.style.transition = "1.0s";
        setTimeout(() => {
          el.style.background = originBackground;
          el.style.transition = originTransition;
        }, 1000);
        return Promise.resolve({ success: true });
      } else if ("event" in req) {
        recorder.off();
        if (req.event.action.type === "click") {
          const el = <HTMLElement>(
            document.querySelectorAll(req.event.selector)[req.event.index]
          );
          const evt = document.createEvent("MouseEvents");
          evt.initMouseEvent(
            "click",
            true,
            false,
            window,
            0,
            0,
            0,
            0,
            0,
            false,
            false,
            false,
            false,
            0,
            null
          );
          el.dispatchEvent(evt);
        } else if (req.event.action.type === "input") {
          const el = <HTMLInputElement>(
            document.querySelectorAll(req.event.selector)[req.event.index]
          );
          el.value = req.event.action.inputValue;
          const event = new Event("input");
          el.scrollIntoView();
          el.dispatchEvent(event);
        }
        recorder.on();
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
