import $ from "jquery";
import { browser } from "webextension-polyfill-ts";
import { IframeEndButton } from "../iframes/endButton";
import { IframeEventList } from "../iframes/eventList";

export const recorderOn = (
  iframeEndButton: IframeEndButton,
  iframeEventList: IframeEventList
) => {
  $("*")
    .not(iframeEndButton.element)
    .not(iframeEventList.element)
    .on("click", function () {
      let selector = $(this)
        .parents()
        .map(function () {
          return this.tagName;
        })
        .get()
        .reverse()
        .concat([this.nodeName])
        .join(">");

      const id = $(this).attr("id");
      if (id) {
        selector += "#" + id;
      }

      const classNames = $(this).attr("class");
      if (classNames) {
        selector += "." + $.trim(classNames).replace(/\s/gi, ".");
      }

      const ss = document.querySelectorAll(selector);
      let index = 0;
      if (ss.length > 1) {
        ss.forEach((s, i) => {
          if (s === this) {
            index = i;
          }
        });
      }

      browser.runtime.sendMessage({ selector, index });
      return false;
    });
};
