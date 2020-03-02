// default reducer
// Note: You can remove this reducer and create your own reducer

import { SAVE_NOTE } from '../actions/types';
const initialState = {
    contentBlock: {}
}
export default (state = initialState, action) => {
    switch(action.type) {
        case SAVE_NOTE:
            return {
                ...state,
                contentBlock: action.payload
            };
        default:
            return state;
    }
}