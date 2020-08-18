import React from 'react'
import './JobChoiceLayout.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import logoHeader from '../../assets/img/Logo-Header.png'
import ReactFlagsSelect from 'react-flags-select'
import store from '../../store/config'
import { setLanguage } from '../../store/lang/action'
import { bindActionCreators } from 'redux'
import * as authActions from '../../store/auth/actions'
import {LANG} from '../../constants'
import JobChoiceHeaderLink from './jobChoiceLayoutComponents/JobChoiceHeaderLink'

class JobChoiceClientHeader extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showCollapsed: false
    }
    this.onSelectFlag = this.onSelectFlag.bind(this)
  }

  clickCollapse = () => {
    this.setState({ showCollapsed: !this.state.showCollapsed })
  }

  onSelectFlag(countryCode){
    store.dispatch(setLanguage(countryCode))

  }

  render() {

    const { isLoggedIn } = this.props

    return (
      <>
      <nav className="jobchoice-navbar">
        <div className="row client-navbar-row">

          <div className="jobchoice-navbar-brand">
            <a href={`${isLoggedIn ? '/' : '/'}`}>
              <img src={logoHeader} width={200} alt="logo"/>
            </a>
          </div>

          {/* JOB CHOICE LEFT NAVBAR PC */}
          <div className="jobchoice-navbar-left jobchoice-navbar-non-mobile">
            <ul>
              <li>
                <ReactFlagsSelect
                  placeholder="Select Language"
                  optionsSize={14}
                  onSelect={this.onSelectFlag}
                  defaultCountry={localStorage.JobChoiceLanguage}
                  countries={["US", "JP"]}
                />
              </li>
            </ul>
          </div>

          {/* JOB CHOICE RIGHT NAVBAR PC */}
          <div className="jobchoice-navbar-right jobchoice-navbar-non-mobile">
            <ul>
              <li>
                <img className="jobchoice-navbar-contact" src={require('../../assets/img/top_page/client-hero-contact-2.png')} alt="client-contact" />
              </li>
              <li className="client-header-grid-link">
                <Link to="/email-registration/company" className="btn btn-header-publication">
                  {LANG[localStorage.JobChoiceLanguage].clientHeaderPublication }
                </Link>
                <Link to="/login" className="btn btn-header-login">
                  {LANG[localStorage.JobChoiceLanguage].clientHeaderLogin }
                </Link>
                <Link to="/" className="btn btn-header-home">
                  {LANG[localStorage.JobChoiceLanguage].clientHeaderHome }
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="jobchoice-navbar-collapser jobchoice-navbar-mobile">
            <button onClick={this.clickCollapse} className="mobile-buttoner"><FontAwesomeIcon icon='bars' /></button>
          </div>

        </div>
      </nav>
      <div className={`jobchoice-menu-mobile ${!this.state.showCollapsed ? 'jobchoice-navbar-hide' : 'jobchoice-navbar-show'}`}>
        <ul>
          <li>
            <ReactFlagsSelect
              placeholder="Select Language"
              optionsSize={14}
              onSelect={this.onSelectFlag}
              defaultCountry={localStorage.JobChoiceLanguage}
              countries={["US", "JP"]}
            />
          </li>
          <JobChoiceHeaderLink className="btn btn-header-publication" link="/email-registration/company" labelKey="clientHeaderPublication"/>
          <JobChoiceHeaderLink className="btn btn-header-login" link="/login" labelKey="clientHeaderLogin"/>
          <JobChoiceHeaderLink className="btn btn-header-home" link="/client/top-page" labelKey="clientHeaderHome"/>
        </ul>
      </div>
      </>
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

export default connect(mapStateToProps, mapDispatchToProps)(JobChoiceClientHeader)
