import { browser } from "webextension-polyfill-ts";
import React, { useEffect, useState } from "react";
import axios from "axios";

interface Req {
  selector?: string
  index?: number
}

interface Event {
selector:string,index:number
}

interface Events {
  label: string, events: Event[]
}

export default function Main(){
  console.log('player')
  const [width, setWidth] = useState(0)
  const [events, setEvents] = useState<Events[]>([])

  const getRecordingData = async()=>{
    // axios.post('https://next-puppeteer-dfsd.herokuapp.com/api/test').then((res)=>{
    const {currentEvents, userUuid} =  await browser.storage.local.get(['currentEvents', 'userUuid'])
    console.log(currentEvents)
    const res = await axios.get<Events[]>('http://localhost:4000/api/domEvent/index', {
      params: {
        userUuid
      }
    }).then(({data})=>{
      console.log(1, data)
      return data
    })
    return res
  }

  useEffect(()=>{
    console.log('use effect innn')
    ;(async()=>{
      console.log('before get')
      const res = await getRecordingData()
      setEvents(res)
      console.log()
      console.log(2, res)
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

  const execEvents = async(events:Event[])=>{
    for await (const {index, selector} of events) {
      const tabs = await browser.tabs.query({ active: true, currentWindow: true });
      const {success} = await browser.tabs.sendMessage(tabs[0].id, { selector, index, quickClick: true })
      const promise = ()=>{
        return new Promise((resolve)=>{
          setTimeout(async()=>{
            resolve('ok')
          }, 500)
        })
      }
      await promise()
    }
  }

  if(width > 0) {
    return (
      <>
        <ul className="w-full">
        {events.map(({label, events}, i)=>{
          return (
            <>
              <button onClick={()=>execEvents(events)}>{label}</button>
              {
                events.map(({selector, index})=>{
                <li>
                  <button onClick={()=>handleClick(selector, index)}>
                    {i}
                  </button>
                </li>
                })
              }
            </>
          )
        })}
        </ul>
      </>
    )
  }

  return (
    <>aaaa</>
  )
}