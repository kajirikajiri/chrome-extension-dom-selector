import { Iframe } from "../common";

export class IframeLogout extends Iframe {
  constructor() {
    super();

    this.element.src = process.env.logoutUrl;
  }
}
