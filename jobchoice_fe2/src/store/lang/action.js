import * as types from '../actions'

export function setLanguage(selectedLanguage) {
  localStorage.setItem('JobChoiceLanguage', selectedLanguage)
  return dispatch => (
    dispatch({
        type: types.LANGUAGE_SELECT,
        payload: selectedLanguage
    })
  )
}
