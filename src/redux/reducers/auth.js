import { enums, storage } from '../../helpers/common';
import { actionTypes } from '../constant/action-types';


const defaultUser = { login: false, token: "" };
var user = storage.getParsed(enums.USER, defaultUser);






const initialState = {
    user: defaultUser,
  

};


export const auth = (state = initialState, { type, payload = {} }) => {
    switch (type) {
        case actionTypes.LOGIN:
            console.log("payload is",payload);

            let user = payload;
            user.login = true;
            console.log("user is",user);
            return { ...state, user: user, };
        case actionTypes.LOGOUT:
            return { ...state, user: defaultUser };
        default:
            return state;
    }
}

