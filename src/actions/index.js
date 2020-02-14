import { INCREMENT, APP_WORKFLOW, ACTIVE_MEETING, EDIT_MEETING, ALL_MEETINGS, TIMER_ACTION } from '../actions/types';


export const increment = (count) => {
    return dispatch => {
        dispatch({
            type: INCREMENT,
            payload: count,
        });
    };
};
export const setWorkflow = (workflow) => {
    return dispatch => {
        dispatch({
            type: APP_WORKFLOW,
            payload: workflow,
        });
    };
};
export const activeMeeting = (meeting) => {
    console.log('activeMeeting: ', meeting);
    return dispatch => {
        dispatch({
            type: ACTIVE_MEETING,
            payload: meeting,
        });
    };
};
export const editMeeting = (meeting) => {
    return dispatch => {
        dispatch({
            type: EDIT_MEETING,
            payload: meeting,
        });
    };
};
export const allMeetings = (meetings) => {
    console.log('ACTION meetings: ', meetings);
    return dispatch => {
        dispatch({
            type: ALL_MEETINGS,
            payload: meetings,
        });
    };
};
export const startMeeting = () => {
    console.log('ACTION startMeeting: ');
    return dispatch => {
        dispatch({
            type: TIMER_ACTION,
            payload: 'start',
        });
    };
};
export const pauseMeeting = () => {
    console.log('ACTION pauseMeeting: ');
    return dispatch => {
        dispatch({
            type: TIMER_ACTION,
            payload: 'pause',
        });
    };
};
export const stopMeeting = () => {
    console.log('ACTION stopMeeting: ');
    return dispatch => {
        dispatch({
            type: TIMER_ACTION,
            payload: 'stop',
        });
    };
};
export const refreshMeeting = () => {
    console.log('ACTION refreshMeeting: ');
    return dispatch => {
        dispatch({
            type: TIMER_ACTION,
            payload: 'refresh',
        });
    };
};