import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { connect } from 'react-redux'
import {Link} from 'react-router-dom'
import { LANG } from '../../../constants'
import { bindActionCreators } from 'redux'
import * as authActions from '../../../store/auth/actions'

class JobChoiceHeaderLink extends React.Component {

  render() {
    return (
      <li>
        <Link to={this.props.link} id={this.props.id} className={this.props.className ? this.props.className : ''}>
          <span>
            {this.props.icon && <FontAwesomeIcon icon={this.props.icon} />} {this.props.labelKey && LANG[localStorage.JobChoiceLanguage][this.props.labelKey]}
            {` ${this.props.label ? this.props.label : ''}`}
          </span>
        </Link>
      </li>
    )
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

export default connect(mapStateToProps, mapDispatchToProps)(JobChoiceHeaderLink)
