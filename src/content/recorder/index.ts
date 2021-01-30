import $ from "jquery";
import { browser } from "webextension-polyfill-ts";
import { Iframe } from "../iframes/common";

export class Recorder {
  ignoreIframes: Iframe[];

  constructor(ignoreIframes: Iframe[]) {
    if (ignoreIframes.length !== 2)
      throw Error(
        "手動で除外するエレメントを指定しています。数値を修正して、.not()の後ろに追加してください"
      );
    this.ignoreIframes = ignoreIframes;
  }

  off() {
    $("*")
      .not(this.ignoreIframes[0].element)
      .not(this.ignoreIframes[1].element)
      .off("click");
  }

  on() {
    $("*")
      .not(this.ignoreIframes[0].element)
      .not(this.ignoreIframes[1].element)
      .on("click", function () {
        const originBackgroundStyle = $(this).css("background");
        const originTransitionStyle = $(this).css("transition");
        $(this).css({
          background:
            "linear-gradient(217deg, rgba(255,0,0,.8), rgba(255,0,0,0) 70.71%), linear-gradient(127deg, rgba(0,255,0,.8), rgba(0,255,0,0) 70.71%), linear-gradient(336deg, rgba(0,0,255,.8), rgba(0,0,255,0) 70.71%)",
          transition: "1.0s",
        });
        setTimeout(() => {
          $(this).css({
            background: originBackgroundStyle,
            transition: originTransitionStyle,
          });
        }, 1000);
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

        browser.runtime.sendMessage({ selector, index, tagName: this.tagName });
        return false;
      });
  }
}
