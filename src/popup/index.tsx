import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { browser } from 'webextension-polyfill-ts';
import Popup from './Popup';

(async()=>{
  await browser.tabs.query({ active: true, currentWindow: true });
  ReactDOM.render(<Popup />, document.getElementById('popup'));
})()
