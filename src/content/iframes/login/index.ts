import { Iframe } from "../common";

export class IframeLogin extends Iframe {
  constructor() {
    super();

    this.width = "264px";
    this.element.src = process.env.loginUrl;
  }
}
