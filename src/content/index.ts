import { browser } from "webextension-polyfill-ts";
import { addIframe } from "./addIframe";
import { toggle } from "./toggle";
import { open } from "./open";
import { startRecording } from "./startRecording";
import { endRecording } from "./endRecording";

interface Req {
  toggle?: true
  recording?: 'start'|'end'
  loaded?: true
  selector?:string
  index?:number
}

(async()=>{
  await browser.runtime.sendMessage({setLoadingIcon: true})
})()

const iframe = document.createElement("iframe");
let loaded = false

window.onload = () => {
  addIframe(iframe);
};

browser.runtime.onMessage.addListener((req:Req) => {
  if (req.toggle) {
    if (loaded) {
      toggle(iframe)
    } else {
      open(iframe)
    }
  } else if (req.recording === 'start') {
    startRecording(iframe)
  } else if (req.recording === 'end') {
    endRecording(iframe)
  } else if (req.loaded) {
    loaded = true
    browser.runtime.sendMessage({setLoadedIcon: true})
  } else if (req.selector && 'index' in req) {
    console.log(`document.querySelectorAll('${req.selector}')[${req.index}]`)
    const el = document.querySelectorAll(req.selector)[req.index]
    el.scrollIntoView({ behavior: "smooth" })
  }

  return Promise.resolve({success: true})
})
