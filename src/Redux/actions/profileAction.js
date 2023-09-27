


// export const getProfile = (id) => async(dispatch) => {
//     dispatch({
//         type: LOADING,
//         payload: true
//     })
//     await axios.get(`auth/profile/${id}`)  
//     .then(async response => {
//         dispatch({
//             type: AUTH_INPUT,
//             payload: {
//                 prop: 'userData',
//                 value: response.data.data
//             }
//         })
//         dispatch({
//             type: LOADING,
//             payload: false
//         })
//     })
//     .catch(async error => {
//         dispatch({
//             type: PROFILE_FAIL,
//             payload: error
//         })
//         dispatch({
//             type: LOADING,
//             payload: false
//         })
//     });
// }



