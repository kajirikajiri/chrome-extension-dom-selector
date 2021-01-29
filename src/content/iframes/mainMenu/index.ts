import { browser } from "webextension-polyfill-ts";
import { Iframe } from "../common";

export class IframeMainMenu extends Iframe {
  constructor() {
    super();

    this.width = "250px";
    this.element.src = browser.extension.getURL("mainMenu.html");
  }
}
