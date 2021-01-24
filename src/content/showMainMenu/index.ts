import { browser } from "webextension-polyfill-ts"
import { IframeEventList } from "../iframes/eventList"
import { IframeMainMenu } from "../iframes/mainMenu"

export const showMainMenu = (loaded: boolean, iframeMainMenu: IframeMainMenu)=>{
  if (loaded) {
    iframeMainMenu.toggle()
  } else {
    iframeMainMenu.show()
  }
}