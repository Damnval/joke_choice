import React, { Component } from 'react'
import JobChoiceLayout from '../../layouts/jobChoiceLayout/JobChoiceLayout'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './404NotFound.scss'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { LANG } from '../../constants'
import { bindActionCreators } from 'redux'
import * as authActions from '../../store/auth/actions'

class NotFound extends Component {
  render() {
    return (
      <>
        <JobChoiceLayout>
          <div className="notfound-background">
            <div className="notfound-title">
              <h1>
                <span><b> { LANG[localStorage.JobChoiceLanguage].error404 }: </b> { LANG[localStorage.JobChoiceLanguage].pageNotFound }</span>
              </h1>
            </div>
            <div className="notfound-body">
              <FontAwesomeIcon icon="exclamation-triangle" className="notfound-logo" />
              <h4>
                <span>{ LANG[localStorage.JobChoiceLanguage].thisPageRemoved }</span>
              </h4>
            </div>
            <div>
              <div className="notfound-footer">
                <Link to="/" className="btn notfound-btn">
                  <FontAwesomeIcon icon="arrow-left" />
                  <span>{ LANG[localStorage.JobChoiceLanguage].goToLanding }</span>
                </Link>
              </div>
            </div>
          </div>
        </JobChoiceLayout>
      </>
    );
  }

}

const mapStateToProps = state => {
  return state
}

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(authActions, dispatch)
  }
}

export default connect(mapStateToProps)(NotFound)
