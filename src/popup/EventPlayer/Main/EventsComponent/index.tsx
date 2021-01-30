import React, { FC } from "react";
import { execEvent } from "../../../../scripts/execEvent";
import { Event } from "../../../../types/event";
import { EventsList } from "../types/eventsList";
import { useForm } from "react-hook-form";
import { api } from "../../../../scripts/api";
import { browser } from "webextension-polyfill-ts";
import dayjs from "dayjs";

interface Props {
  eventsLabel: EventsList["label"];
  events: Event[];
  eventsList: EventsList[];
  index: number;
  eventsUuid: string;
  setEventsList: React.Dispatch<React.SetStateAction<EventsList[]>>;
}

export const EventsComponent: FC<Props> = ({
  eventsUuid,
  eventsLabel,
  events,
  eventsList,
  index,
  setEventsList,
}) => {
  const { register, handleSubmit } = useForm({ mode: "onBlur" });
  const handleClick = (event, hover) => {
    execEvent(event, hover);
  };

  const onBlur = ({
    data,
    label,
  }: {
    label: string;
    data: {
      label: string;
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
        updatedAt: dayjs().format(),
      };
    });
    const copyEventsList = [...eventsList];
    copyEventsList.splice(index, 1, {
      ...copyEventsList[index],
      label,
      events: newEvents,
      updatedAt: dayjs().format(),
    });
    browser.storage.local.get(["userUuid"]).then(({ userUuid }) => {
      if (typeof userUuid === "string") {
        api
          .post("domEvent/update", {
            userUuid,
            eventsUuid,
            events: newEvents,
            eventsLabel: label,
            updatedAt: dayjs().format(),
          })
          .then((res) => {
            setEventsList(copyEventsList);
          });
      }
    });
  };

  return (
    <>
      <summary className="flex">
        <form onBlur={handleSubmit(onBlur)}>
          <input
            type="text"
            name={`label`}
            ref={register}
            defaultValue={eventsLabel}
          />
        </form>
      </summary>
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
    </>
  );
};
