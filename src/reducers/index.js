import { combineReducers } from 'redux';

// calling the default reducer to create a link
import clickReducer from './click-reducer';
import appWorkflowReducer from './app-workflow-reducer';
import editMeetingReducer from './edit-meeting-reducer';

const rootReducers = combineReducers({
    // add reducer files references here
    click: clickReducer, 
    appWorkflow: appWorkflowReducer,
    editMeeting: editMeetingReducer,
});

export default rootReducers;