import { exec } from '../exec';
import { browser } from "webextension-polyfill-ts"

export const uuidIsString = async(event:MessageEvent) =>{
  browser.storage.local.set({userUuid: event.data.userUuid})
  await browser.storage.local.set({isLogin: true})
  exec(event, 'login success')
}