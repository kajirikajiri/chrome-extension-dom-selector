import axios, { AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";
import { browser } from "webextension-polyfill-ts";
import "../Popup.scss";
import { v4 as uuid } from "uuid";
import { resetBrowserStorageEvents } from "../../../scripts/resetBrowserStorageEvents";

export default function Popup() {
  const [width, setWidth] = useState(0);
  const [events, setEvents] = useState<{ selector: string; index: number }[]>(
    []
  );
  const [saved, setSaved] = useState(false);
  const [userUuid, setUserUuid] = useState<string>();
  useEffect(() => {
    (async () => {
      const tabs = await browser.tabs.query({
        active: true,
        currentWindow: true,
      });
      const { success } = await browser.tabs.sendMessage(tabs[0].id, {
        loaded: true,
      });
    })();
    window.onresize = () => {
      setWidth(window.innerWidth);
    };
    browser.storage.local.get(["userUuid"]).then(({ userUuid }) => {
      if (typeof userUuid === "string") {
        setUserUuid(userUuid);
      }
    });
  }, []);

  useEffect(() => {
    browser.storage.local.get(["currentEvents"]).then(({ currentEvents }) => {
      if (Array.isArray(currentEvents) && currentEvents.length > 0) {
        setEvents(currentEvents);
      }
    });
  }, [width]);

  useEffect(() => {
    if (Array.isArray(events) && events.length > 0) {
      setSaved(false);
    }
  }, [events]);

  const recordingStart = async () => {
    const tabs = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    const { success } = await browser.tabs.sendMessage(tabs[0].id, {
      recording: "start",
    });
  };

  const saveRecordingData = async () => {
    if (
      typeof userUuid === "string" &&
      Array.isArray(events) &&
      events.length > 0
    ) {
      axios
        .post("http://localhost:4000/api/domEvent/create", {
          events,
          userUuid,
          eventsUuid: uuid(),
          eventsLabel: "sample",
        })
        .then((res) => {
          resetBrowserStorageEvents();
          setEvents([]);
          setSaved(true);
        });
    }
  };

  const showRecordingData = async () => {
    const tabs = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    const { success } = await browser.tabs.sendMessage(tabs[0].id, {
      showRecordingData: true,
    });
  };

  const showLogout = async () => {
    const tabs = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    const { success } = await browser.tabs.sendMessage(tabs[0].id, {
      showLogout: true,
    });
  };

  if (width > 0) {
    return (
      <div className="flex flex-col">
        <button onClick={recordingStart}>start recording</button>
        {events.length > 0 ? (
          <button onClick={saveRecordingData}>save recording data</button>
        ) : (
          <></>
        )}
        {saved ? "saved !!" : ""}
        <button onClick={showRecordingData}>show recording data</button>
        <button onClick={showLogout}>logout</button>
      </div>
    );
  }

  return <></>;
}
