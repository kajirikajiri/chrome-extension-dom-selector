import React, { useEffect, useState } from "react";
import { browser } from "webextension-polyfill-ts";
import "../Popup.scss";

interface Req {
  selector?: string
  index?: number
}

export default function Popup() {
  const [status, setStatus] = useState<'off'|'recording'|'normal'>('off')
  const [events, setEvents] = useState<{selector:string,index:number}[]>([])
  useEffect(() => {
    (async()=> {
      const tabs = await browser.tabs.query({ active: true, currentWindow: true });
      const {success} = await browser.tabs.sendMessage(tabs[0].id, { loaded: true })
    })()
  }, [status]);

  useEffect(()=>{
    const callback = (req:Req) => {
      if (req.selector && req.index) {
        const copy = [...events]
        copy.push({selector: req.selector, index: req.index})
        setEvents(copy)
      }
      return Promise.resolve({success: true})
    }
    browser.runtime.onMessage.addListener(callback)
    return () => {
      browser.runtime.onMessage.removeListener(callback)
    }
  })

  const recording = async() => {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    const {success} = await browser.tabs.sendMessage(tabs[0].id, { recording: 'start' })

    if (success) {
      setStatus('recording')
    }
  }

  const handleClick= async(selector, index)=>{
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    const {success} = await browser.tabs.sendMessage(tabs[0].id, { selector, index })
  }

  if(status === 'recording') {
    return (
      <>
        <button className="w-full h-full flex justify-center items-center">
          recording now
        </button>
        <ul>
        {events.map((event, i)=>{
          return (
            <li>
              <button onClick={()=>handleClick(event.selector, event.index)}>
                event{i}
              </button>
            </li>
          )
        })}
        </ul>
      </>
    )
  }

  return (
    <div className="popupContainer">
      <button onClick={recording}>start recording</button>
    </div>
  )
}
