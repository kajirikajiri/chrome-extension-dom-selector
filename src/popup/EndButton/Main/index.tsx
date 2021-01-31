import { browser } from "webextension-polyfill-ts";
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Main() {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    window.onresize = () => {
      setWidth(window.innerWidth);
    };
  }, []);

  const handleClickEnd = async () => {
    const tabs = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    const { success } = await browser.tabs.sendMessage(tabs[0].id, {
      recording: "stop",
    });
  };

  if (width > 0) {
    return (
      <>
        <button
          onClick={handleClickEnd}
          className="w-full h-full flex justify-center items-center"
        >
          <span className="text-4xl">⏹️</span>
        </button>
      </>
    );
  }

  return <></>;
}
