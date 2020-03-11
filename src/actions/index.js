import { INCREMENT, APP_WORKFLOW, ACTIVE_MEETING, EDIT_MEETING, LOAD_MEETING, PAST_MEETINGS, FUTURE_MEETINGS, TIMER_ACTION, TIMER_STOPS, LOGIN_ACTION, SAVE_NOTE } from '../actions/types';


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
export const loadMeeting = (meeting) => {
    return dispatch => {
        dispatch({
            type: LOAD_MEETING,
            payload: meeting,
        });
    };
};
export const futureMeetings = (meetings) => {
    return dispatch => {
        dispatch({
            type: FUTURE_MEETINGS,
            payload: meetings,
        });
    };
};
export const pastMeetings = (meetings) => {
    return dispatch => {
        dispatch({
            type: PAST_MEETINGS,
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
export const saveNote = (details) => {
    return dispatch => {
        dispatch({
            type: SAVE_NOTE,
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