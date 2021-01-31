import axios, { AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";
import { browser } from "webextension-polyfill-ts";
import "../Popup.scss";
import { v4 as uuid } from "uuid";
import { resetBrowserStorageEvents } from "../../../scripts/resetBrowserStorageEvents";
import dayjs from "dayjs";
import { getRecordingData } from "../../EventPlayer/Main/getRecordingData";
import { api } from "../../../scripts/api";
import { Event } from "../../../types/event";

export default function Popup() {
  const [width, setWidth] = useState(0);
  const [events, setEvents] = useState<Event[]>([]);
  const [saved, setSaved] = useState(false);
  const [userUuid, setUserUuid] = useState<string>();
  const [hasEventsList, setHasEventsList] = useState(false);
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
    (async () => {
      const res = await getRecordingData();
      if (res.length > 0) {
        setHasEventsList(true);
      }
    })();
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
    const { currentEventsLabel } = await browser.storage.local.get(
      "currentEventsLabel"
    );
    if (
      typeof userUuid === "string" &&
      Array.isArray(events) &&
      events.length > 0
    ) {
      api
        .post("domEvent/create", {
          events,
          userUuid,
          eventsUuid: uuid(),
          eventsLabel: currentEventsLabel,
          createdAt: dayjs().format(),
          updatedAt: dayjs().format(),
        })
        .then((res) => {
          resetBrowserStorageEvents();
          setEvents([]);
          setHasEventsList(true); // 保存に成功したのだからイベントが１つはあると仮定する
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
        <button onClick={recordingStart}>
          {events.length > 0 ? <>recording 再開</> : <>recording 開始</>}
        </button>
        {events.length > 0 ? (
          <button onClick={saveRecordingData}>save recording data</button>
        ) : (
          <></>
        )}
        {saved ? "saved !!" : ""}
        {hasEventsList ? (
          <button onClick={showRecordingData}>show recording data</button>
        ) : (
          <></>
        )}
        <button onClick={showLogout}>logout</button>
      </div>
    );
  }

  return <></>;
}
