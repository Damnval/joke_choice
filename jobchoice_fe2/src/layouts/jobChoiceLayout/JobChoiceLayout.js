import React from 'react'
import { Grid } from 'react-bootstrap'
import './JobChoiceLayout.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { connect } from 'react-redux'
import logoHeader from '../../assets/img/Logo-Header.png'
import {Link} from 'react-router-dom'
import ReactFlagsSelect from 'react-flags-select'
import store from '../../store/config'
import { setLanguage } from '../../store/lang/action'
import { LANG } from '../../constants'
import { bindActionCreators } from 'redux'
import * as authActions from '../../store/auth/actions'
import Modal from '../../components/modal/Modal'
import InDevelopmentMessage from './InDevelopmentMessage'
import JobChoiceHeader from './JobChoiceHeader'
import JobChoiceClientHeader from './JobChoiceClientHeader'

class JobChoiceLayout extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoggedIn: false,
      showCollapsed: false,
      isLoading: false,
      modal: {
        messageKey: null,
        message: '',
        modal: false,
        modalType: '',
        redirect: null,
      },
    }
    this.onSelectFlag = this.onSelectFlag.bind(this)
    this.handleParentClose = this.handleParentClose.bind(this)
  }

  componentDidMount() {
    if (localStorage.accessToken) {
      this.setState({
        isLoggedIn: true
      })
    }
  }

  clickCollapse = () => {
    this.setState({ showCollapsed: !this.state.showCollapsed })
  }

  onSelectFlag(countryCode){
    store.dispatch(setLanguage(countryCode))

  }

  handleInDevelopment = () => {
    this.setState({
      modal: {
        messageKey: null,
        message: "",
        modal: false,
        modalType: '',
      },
      showCollapsed: !this.state.showCollapsed
    }, () => {
      this.setState({
        modal: {
          messageKey: 'thisIsStillInDevelopment',
          message: LANG[localStorage.JobChoiceLanguage].thisIsStillInDevelopment,
          modal: true,
          modalType: 'error',
        }
      })
    })
  }

  handleParentClose() {
    this.setState({
      modal: {
        messageKey: null,
        message: "",
        modal: false,
        modalType: '',
      }
    })
  }

  render() {
    return (
      <>
        {this.props.history && this.props.history.location.pathname === "/client/top-page" ?
          <JobChoiceClientHeader /> :
          <JobChoiceHeader />
        }

        <div className={`body ${this.props.className ? this.props.className : ""}`}>
          {this.props.children}
        </div>
        
        <div className="fixed-bottom">
          <div className='footer-links'>
            <a className="link-footer" href="/about" onClick={this.clickCollapse}>
              <span>{ LANG[localStorage.JobChoiceLanguage].operatingCompany }</span>
            </a> | 
            <a className="link-footer" href="/terms" onClick={this.clickCollapse}>
              <span>{ LANG[localStorage.JobChoiceLanguage].termsOfService }</span>
            </a> | 
            <a className="link-footer" href="https://okinawa.mediaflag.co.jp/privacy/" target="blank" onClick={this.clickCollapse}>
              <span>{ LANG[localStorage.JobChoiceLanguage].privacyPolicy }</span>
            </a> | 
            <a className="link-footer" href="/privacy-policy">
              <span>{ LANG[localStorage.JobChoiceLanguage].mattersConcerning }</span>
            </a> | 
            <a className="link-footer" href="/user-guide" onClick={this.clickCollapse}>
              <span>{ LANG[localStorage.JobChoiceLanguage].guidance }</span>
            </a> | 
            <a className="link-footer" href="/faq" onClick={this.clickCollapse}>
              <span>{ LANG[localStorage.JobChoiceLanguage].faq }</span>
            </a> | 
            <a className="link-footer" href="/contact" onClick={this.clickCollapse}>
              <span>{ LANG[localStorage.JobChoiceLanguage].inquiry }</span>
            </a> | 
            <a className="link-footer" href="#" onClick={()=>this.handleInDevelopment()}>
              <span>{ LANG[localStorage.JobChoiceLanguage].siteMap }</span>
            </a>
            <br/>
            <a className="link-footer" href="https://privacymark.jp/" target="blank" onClick={this.clickCollapse}>
              <img src={require('../../assets/img/footer-img.png')} width={60} alt="logo"/>
            </a>
          </div>
          <footer>
            <Grid>
              <div className='text-center small copyright'>
              { LANG[localStorage.JobChoiceLanguage].copyright }
              </div>
            </Grid>
          </footer>
        </div>
        <Modal 
            messageKey={this.state.modal.messageKey}
            show={this.state.modal.modal} 
            message={this.state.modal.message}
            type={this.state.modal.modalType}
            redirect={this.state.modal.redirect}
            data={this.state.modal.data}
            handleParentClose={this.handleParentClose}
        />

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

export default connect(mapStateToProps, mapDispatchToProps)(JobChoiceLayout)
