import axios from "axios"
import { browser } from "webextension-polyfill-ts"
import { EventsList } from "../types/eventsList"

  export const getRecordingData = async()=>{
    // axios.post('https://next-puppeteer-dfsd.herokuapp.com/api/test').then((res)=>{
    const {currentEvents, userUuid} =  await browser.storage.local.get(['currentEvents', 'userUuid'])
    console.log(currentEvents)
    const res = await axios.get<EventsList[]>('http://localhost:4000/api/domEvent/index', {
      params: {
        userUuid
      }
    }).then(({data})=>{
      console.log(1, data)
      return data
    })
    return res
  }

