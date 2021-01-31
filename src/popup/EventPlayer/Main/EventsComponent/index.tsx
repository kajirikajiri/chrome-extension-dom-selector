import React, { FC, useState } from "react";
import { execEvent } from "../../../../scripts/execEvent";
import { Event } from "../../../../types/event";
import { EventsList } from "../types/eventsList";
import { useForm } from "react-hook-form";
import { api } from "../../../../scripts/api";
import { browser } from "webextension-polyfill-ts";
import dayjs from "dayjs";
import Modal from "react-modal";
import { Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { DragDropContext } from "react-beautiful-dnd";

Modal.setAppElement(document.getElementById("__eventPlayer__"));
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
  const [updateEventsUuid, setUpdateEventsUuid] = useState<EventsList[]>([]);
  const [updateIndex, setUpdateIndex] = useState<number>();
  const [isOpen, setIsOpen] = useState(false);

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
      uuid: string;
      label: string;
      action: {
        type: "input" | "click";
        inputValue?: string;
      };
    }[];
  }) => {
    // dndをすると、引数のdataの並び順がバグっている。eventsは正しいのでeventsに並びを合わせる
    const result = events.map(({ uuid }) => {
      return data.filter((a) => {
        return a.uuid === uuid;
      })[0];
    });

    const copyEvents = [...events];
    const newEvents: Event[] = copyEvents.map((event, i) => {
      return {
        ...event,
        ...result[i],
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

  const openModal = (index, eventsUuid) => {
    setUpdateEventsUuid(eventsUuid);
    setUpdateIndex(index);
    setIsOpen(true);
  };

  const handleClickDelete = async () => {
    const result = confirm("削除してよろしいですか");
    if (result) {
      const copyEvents = [...events];
      copyEvents.splice(updateIndex, 1);
      browser.storage.local.get(["userUuid"]).then(({ userUuid }) => {
        if (typeof userUuid === "string") {
          api
            .post("domEvent/update", {
              userUuid,
              eventsUuid,
              eventsLabel,
              events: copyEvents,
              updatedAt: dayjs().format(),
            })
            .then((res) => {
              const copyEventsList = [...eventsList];
              copyEventsList.splice(index, 1, {
                ...copyEventsList[index],
                events: copyEvents,
              });
              setEventsList(copyEventsList);
              setIsOpen(false);
            });
        }
      });
    }
  };

  const onDragEnd = (result: DropResult) => {
    if (result.destination.index === result.source.index) return;

    const copyEvents = [...eventsList[index].events];
    const a = copyEvents.splice(result.source.index, 1);
    copyEvents.splice(result.destination.index, 0, a[0]);
    const copyEventsList = [...eventsList];
    copyEventsList.splice(index, 1, {
      ...copyEventsList[index],
      events: copyEvents,
    });
    setEventsList(copyEventsList);
    browser.storage.local.get(["userUuid"]).then(({ userUuid }) => {
      if (typeof userUuid === "string") {
        api
          .post("domEvent/update", {
            userUuid,
            eventsUuid,
            eventsLabel,
            events: copyEvents,
            updatedAt: dayjs().format(),
          })
          .catch(() => {
            // thenでsetEventsListをすればこの処理は不要だが、thenに入ってくるのが遅く、体験が悪くなるのであまりcatchに入らないという前提でエラーが出たらユーザーがリロードする
            alert(
              "保存に失敗しました。並び順にバグが生じているのでブラウザをリロードしてください"
            );
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
      <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
        <Droppable droppableId={`list${eventsUuid}`}>
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {events.map((event, i) => {
                return (
                  <Draggable
                    key={event.uuid}
                    draggableId={event.uuid}
                    index={i}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <form onBlur={handleSubmit(onBlur)}>
                          <div className="flex">
                            <div className="flex items-center">✋</div>
                            <div>
                              <div className="flex justify-between">
                                <div>
                                  <input
                                    type="hidden"
                                    name={`data[${i}].uuid`}
                                    ref={register}
                                    defaultValue={event.uuid}
                                  />
                                  <input
                                    style={{ width: 90 }}
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
                                  <button
                                    type="button"
                                    onClick={() => openModal(i, eventsUuid)}
                                  >
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
                            </div>
                          </div>
                        </form>
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <Modal isOpen={isOpen} ariaHideApp={false}>
        <button onClick={() => setIsOpen(false)}>close modal</button>
        <button onClick={handleClickDelete}>🗑️</button>
      </Modal>
    </>
  );
};
