import { toggle } from "../toggle";
// event.source.postMessageのあたりでtsだとエラー発生する
import { browser } from 'webextension-polyfill-ts';
export const postMessage = (iframeMainMenu, iframeLogin) => {
  window.addEventListener('message', async(event)=>{
    const {env} = await browser.storage.local.get('env')
    if (event.origin !== env.receiveLoginOrigin) return;
    if (typeof event.data.userUuid === 'string') {
      browser.storage.local.set({userUuid: event.data.userUuid})
      await browser.storage.local.set({isLogin: true})
      event.source.postMessage('login success', event.origin)
    }else if (event.data.toggle === true) {
      toggle(iframeMainMenu, iframeLogin)
    }
  }, false)
}