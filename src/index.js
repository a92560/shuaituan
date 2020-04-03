import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {Provider} from 'react-redux'
import MHeader from './components/header/header.jsx'
import MFooter from './components/footer/footer.jsx'
import store from './redux/store'
import 'element-theme-default';
import './assets/css/index.css'
import './utils/axios-catch'
import {
    HashRouter,
    Route,
    Switch
} from "react-router-dom";
import Login from "./containers/login/login";
import Register from "./containers/register/register";

ReactDOM.render(
    <Provider store={store}>
        <HashRouter>
            <Switch>
                <Route path="/login" component={Login}/>
                <Route path="/register" component={Register}/>
                <Route render={ () => (
                    <div>
                        <MHeader/>
                        <App/>
                        <MFooter/>
                    </div>
                )}/>
            </Switch>
        </HashRouter>
    </Provider>
    , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
