import { IframeLogin } from "../../iframes/login";
import { IframeMainMenu } from "../../iframes/mainMenu";
import { exec } from "../exec";

export const closeLoginAndopenMainMenu = (
  event: MessageEvent,
  iframeLogin: IframeLogin,
  iframeMainMenu: IframeMainMenu
) => {
  if (iframeLogin.isShow()) {
    iframeLogin.hide();
    iframeMainMenu.show();
  }
  exec(event, "toggle success");
};
