import React, { useEffect, useState } from "react";
import { getRecordingData } from "./getRecordingData";
import { EventsList } from "./types/eventsList";
import { execEvents } from "./execEvents";
import { EventsComponent } from "./EventsComponent";
import Modal from "react-modal";
import { browser } from "webextension-polyfill-ts";
import { api } from "../../../scripts/api";
import dayjs from "dayjs";
import { v4 as uuid } from "uuid";

Modal.setAppElement(document.getElementById("__eventPlayer__"));

export default function Main() {
  const [width, setWidth] = useState(0);
  const [eventsList, setEventsList] = useState<EventsList[]>([]);
  const [archiveEventsUuid, setArchiveEventsUuid] = useState<EventsList[]>([]);
  const [archiveIndex, setArchiveIndex] = useState<number>();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await getRecordingData();
      setEventsList(res);
    })();
  }, [width]);

  useEffect(() => {
    window.onresize = () => {
      setWidth(window.innerWidth);
    };
  }, []);

  const handleClick = (events) => {
    execEvents(events);
  };

  const openModal = (index, eventsUuid) => {
    setArchiveEventsUuid(eventsUuid);
    setArchiveIndex(index);
    setIsOpen(true);
  };

  const handleClickDelete = async () => {
    const result = confirm("削除してよろしいですか");
    if (result) {
      browser.storage.local.get(["userUuid"]).then(({ userUuid }) => {
        if (typeof userUuid === "string") {
          api
            .post("domEvent/archive", {
              userUuid,
              eventsUuid: archiveEventsUuid,
              updatedAt: dayjs().format(),
            })
            .then((res) => {
              const copyEventsList = [...eventsList];
              copyEventsList.splice(archiveIndex, 1);
              setEventsList(copyEventsList);
              setIsOpen(false);
            });
        }
      });
    }
  };

  const handleClickAdd = async () => {
    const copyEvents = [...eventsList[archiveIndex].events];
    copyEvents.push({
      action: { type: "click" },
      createdAt: dayjs().format(),
      index: 0,
      label: "追加",
      selector: "",
      updatedAt: dayjs().format(),
      uuid: uuid(),
    });
    browser.storage.local.get(["userUuid"]).then(({ userUuid }) => {
      if (typeof userUuid === "string") {
        api
          .post("domEvent/update", {
            ...eventsList[archiveIndex],
            userUuid,
            events: copyEvents,
            eventsLabel: eventsList[archiveIndex].label,
            updatedAt: dayjs().format(),
          })
          .then((res) => {
            const copyEventsList = [...eventsList];
            copyEventsList.splice(archiveIndex, 1, {
              ...copyEventsList[archiveIndex],
              events: copyEvents,
            });
            setEventsList(copyEventsList);
            setIsOpen(false);
          });
      }
    });
  };

  if (width > 0) {
    return (
      <>
        <div>header events player</div>
        <div className="w-full">
          <Modal isOpen={isOpen} ariaHideApp={false}>
            <button onClick={() => setIsOpen(false)}>close modal</button>
            <button onClick={handleClickDelete}>🗑️</button>
            <button onClick={handleClickAdd}>➕</button>
          </Modal>
          {eventsList.map(({ label, events, eventsUuid }, i) => {
            return (
              <div key={eventsUuid} className="flex justify-between">
                <details>
                  <EventsComponent
                    eventsUuid={eventsUuid}
                    eventsLabel={label}
                    events={events}
                    eventsList={eventsList}
                    index={i}
                    setEventsList={setEventsList}
                  />
                </details>
                <button type="button" onClick={() => handleClick(events)}>
                  ▶︎
                </button>
                <button type="button" onClick={() => openModal(i, eventsUuid)}>
                  ⚙️
                </button>
              </div>
            );
          })}
        </div>
      </>
    );
  }

  return <>aaaa</>;
}
