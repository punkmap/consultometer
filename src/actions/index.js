import { INCREMENT, APP_WORKFLOW, EDIT_MEETING } from '../actions/types';


export const increment = (count) => {
    return dispatch => {
        dispatch({
            type: INCREMENT,
            payload: count,
        });
    };
};
export const setWorkflow = (workflow) => {
    console.log('setWorkflow: ', workflow);
    return dispatch => {
        dispatch({
            type: APP_WORKFLOW,
            payload: workflow,
        });
    };
};
export const editMeeting = (meeting) => {
    console.log('editMeeting: ', meeting);
    return dispatch => {
        dispatch({
            type: EDIT_MEETING,
            payload: meeting,
        });
    };
};