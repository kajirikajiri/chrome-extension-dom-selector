import { browser } from "webextension-polyfill-ts";
import React, { useEffect, useState } from "react";
import { getRecordingData } from "./getRecordingData";
import { Event } from "./types/event";
import { EventsList } from "./types/eventsList";
import { execEvents } from "./execEvents";

export default function Main(){
  console.log('player')
  const [width, setWidth] = useState(0)
  const [events, setEvents] = useState<EventsList[]>([])

  useEffect(()=>{
    ;(async()=>{
      const res = await getRecordingData()
      setEvents(res)
    })()
  }, [width])

  useEffect(()=>{
    window.onresize = ()=>{
      setWidth(window.innerWidth)
    }
  }, [])

  const handleClick=(selector, index)=>{
    console.log(selector, index)
  }

  if(width > 0) {
    return (
      <>
        <div>header events list</div>
        <div className="w-full">
        {events.map(({label, events}, i)=>{
          return (
            <div className="flex justify-between">
              <details>
              <summary>{label}</summary>
              {
                events.map(({selector, index})=>{
                return (
                  <div>
                    <button onClick={()=>handleClick(selector, index)}>
                      {index}
                    </button>
                  </div>
                )
                })
              }
              </details>
              <button onClick={()=>execEvents(events)}>▶︎</button>
            </div>
          )
        })}
        </div>
      </>
    )
  }

  return (
    <>aaaa</>
  )
}