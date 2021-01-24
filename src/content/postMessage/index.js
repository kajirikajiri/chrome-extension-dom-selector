// typescriptだと、event.source.postMessageのあたりで
import { browser } from 'webextension-polyfill-ts';
export const postMessage = (closeAllIframe, iframeMainMenu, iframeLogin, iframeLogout) => {
  window.addEventListener('message', async(event)=>{
    browser.storage.local.get(['isLogin']).then(async({isLogin})=>{
      const {env} = await browser.storage.local.get('env')
      if (event.origin !== env.receiveLoginOrigin) return;
      if (typeof event.data.userUuid === 'string') {
        browser.storage.local.set({userUuid: event.data.userUuid})
        await browser.storage.local.set({isLogin: true})
        event.source.postMessage('login success', event.origin)
      }else if (event.data.closeLogin === true && event.data.openMainMenu === true) {
        if(iframeLogin.isShow()){
          iframeLogin.hide()
          iframeMainMenu.show()
        }
        event.source.postMessage('toggle success', event.origin)
      }else if(event.data.logouted === true){
        // メッセージ受信時点でログアウトは完了している
        await browser.storage.local.remove(["currentEvents"])
        await browser.storage.local.set({isLogin: false, userUuid: '', })
        event.source.postMessage('logout success', event.origin)
        setTimeout(()=> {
          closeAllIframe()
        }, 2000)
      }else if (event.data.logoutFailed === true) {
        setTimeout(()=>{
          iframeLogout.hide()
          iframeMainMenu.open()
        }, 2000)
      }
    })
  }, false)
}