import { INCREMENT, APP_WORKFLOW, EDIT_MEETING, ALL_MEETINGS } from '../actions/types';


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