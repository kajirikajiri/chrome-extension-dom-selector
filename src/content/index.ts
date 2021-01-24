import { browser } from "webextension-polyfill-ts";
import { addIframeMainMenu } from "./addIframeMainMenu";
import {addIframeEventList} from './addIframeEventList'
import {addIframeEndButton} from './addIframeEndButton'
import { toggle } from "./toggle";
import { open } from "./open";
import { startRecording } from "./startRecording";
import { endRecording } from "./endRecording";
import { addIframeLogin } from "./addIframeLogin";
import { addIframeListenLogin } from "./addIframeListenLogin";
import {postMessage} from './postMessage'
import { addIframeEventPlayer } from "./addIframeEventPlayer";
import {showRecordingData} from './showRecordingData'

interface Req {
  toggle?: true
  recording?: 'start'|'end'
  loaded?: true
  selector?:string
  index?:number
  loginSuccess?:true
  showRecordingData?:true
  quickClick?:true
}

(async()=>{
  await browser.runtime.sendMessage({setLoadingIcon: true})
  await browser.storage.local.set({isLogin: false, loaded: false})
})()

const iframeMainMenu = document.createElement("iframe");
const iframeEndButton = document.createElement("iframe");
const iframeEventList = document.createElement("iframe");
const iframeLogin = document.createElement("iframe");
const iframeListenLogin = document.createElement("iframe");
const iframeEventPlayer = document.createElement("iframe");

window.onload = () => {
  addIframeMainMenu(iframeMainMenu);
  addIframeEndButton(iframeEndButton);
  addIframeEventList(iframeEventList);
  addIframeLogin(iframeLogin);
  addIframeListenLogin(iframeListenLogin);
  addIframeEventPlayer(iframeEventPlayer);
};

browser.runtime.onMessage.addListener((req:Req) => {
  const res = browser.storage.local.get(['isLogin', 'loaded']).then(({isLogin, loaded})=>{
    if (req.loaded === true) {
      const res = browser.storage.local.set({loaded: true}).then(()=>{
        const res = browser.runtime.sendMessage({setLoadedIcon: true}).then(()=>{
          return Promise.resolve({success: true})
        })
        return res
      })
      return res
    } else if (isLogin === false || typeof isLogin === 'undefined') {
      if (req.loginSuccess) {
        const res = browser.storage.local.set({isLogin: true}).then(()=>{
          return Promise.resolve({success: true, isLoginStatus: true})
        })
        return res
      }
    } else if (req.toggle) {
      if (loaded) {
        toggle(iframeMainMenu, iframeLogin)
      } else {
        open(iframeMainMenu, iframeLogin)
      }
      return Promise.resolve({success: true})
    } else if (req.recording === 'start') {
      startRecording(iframeMainMenu, iframeEndButton, iframeEventList)
      return Promise.resolve({success: true})
    } else if (req.recording === 'end') {
      endRecording(iframeMainMenu, iframeEndButton, iframeEventList)
      return Promise.resolve({success: true})
    } else if (req.selector && 'index' in req && req.quickClick === true) {
      console.log(`document.querySelectorAll('${req.selector}')[${req.index}]`)
      const el = document.querySelectorAll(req.selector)[req.index]
      el.scrollIntoView()
      return Promise.resolve({success: true})
    } else if (req.selector && 'index' in req) {
      console.log(`document.querySelectorAll('${req.selector}')[${req.index}]`)
      const el = document.querySelectorAll(req.selector)[req.index]
      el.scrollIntoView({ behavior: "smooth" })
      return Promise.resolve({success: true})
    } else if (req.showRecordingData === true) {
      showRecordingData(iframeMainMenu, iframeEventList, iframeEventPlayer)
      return Promise.resolve({success: true})
    }
  })
  return res
})

postMessage(iframeMainMenu, iframeLogin)