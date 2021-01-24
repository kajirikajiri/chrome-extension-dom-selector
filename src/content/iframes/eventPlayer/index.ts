import { browser } from "webextension-polyfill-ts";
import { Iframe } from "../common";

export class IframeEventPlayer extends Iframe {
  constructor () {
    super()

    this.element.style.height = "500px";
    this.element.style.top = "250px";
    this.element.src = browser.extension.getURL("eventPlayer.html");
  }
}