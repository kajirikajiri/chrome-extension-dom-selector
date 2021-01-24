import { browser } from "webextension-polyfill-ts"

export const execSetLogin=()=>{
  const res = browser.storage.local.set({isLogin: true}).then(()=>{
    return Promise.resolve({success: true, isLoginStatus: true})
  })
  return res
}
