// default reducer
// Note: You can remove this reducer and create your own reducer

import { EDIT_MEETING } from '../actions/types';
const initialState = {
    meeting: {}
}
export default (state = initialState, action) => {
    switch(action.type) {
        case EDIT_MEETING:
            return {
                ...state,
                meeting: action.payload
            };
        default:
            return state;
    }
}