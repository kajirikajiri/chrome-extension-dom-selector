import { browser } from "webextension-polyfill-ts";

export const env = async():Promise<{receiveOrigin: string}>=>{
  const a = await browser.management.get('jhildnafefadjmkaodnlooikgokogkld').then(({installType: i})=>{
    if (i === 'development') {
      return {
        // receiveLoginOrigin: 'http://localhost:3000'
        receiveLoginOrigin: 'https://next-puppeteer.vercel.app'
      }
    } else if (i === 'normal' || i === 'other' || i === 'sideload') {
      return {
        receiveLoginOrigin: 'https://next-puppeteer.vercel.app'
      }
    }
  }).catch(e=>e)
  return a
}