


export  const profileReducer = (state = { }, action) => {
    switch(action.type){

        case LOADING:
            return{
                ...state,
                loading: action.payload
            }
        
        case RESET_ERROR:
            return{
                ...state,
                error: null,
                pswdChange: null
            }

        case PROFILE_FAIL:

            return{
                ...state,
                error: action.payload
            }

        case PROFILE_SUCCESS:
            return{
                ...state,
                profileData: action.payload,
            }


        default:
            return state;
    }
}