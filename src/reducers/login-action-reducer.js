// default reducer
// Note: You can remove this reducer and create your own reducer

import { LOGIN_ACTION } from '../actions/types';
const initialState = {
    loginAction: ''
}
export default (state = initialState, action) => {
    switch(action.type) {
        case LOGIN_ACTION:
            return {
                ...state,
                loginAction: action.payload
            };
        default:
            return state;
    }
}