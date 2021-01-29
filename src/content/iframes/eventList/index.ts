import { browser } from "webextension-polyfill-ts";
import { Iframe } from "../common";

export class IframeEventList extends Iframe {
  constructor() {
    super();

    this.element.style.height = "500px";
    this.element.style.top = "110px";
    this.element.src = browser.extension.getURL("eventList.html");
  }
}
