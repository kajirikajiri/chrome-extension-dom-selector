import { Iframe } from "../common";

export class IframeLogout extends Iframe {
  constructor() {
    super();

    this.element.src = "https://next-puppeteer.vercel.app/logout";
  }
}
