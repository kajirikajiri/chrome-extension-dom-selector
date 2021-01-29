import { browser } from "webextension-polyfill-ts";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { resetBrowserStorageEvents } from "../../../scripts/resetBrowserStorageEvents";
import { execEvent } from "../../../scripts/execEvent";

interface Req {
  selector?: string;
  index?: number;
}

export default function Main() {
  const [width, setWidth] = useState(0);
  const [events, setEvents] = useState<{ selector: string; index: number }[]>(
    []
  );
  useEffect(() => {
    window.onresize = () => {
      setWidth(window.innerWidth);
    };
    axios
      .get("https://next-puppeteer-dfsd.herokuapp.com/api/health")
      .then((res) => {
        console.log(res);
      });
  }, []);

  useEffect(() => {
    browser.storage.local.get(["currentEvents"]).then(({ currentEvents }) => {
      if (Array.isArray(currentEvents) && currentEvents.length > 0) {
        setEvents(currentEvents);
      } else if (Array.isArray(currentEvents) && currentEvents.length === 0) {
        setEvents(currentEvents);
      }
    });
  }, [width]);

  useEffect(() => {
    const callback = (req: Req) => {
      if (typeof req.selector === "string" && typeof req.index === "number") {
        const copy = [...events];
        copy.push({ selector: req.selector, index: req.index });
        setEvents(copy);
        (async () => {
          await browser.storage.local.set({ currentEvents: copy });
        })();
      }
      return Promise.resolve({ success: true });
    };
    browser.runtime.onMessage.addListener(callback);
    return () => {
      browser.runtime.onMessage.removeListener(callback);
    };
  }, [events]);

  const handleClick = async (selector, index) => {
    execEvent(selector, index);
  };

  const handleClickReset = () => {
    resetBrowserStorageEvents();
    setEvents([]);
  };

  if (width > 0) {
    return (
      <>
        <ul>
          {events.map((event, i) => {
            return (
              <li>
                <button
                  onClick={() => handleClick(event.selector, event.index)}
                >
                  event{i}
                </button>
              </li>
            );
          })}
        </ul>
        <button className="fixed bottom-0" onClick={handleClickReset}>
          reset events
        </button>
      </>
    );
  }

  return <></>;
}
