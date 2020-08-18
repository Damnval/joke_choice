import React, { Component } from 'react'
import '../UserDashboard.scss'
import { Link } from 'react-router-dom'
import { LANG } from '../../../../../constants'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../../../../store/auth/actions'
import HatarakikataDisplay from '../../../../../components/hatarakikata/hatarakikataDisplay/HatarakikataDisplay';

class UserDashboardHatarakikata extends Component {
    render() {
        return (
            <div className="user-dashboard-hatarakikata">
                <div className="user-dashboard-hatarakikata-title">
                    <span>{ LANG[localStorage.JobChoiceLanguage].hatarakikataChoice }</span>
                    <Link to={{pathname:'/hatarakikata', state:{mode:'save', prevLocation: '/home'}}}
                        className='btn user-dashboard-hatarakikata-button'>
                        { LANG[localStorage.JobChoiceLanguage].editHatarakikata }
                    </Link>
                </div>
                <div className="user-dashboard-hatarakikata-image-area">
                    <div className="container">
                        <div className="row user-dashboard-hatarakikata-image-center">
                            {(this.props.hataraki_kata_resource && this.props.hataraki_kata_resource.length > 0) ?
                              (this.props.hataraki_kata_resource.map((value, key) => {
                              return (
                                  <HatarakikataDisplay key={key} resource={value} />
                              )}))
                             :
                              <div className="no-hataraki-kata-selected">{ LANG[localStorage.JobChoiceLanguage].noHataSelected }</div>
                            }
                        </div>
                    </div>
                </div>
                <div className="user-dashboard-hatarakikata-edit">
                    
                </div>
            </div>
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
  
  export default connect(mapStateToProps, mapDispatchToProps)(UserDashboardHatarakikata)
