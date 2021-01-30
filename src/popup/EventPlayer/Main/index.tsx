import React, { useEffect, useState } from "react";
import { getRecordingData } from "./getRecordingData";
import { EventsList } from "./types/eventsList";
import { execEvents } from "./execEvents";
import { EventsComponent } from "./EventsComponent";

export default function Main() {
  const [width, setWidth] = useState(0);
  const [eventsList, setEventsList] = useState<EventsList[]>([]);

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

  if (width > 0) {
    return (
      <>
        <div>header events player</div>
        <div className="w-full">
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
              </div>
            );
          })}
        </div>
      </>
    );
  }

  return <>aaaa</>;
}
