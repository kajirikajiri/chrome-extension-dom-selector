import { exec } from '../exec';
import { browser } from "webextension-polyfill-ts"
import { Iframe } from '../../iframes/common';

export const logouted =async(event:MessageEvent, closeAllIframe: (ignoreIframes?: Iframe[])=>void)=>{
  // メッセージ受信時点でログアウトは完了している
  await browser.storage.local.remove(["currentEvents"])
  await browser.storage.local.set({isLogin: false, userUuid: '', })
  exec(event, 'logout success')
  setTimeout(()=> {
    closeAllIframe()
  }, 2000)
}