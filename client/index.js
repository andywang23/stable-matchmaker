import React from 'react';
import { render } from 'react-dom';
import App from './App';

//in order to use async await
import '@babel/polyfill';
import { BrowserRouter } from 'react-router-dom';

import './styles/admin.css';

render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('app')
);
