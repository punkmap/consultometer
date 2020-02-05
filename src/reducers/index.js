import { combineReducers } from 'redux';

// calling the default reducer to create a link
import clickReducer from './click-reducer';

const rootReducers = combineReducers({
    // add reducer files references here
    click: clickReducer, 
});

export default rootReducers;