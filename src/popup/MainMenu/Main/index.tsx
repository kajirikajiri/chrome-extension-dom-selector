import axios, { AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";
import { browser } from "webextension-polyfill-ts";
import "../Popup.scss";
import {v4 as uuid} from 'uuid'

export default function Popup() {
  const [width, setWidth] = useState(0)
  useEffect(()=>{
    (async()=>{
      const tabs = await browser.tabs.query({ active: true, currentWindow: true });
      const {success} = await browser.tabs.sendMessage(tabs[0].id, { loaded: true })
    })()
    window.onresize = ()=>{
      setWidth(window.innerWidth)
    }
  }, [])

  const recordingStart = async() => {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    const {success} = await browser.tabs.sendMessage(tabs[0].id, { recording: 'start' })
  }

  const saveRecordingData = async()=>{
    // axios.post('https://next-puppeteer-dfsd.herokuapp.com/api/test').then((res)=>{
    const {currentEvents, userUuid} =  await browser.storage.local.get(['currentEvents', 'userUuid'])
    console.log(currentEvents)
    axios.post('http://localhost:4000/api/domEvent/create', {
      eventsUuid: uuid(),
      userUuid,
      events: currentEvents,
      eventsLabel: 'sample'
    }).then((res)=>{
      console.log(res)
    })
    browser.storage.local.set({currentEvents: undefined})
  }

  const showRecordingData = async()=>{
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    const {success} = await browser.tabs.sendMessage(tabs[0].id, { showRecordingData: true })
    // axios.post('https://next-puppeteer-dfsd.herokuapp.com/api/test').then((res)=>{
    // const {currentEvents, userUuid} =  await browser.storage.local.get(['currentEvents', 'userUuid'])
    // console.log(currentEvents)
    // axios.get('http://localhost:4000/api/domEvent/index', {
    //   params: {
    //     userUuid
    //   }
    // }).then((res)=>{
    //   console.log(res)
    // })
  }

  if(width > 0) {
    return (
      <div className="flex flex-col">
        <button onClick={recordingStart}>start recording</button>
        <button onClick={saveRecordingData}>save recording data</button>
        <button onClick={showRecordingData}>show recording data</button>
      </div>
    )
  }

  return (
    <></>
  )
}
