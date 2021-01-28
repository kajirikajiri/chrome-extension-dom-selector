import { IframeLogout } from "../../iframes/logout"
import { IframeMainMenu } from "../../iframes/mainMenu"

export const logoutFailed = (iframeLogout:IframeLogout, iframeMainMenu:IframeMainMenu)=>{
  setTimeout(()=>{
    iframeLogout.hide()
    iframeMainMenu.show()
  }, 2000)
}