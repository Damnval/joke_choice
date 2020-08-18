// eslint-disable-next-line
import React, { Component } from 'react'
import IdleTimer from 'react-idle-timer'
import store from './store/config'
import { logoutUser } from './store/auth/actions'
import { BrowserRouter as Router } from 'react-router-dom'
import Routes from './Routes'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from './store/auth/actions'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import {Redirect} from 'react-router-dom'
import { 
  faExclamation, faCheck, faSpinner, faSearch, faFileInvoice, faQuestion,
  faLock, faPenSquare, faMobileAlt, faPowerOff, faBars, faTimes, faPen, faCaretLeft,
  faEye, faEdit, faTrash, faArrowLeft, faBriefcase, faUser, faQuestionCircle,
  faPlusCircle, faTachometerAlt, faBell, faBuilding, faFile, faUsers, faFileExcel,
  faAngleDown, faAngleUp, faQrcode, faSms, faEnvelope, faChevronDown, faWindowClose, faClipboard,
  faChevronRight, faChevronLeft, faShare, faLaptop, faListAlt, faInfoCircle, faTasks, faArrowDown, faFlagCheckered,
  faShareAlt, faMoneyBill, faCaretDown, faArrowCircleRight
} from '@fortawesome/free-solid-svg-icons'

class App extends Component {
  constructor(props) {
    super(props)
    this.idleTimer = null
    this.state = {
      isIdle:false,
      language: localStorage['JobChoiceLanguage']
    }
    this.onIdle = this._onIdle.bind(this)
  }
  
  _onIdle(e) {
    this.setState({isIdle:true}, () => {
      store.dispatch(logoutUser())
    })
  }

  render() {
    return (
      <div className={`jobchoice-main ${localStorage['JobChoiceLanguage'] === 'JP' ? 'jp' : 'en'}`}>
      <Router>
        <>
        <IdleTimer
          ref={ref => { this.idleTimer = ref }}
          onIdle={this.onIdle}   
          timeout={1000 * 60 * 30} />

        {this.state.isIdle && 
          <Redirect to={'/'} />
        }
        <Routes/>
        </>
      </Router> 
      </div>
    )
  }
}

library.add(fab, faExclamation, faCheck, faSpinner, faFileInvoice, faQuestion,
  faSearch, faLock, faPenSquare, faMobileAlt, faPowerOff, faBars, faPen, faCaretLeft,
  faTimes, faEye, faEdit, faTrash, faArrowLeft, faBriefcase, faUser, faFileExcel,
  faPlusCircle, faTachometerAlt, faBell, faBuilding, faFile, faUsers, faWindowClose, faClipboard,
  faAngleDown, faAngleUp, faQrcode, faSms, faEnvelope, faChevronDown, faQuestionCircle,
  faChevronRight, faChevronLeft, faShare, faLaptop, faListAlt, faInfoCircle, faTasks, faArrowDown,
  faFlagCheckered, faShareAlt, faMoneyBill, faCaretDown, faArrowCircleRight)

const mapStateToProps = state => {
  return state
}

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(authActions, dispatch)
  }
}
  
export default connect(mapStateToProps, mapDispatchToProps)(App)
