import { combineReducers } from 'redux';

// calling the default reducer to create a link
import clickReducer from './click-reducer';
import appWorkflowReducer from './app-workflow-reducer';
import editMeetingReducer from './edit-meeting-reducer';
import activeMeetingReducer from './active-meeting-reducer';
import futureMeetingsReducer from './future-meetings-reducer';
import pastMeetingsReducer from './past-meetings-reducer';
import timerActionReducer from './timer-action-reducer';
import timerStopsReducer from './timer-stops-reducer';
import loginActionReducer from './login-action-reducer';
import saveNoteReducer from './save-note-reducer';

const rootReducers = combineReducers({
    // add reducer files references here
    click: clickReducer, 
    appWorkflow: appWorkflowReducer,
    activeMeeting: activeMeetingReducer,
    editMeeting: editMeetingReducer,
    futureMeetings: futureMeetingsReducer,
    pastMeetings: pastMeetingsReducer,
    timerAction: timerActionReducer,
    timerStops: timerStopsReducer,
    loginAction: loginActionReducer,
    saveNote: saveNoteReducer,
});

export default rootReducers;