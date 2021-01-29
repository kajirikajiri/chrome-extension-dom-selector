import { browser } from "webextension-polyfill-ts";
import { api } from "../../../../scripts/api";
import { EventsList } from "../types/eventsList";

export const getRecordingData = async () => {
  // axios.post('https://next-puppeteer-dfsd.herokuapp.com/api/test').then((res)=>{
  const { currentEvents, userUuid } = await browser.storage.local.get([
    "currentEvents",
    "userUuid",
  ]);
  const res = await api
    .get<EventsList[]>("domEvent/index", {
      params: {
        userUuid,
      },
    })
    .then(({ data }) => {
      return data;
    });
  return res;
};
