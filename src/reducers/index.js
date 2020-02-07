import { combineReducers } from 'redux';

// calling the default reducer to create a link
import clickReducer from './click-reducer';
import addMeetingReducer from './app-workflow-reducer';

const rootReducers = combineReducers({
    // add reducer files references here
    click: clickReducer, 
    addMeeting: addMeetingReducer,
});

export default rootReducers;