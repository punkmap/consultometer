// default reducer
// Note: You can remove this reducer and create your own reducer

import { PAST_MEETINGS } from '../actions/types';
const initialState = {
    meetings: []
}
export default (state = initialState, action) => {
    switch(action.type) {
        case PAST_MEETINGS:
            return {
                ...state,
                meetings: action.payload
            };
        default:
            return state;
    }
}