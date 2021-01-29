import { Iframe } from "../common";

export class IframeLogin extends Iframe {
  constructor() {
    super();

    this.width = "264px";
    // iframe.src = browser.extension.getURL("login.html");
    // iframe.src = "http://localhost:3000/login"
    this.element.src = "https://next-puppeteer.vercel.app/login";
  }
}
