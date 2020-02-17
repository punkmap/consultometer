import { TIMER_STOPS } from '../actions/types';
const initialState = {
    timerDetails: {}
}
export default (state = initialState, action) => {
    switch(action.type) {
        case TIMER_STOPS:
            return {
                ...state,
                timerDetails: action.payload
            };
        default:
            return state;
    }
}