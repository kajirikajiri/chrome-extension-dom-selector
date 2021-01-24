import { browser } from "webextension-polyfill-ts";
import React, { useEffect, useState } from "react";
import axios from "axios";

interface Req {
  selector?: string
  index?: number
}

export default function Main(){
  const [width, setWidth] = useState(0)
  const [events, setEvents] = useState<{selector:string,index:number}[]>([])
  useEffect(()=>{
    window.onresize = ()=>{
      setWidth(window.innerWidth)
    }
    axios.get('https://next-puppeteer-dfsd.herokuapp.com/api/health').then((res)=>{
      console.log(res)
    })
  }, [])

  useEffect(()=>{
    const callback = (req:Req) => {
      if (typeof req.selector === 'string' && typeof req.index === 'number') {
        const copy = [...events]
        copy.push({selector: req.selector, index: req.index})
        setEvents(copy)
        ;(async()=>{
          await browser.storage.local.set({currentEvents: copy})
        })()
      }
      return Promise.resolve({success: true})
    }
    browser.runtime.onMessage.addListener(callback)
    return () => {
      browser.runtime.onMessage.removeListener(callback)
    }
  }, [events])

  const handleClick= async(selector, index)=>{
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    const {success} = await browser.tabs.sendMessage(tabs[0].id, { selector, index })
  }

  if(width > 0) {
    return (
      <>
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
    <></>
  )
}