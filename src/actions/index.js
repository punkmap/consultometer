import { INCREMENT, APP_WORKFLOW, ACTIVE_MEETING, EDIT_MEETING, ALL_MEETINGS, TIMER_ACTION, TIMER_STOPS, LOGIN_ACTION } from '../actions/types';


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
    return dispatch => {
        dispatch({
            type: ALL_MEETINGS,
            payload: meetings,
        });
    };
};
export const startMeeting = () => {
    return dispatch => {
        dispatch({
            type: TIMER_ACTION,
            payload: 'start',
        });
    };
};
export const pauseMeeting = () => {
    return dispatch => {
        dispatch({
            type: TIMER_ACTION,
            payload: 'pause',
        });
    };
};
export const stopMeeting = () => {
    return dispatch => {
        dispatch({
            type: TIMER_ACTION,
            payload: 'stop',
        });
    };
};
export const refreshMeeting = () => {
    return dispatch => {
        dispatch({
            type: TIMER_ACTION,
            payload: 'refresh',
        });
    };
};
export const timerStops = (details) => {
    return dispatch => {
        dispatch({
            type: TIMER_STOPS,
            payload: details,
        });
    };
};
export const loginAction = (details) => {
    return dispatch => {
        dispatch({
            type: LOGIN_ACTION,
            payload: details,
        });
    };
};
// export const timerStops = (details) => {
//     return dispatch => {
//         dispatch({
//             type: TIMER_STOPS,
//             payload: details,
//         });
//     };
// };