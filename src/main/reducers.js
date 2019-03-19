import { combineReducers } from 'redux'
import jogoReducer from '../jogo/jogoReducer'

const rootReducer = combineReducers({
    jogo: jogoReducer
})

export default rootReducer