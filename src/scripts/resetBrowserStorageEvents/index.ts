import { browser } from "webextension-polyfill-ts"

export const resetBrowserStorageEvents = ()=>{
  browser.storage.local.set({currentEvents: []})
}