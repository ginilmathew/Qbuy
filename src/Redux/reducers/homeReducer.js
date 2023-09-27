import {
    BOOKING_CONFIRM_SUCCESS,
    BOOKING_HOURLY_FAIL,



} from "../constants/homeConstant"

export const homeReducer = (state = {}, action) => {
    switch (action.type) {

        case LOADING:
            return {
                ...state,
                loading: action.payload
            }

        case RESET_ERROR:
            return {
                ...state,
                error: null,
            }
  
        default:
            return state;
    }
}