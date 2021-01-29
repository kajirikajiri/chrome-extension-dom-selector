import { browser } from "webextension-polyfill-ts";
import { Iframe } from "../common";

export class IframeEndButton extends Iframe {
  constructor() {
    super();

    this.width = "100px";
    this.element.style.height = "100px";
    this.element.src = browser.extension.getURL("endButton.html");
  }
}
