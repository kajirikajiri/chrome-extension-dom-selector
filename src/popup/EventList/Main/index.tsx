import { browser } from "webextension-polyfill-ts";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { resetBrowserStorageEvents } from "../../../scripts/resetBrowserStorageEvents";
import { execEvent } from "../../../scripts/execEvent";
import dayjs from "dayjs";
import { Event } from "../../../types/event";
import { useForm } from "react-hook-form";
import { v4 as uuid } from "uuid";
import { EventsList } from "../../EventPlayer/Main/types/eventsList";
import Modal from "react-modal";

interface Req {
  selector?: string;
  index?: number;
  tagName?: string;
}

Modal.setAppElement(document.getElementById("__eventList__"));

export default function Main() {
  const defaultLabel = "labelです";
  const [width, setWidth] = useState(0);
  const [event, setEvent] = useState<Event>();
  const [index, setIndex] = useState<number>();
  const [events, setEvents] = useState<Event[]>([]);
  const [eventsLabel, setEventsLabel] = useState<EventsList["label"]>(
    defaultLabel
  );
  const [isOpen, setIsOpen] = useState(false);
  const { register, handleSubmit } = useForm({ mode: "onBlur" });
  useEffect(() => {
    window.onresize = () => {
      setWidth(window.innerWidth);
    };
    axios.get("https://next-puppeteer-dfsd.herokuapp.com/api/health");
  }, []);

  useEffect(() => {
    browser.storage.local
      .get(["currentEvents", "currentEventsLabel"])
      .then(({ currentEvents, currentEventsLabel }) => {
        if (Array.isArray(currentEvents) && currentEvents.length > 0) {
          setEvents(currentEvents);
        } else if (Array.isArray(currentEvents) && currentEvents.length === 0) {
          setEvents(currentEvents);
        }
        if (currentEventsLabel === "") {
          setEventsLabel(defaultLabel);
        } else {
          setEventsLabel(currentEventsLabel);
        }
      });
  }, [width]);

  useEffect(() => {
    const callback = (req: Req) => {
      if (
        typeof req.selector === "string" &&
        typeof req.index === "number" &&
        typeof req.tagName === "string"
      ) {
        const copy = [...events];
        let label = "クリック";
        let type: "click" | "input" = "click";
        if (req.tagName === "INPUT" || req.tagName === "TEXTAREA") {
          label = "入力";
          type = "input";
        }
        copy.push({
          label,
          selector: req.selector,
          index: req.index,
          action: {
            type,
          },
          uuid: uuid(),
          createdAt: dayjs().format(),
          updatedAt: dayjs().format(),
        });
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

  const handleClick = async (event: Event, hover: boolean) => {
    execEvent(event, hover);
  };

  const handleClickReset = () => {
    resetBrowserStorageEvents();
    setEvents([]);
  };

  const handleClickDelete = async (index) => {
    const result = confirm("削除してよろしいですか");
    if (result) {
      const copyEvents = [...events];
      copyEvents.splice(index, 1);
      setEvents(copyEvents);
      setIsOpen(false);
      await browser.storage.local.set({
        currentEvents: copyEvents,
      });
    }
  };

  const onBlur = ({
    data,
    label,
  }: {
    label: string;
    data: {
      label: string;
      selector: string;
      index: number;
      action: {
        type: "input" | "click";
        inputValue?: string;
      };
    }[];
  }) => {
    const newEvents: Event[] = events.map((event, i) => {
      return {
        ...event,
        ...data[i],
      };
    });
    setEvents(newEvents);
    (async () => {
      await browser.storage.local.set({
        currentEvents: newEvents,
        currentEventsLabel: label,
      });
    })();
  };

  const openModal = (event, index) => {
    setEvent(event);
    setIndex(index);
    setIsOpen(true);
  };

  const renderCurrentEvent = () => {
    return (
      <div>
        <div className="flex justify-between">
          <button onClick={() => setIsOpen(false)}>close modal</button>
          <button onClick={() => handleClickDelete(index)}>🗑️</button>
        </div>
        <form onBlur={handleSubmit(onBlur)}>
          <input
            autoFocus
            name={`data[${index}].selector`}
            defaultValue={event?.selector}
            ref={register}
          />
          <input
            name={`data[${index}].index`}
            defaultValue={event?.index}
            ref={register({
              valueAsNumber: true,
            })}
            type="number"
          />
        </form>
      </div>
    );
  };

  if (width > 0) {
    return (
      <>
        <div>
          <div className="flex">
            <form onBlur={handleSubmit(onBlur)}>
              <input
                className="text-lg"
                name={`label`}
                ref={register}
                defaultValue={eventsLabel}
              />
            </form>
            <button onClick={handleClickReset}>reset events</button>
          </div>
          <Modal isOpen={isOpen} ariaHideApp={false}>
            {renderCurrentEvent()}
          </Modal>
          {events.map((event, i) => {
            return (
              <div key={event.uuid}>
                <form onBlur={handleSubmit(onBlur)}>
                  <div className="flex justify-between">
                    <div>
                      <input
                        name={`data[${i}].label`}
                        ref={register}
                        defaultValue={event.label}
                      />
                      <select
                        name={`data[${i}].action.type`}
                        defaultValue={event.action.type}
                        ref={register}
                      >
                        <option value="click">クリック</option>
                        <option value="input">入力</option>
                      </select>
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={() => handleClick(event, true)}
                      >
                        🔍
                      </button>
                      <button
                        type="button"
                        onClick={() => handleClick(event, false)}
                      >
                        ▶
                      </button>
                      <button type="button" onClick={() => openModal(event, i)}>
                        ⚙️
                      </button>
                    </div>
                  </div>
                  {event.action.type === "input" ? (
                    <div>
                      <input
                        autoFocus
                        name={`data[${i}].action.inputValue`}
                        defaultValue={event.action.inputValue}
                        ref={register}
                      />
                      ┛
                    </div>
                  ) : (
                    <></>
                  )}
                </form>
              </div>
            );
          })}
        </div>
      </>
    );
  }

  return <>a</>;
}
