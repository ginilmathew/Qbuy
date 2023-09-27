import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import Reactotron from '../ReactotronConfig'
import thunk from 'redux-thunk'

//import reducers


const appReducer = combineReducers({
    
    
})

// const reducer = (state, action) => {
//     if (action.type === RESET_USER) {
//         return appReducer(undefined, action)
//     }

//     return appReducer(state, action)
// }

const middleware = [ thunk ];


const store = createStore(compose(applyMiddleware(...middleware), Reactotron.createEnhancer()));

export default store; 