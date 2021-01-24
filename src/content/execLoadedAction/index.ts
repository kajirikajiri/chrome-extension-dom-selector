import { browser } from "webextension-polyfill-ts"

export const execLoadedAction =async()=>{
  const res = browser.storage.local.set({loaded: true}).then(()=>{
    const res = browser.runtime.sendMessage({setLoadedIcon: true}).then(()=>{
      return Promise.resolve({success: true})
    })
    return res
  })
  return res
}