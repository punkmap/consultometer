
import {createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
//import logger from 'redux-logger';
import ReduxPromise from 'redux-promise';


const initialState = {};
//const middleware = [thunk, logger, ReduxPromise];
const middleware = [thunk, ReduxPromise];
const store = createStore(
    rootReducer, 
    initialState, 
    compose(
        applyMiddleware(...middleware),
            //turn on redux devtools
            //window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()    
        )
    );

export default store;