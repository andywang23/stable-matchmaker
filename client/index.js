import React from 'react';
import { render } from 'react-dom';
// import { BrowserRouter } from 'react-router-dom';
import App from './App';
import AdminLogin from './components/AdminLogin';
import AdminMain from './components/AdminMain';
//in order to use async await
import '@babel/polyfill';

import './styles/admin.css';

render(<AdminLogin />, document.getElementById('app'));
