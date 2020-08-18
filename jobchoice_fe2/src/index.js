import React from 'react'
import ReactDOM from 'react-dom'
import './index.scss'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import store from './store/config'
import { Provider } from 'react-redux'
import * as serviceWorker from './serviceWorker'
import App from './App'
import 'react-app-polyfill/ie9'

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>, 
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
