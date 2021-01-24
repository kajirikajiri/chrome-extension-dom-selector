import { IframeLogin } from "../iframes/login"

export const showLogin= (loaded: boolean, iframeLogin: IframeLogin)=>{
  if (loaded) {
    iframeLogin.toggle()
  } else {
    iframeLogin.show()
  }
}