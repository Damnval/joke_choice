import React from 'react'
import './JobChoiceLayout.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { connect } from 'react-redux'
import logoHeader from '../../assets/img/Logo-Header.png'
import ReactFlagsSelect from 'react-flags-select'
import store from '../../store/config'
import { ReturnFullName } from '../../helpers'
import { setLanguage } from '../../store/lang/action'
import { bindActionCreators } from 'redux'
import * as authActions from '../../store/auth/actions'
import JobChoiceHeaderLink from './jobChoiceLayoutComponents/JobChoiceHeaderLink'

class JobChoiceHeader extends React.Component {
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
        <div className="row">

          <div className="jobchoice-navbar-brand">
            <a href={`${isLoggedIn ? '/' : '/'}`}>
              <img src={logoHeader} width={140} alt="logo"/>
            </a>
          </div>
          {/* JOB CHOICE LEFT NAVBAR PC */}
          <div className="jobchoice-navbar-left jobchoice-navbar-non-mobile">
            <ul>
              <JobChoiceHeaderLink link="/search" icon="search" labelKey="searchJob"/>
              <JobChoiceHeaderLink link="/jobs" icon="share-alt" labelKey="shareJobs"/>
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
            { isLoggedIn === false || this.props.user.data === undefined ?
              <ul>
                <JobChoiceHeaderLink link="/login" icon="lock" labelKey="login"/>
                <JobChoiceHeaderLink link="/email-registration/job_seeker" icon="pen-square" labelKey="memberRegistration"/>
                <JobChoiceHeaderLink link="/client/top-page" icon="share-alt" labelKey="ifYourThinking" id="jobchoice-unique-navbar1"/>
              </ul> :
              <ul>
                { this.props.user.data && this.props.user.data.job_seeker !== null ?
                  <JobChoiceHeaderLink link="/home" icon="user" label={ReturnFullName(this.props.user.data.first_name, this.props.user.data.last_name, true)}/> :
                  <JobChoiceHeaderLink link="/account-profile" icon="briefcase" label={ReturnFullName(this.props.user.data.first_name, this.props.user.data.last_name, true)}/>
                }
                <JobChoiceHeaderLink link="/faq" icon="question" labelKey="faq"/>
                <JobChoiceHeaderLink link="/logout" icon="power-off" labelKey="logout"/>
              </ul>
            }
          </div>
          
          <div className="jobchoice-navbar-collapser jobchoice-navbar-mobile">
            <button onClick={this.clickCollapse} className="mobile-buttoner"><FontAwesomeIcon icon='bars' /></button>
          </div>

        </div>
      </nav>
      <div className={`jobchoice-menu-mobile ${!this.state.showCollapsed ? 'jobchoice-navbar-hide' : 'jobchoice-navbar-show'}`}>
        <ul>
          <JobChoiceHeaderLink link="/search" icon="search" labelKey="searchJob"/>
          <JobChoiceHeaderLink link="/jobs" icon="share-alt" labelKey="shareJobs"/>
          <li>
            <ReactFlagsSelect
              placeholder="Select Language"
              optionsSize={14}
              onSelect={this.onSelectFlag}
              defaultCountry={localStorage.JobChoiceLanguage}
              countries={["US", "JP"]}
            />
          </li>
          {isLoggedIn === false || this.props.user.data === undefined ?
            <>
              <JobChoiceHeaderLink link="/login" icon="lock" labelKey="login"/>
              <JobChoiceHeaderLink link="/email-registration/job_seeker" icon="pen-square" labelKey="memberRegistration"/>
              <JobChoiceHeaderLink link="/client/top-page" icon="share-alt" labelKey="ifYourThinking" id="jobchoice-unique-navbar1"/>
            </> :
            <>
              { this.props.user.data && this.props.user.data.job_seeker !== null ?
                <JobChoiceHeaderLink link="/home" icon="user" label={ReturnFullName(this.props.user.data.first_name, this.props.user.data.last_name, true)}/> :
                <JobChoiceHeaderLink link="/account-profile" icon="briefcase" label={ReturnFullName(this.props.user.data.first_name, this.props.user.data.last_name, true)}/>
              }
              <JobChoiceHeaderLink link="/faq" icon="question" labelKey="faq"/>
              <JobChoiceHeaderLink link="/logout" icon="power-off" labelKey="logout"/>
            </>
          }
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

export default connect(mapStateToProps, mapDispatchToProps)(JobChoiceHeader)
