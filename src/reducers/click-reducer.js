// default reducer
// Note: You can remove this reducer and create your own reducer

import { INCREMENT } from '../actions/types';
const initialState = {
    clickCount: 0
}
export default (state = initialState, action) => {
    switch(action.type) {
        case INCREMENT:
            return {
                ...state,
                clickCount: action.payload
            };
        default:
            return state;
    }
}