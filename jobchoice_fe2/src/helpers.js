import { LANG, EM } from './constants'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

export function pageGenerator(last_page){
  const pageNumbers = [];
  for (let i = 1; i <= last_page; i++) {
    pageNumbers.push(i);
  }

  return pageNumbers
}

export function ErrorModal() {
  return {
    modal: {
    message: LANG[localStorage.JobChoiceLanguage].serverError,
    messageKey: 'serverError',
    modal: true,
    modalType: 'error',
    redirect: '/home'
  }}
}

//////////////////////////////////////////////////////////////////////////////////////////////////
// Call this function to validate your Date                                                ///////
// Future Dates are not allowed in this input                                              ///////
// Accepts value to be checked "yyyy/mm/dd"                                                ///////
//////////////////////////////////////////////////////////////////////////////////////////////////
export function BirthdayValidation(value) {
  const moment = require('moment')
  const age = moment().diff(value, "years")
  const isOk = age >= 15
  if (moment(value).isAfter(new Date()) === true) {
    return "selectBday"
  } else if (!isOk) {
    return 'mustBe15'
  } else {
    return ""
  }
}

export function ClearModal() {
  return {modal: {
    messageKey: null,
    message: "",
    modal: false,
    modalType: '',
  }}
}

export function DateSubmitFormat(date) {
  const moment = require('moment')
  return moment(date, "YYYY-MM-DD").format("YYYY-MM-DD")
}

export function DateFormat(date) {
  const moment = require('moment')
  return moment(date, "YYYY-MM-DD").format("YYYY年MM月DD日")
}

export function DateTimeFormat(date) {
  const moment = require('moment')
  return moment(date, "YYYY-MM-DD HH:mm:ss").format("YYYY年MM月DD日 HH:mm:ss")
}

export function TimeFormat(time) {
  const moment = require('moment')
  return moment(time, "h:mm a").format("h:mm a")
}

export function Age(date) {
  const moment = require('moment')
  return moment().diff(date, 'years')
}

export function MonthToday() {
  const dateToday = new Date().getMonth() + 1
  return localStorage.JobChoiceLanguage === 'JP' ? dateToday + '月' :
    EM[localStorage.JobChoiceLanguage].MONTH.filter(function(el) {
      return (el.value === dateToday) ? el : null
    })[0].name
}

export function FirstDayCurrentMonth() {
  const moment = require('moment')
  return {firstday: moment().startOf('month')}
}

export function LastDayCurrentMonth() {
  const moment = require('moment')
  return {lastday: moment().endOf('month')}
}

//////////////////////////////////////////////////////////////////////////////////////////////////
// Use this function to set full name as single string or return null if both are empty    ///////
// This can be used for name and kana name                                                 ///////
//////////////////////////////////////////////////////////////////////////////////////////////////
export function ReturnFullName(fname, lname, reverse=false) {
  const first_name = fname ? fname : ''
  const last_name = lname ? lname : ''
  if (reverse) {
    return first_name || last_name ? `${last_name} ${first_name}` : null
  }
  return first_name || last_name ? `${first_name} ${last_name}` : null
}

//////////////////////////////////////////////////////////////////////////////////////////////////
// When you are working with SEARCH FIELDS INPUT                                           ///////
// Start with parent object with key searchFields                                          ///////
// Use this function to have similar search input                                          ///////
//////////////////////////////////////////////////////////////////////////////////////////////////
export function handleSearchInputChange(searchFields, name, value) {
  return ({
    searchFields: {
      ...searchFields,
      [name]: value
    }
  })
}


export function handleSearchTranslation(data, value, returnValue = null) {
  return value ? EM[localStorage.JobChoiceLanguage][data].filter(function(el) { return el.value === value })[0].name : returnValue
}

//////////////////////////////////////////////////////////////////////////////////////////////////
// If Empty, returns blank string                                                          ///////
// If input is only whitespaces, return invalidFormat                                      ///////
// Else return blank string                                                                ///////
//////////////////////////////////////////////////////////////////////////////////////////////////
export function whiteSpaceValidation(value) {
  if(value === null || value.length === 0) {

  } else if (value.trim().length === 0) {
    return 'invalidFormat'
  }

  return ''
}

export function imageDateNow(url) {
  return `${url}?${Date.now()}`
}