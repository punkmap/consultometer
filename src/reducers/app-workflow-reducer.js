// default reducer
// Note: You can remove this reducer and create your own reducer

import { APP_WORKFLOW } from '../actions/types';
const initialState = {
    workflow: ''
}
export default (state = initialState, action) => {
    switch(action.type) {
        case APP_WORKFLOW:
            return {
                ...state,
                workflow: action.payload
            };
        default:
            return state;
    }
}