// default reducer
// Note: You can remove this reducer and create your own reducer

import { TIMER_ACTION } from '../actions/types';
const initialState = {
    timerAction: ''
}
export default (state = initialState, action) => {
    switch(action.type) {
        case TIMER_ACTION:
            return {
                ...state,
                timerAction: action.payload
            };
        default:
            return state;
    }
}