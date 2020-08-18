import * as types from '../actions'

const initialstate = 'jp'

const langReducer = (state = initialstate, {type, payload}) => {
  if (type === types.LANGUAGE_SELECT) {
    return payload
  } else if (localStorage.JobChoiceLanguage){
    return localStorage.JobChoiceLanguage
  } else {
    localStorage.setItem('JobChoiceLanguage', 'JP')
    return 'JP'
  }
  return 'jp'
}

export default langReducer
