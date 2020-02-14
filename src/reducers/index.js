import { combineReducers } from 'redux';

// calling the default reducer to create a link
import clickReducer from './click-reducer';
import appWorkflowReducer from './app-workflow-reducer';
import editMeetingReducer from './edit-meeting-reducer';
import activeMeetingReducer from './active-meeting-reducer';
import meetingsReducer from './all-meetings-reducer';
import timerAction from './timer-action-reducer';

const rootReducers = combineReducers({
    // add reducer files references here
    click: clickReducer, 
    appWorkflow: appWorkflowReducer,
    activeMeeting: activeMeetingReducer,
    editMeeting: editMeetingReducer,
    meetings: meetingsReducer,
    timerAction: timerAction,
});

export default rootReducers;