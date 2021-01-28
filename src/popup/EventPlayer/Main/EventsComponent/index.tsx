import React, { FC } from "react";
import { execEvent } from "../../../../scripts/execEvent";
import { Event } from "../types/event";

interface Props {
  events: Event[]
}

export const EventsComponent:FC<Props>=({events})=>{

  const handleClick=(selector, index)=>{
    execEvent(selector, index)
  }

  return (
    <>
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
  </>
  )
}
