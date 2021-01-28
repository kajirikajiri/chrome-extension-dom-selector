import { browser } from "webextension-polyfill-ts";
import { Event } from "../types/event";

  export const execEvents = async(events:Event[])=>{
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
