import React from 'react';
import { render } from 'react-dom';
// import { BrowserRouter } from 'react-router-dom';
import App from './App';
import AdminLogin from './components/AdminLogin';
import AdminMain from './components/AdminMain';
import UserLanding from './components/UserLanding';
import PrefSelector from './components/PrefSelector';
//in order to use async await
import '@babel/polyfill';

import './styles/admin.css';

render(<PrefSelector />, document.getElementById('app'));
