import { Iframe } from '../iframes/common';
import { IframeEventPlayer } from '../iframes/eventPlayer';
import { IframeLogin } from '../iframes/login';
import { IframeLogout } from '../iframes/logout';

export function showLogout(closeAllIframe: (ignoreIframes?: Iframe[])=>void, iframeLogout: IframeLogout) {
  iframeLogout.show()
  closeAllIframe([iframeLogout])
}

