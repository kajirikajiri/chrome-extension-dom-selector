import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { browser } from 'webextension-polyfill-ts';
import Main from './Main';
import './styles.scss'

(async()=>{
  await browser.tabs.query({ active: true, currentWindow: true });
  ReactDOM.render(<Main />, document.getElementById('__eventPlayer__'));
})()
