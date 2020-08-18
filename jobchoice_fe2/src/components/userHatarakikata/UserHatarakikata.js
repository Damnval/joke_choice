import React, { Component } from 'react'
import './UserHatarakikata.scss'
import { LANG } from '../../constants'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../store/auth/actions'
import { Link } from 'react-router-dom'
import HatarakikataDisplay from '../hatarakikata/hatarakikataDisplay/HatarakikataDisplay';

class UserHatarakikata extends Component {
    render() {
      const hatarakikata = this.props.user.data && this.props.user.data.job_seeker.hataraki_kata_resource.length > 0 ? 
        this.props.user.data.job_seeker.hataraki_kata_resource : null
        return (
          <div className="user-hatarakikata">
            <div className="hatarakikata-title">
                <span>{LANG[localStorage.JobChoiceLanguage].hatarakikataChoice}</span>
            </div>
            { (hatarakikata) ?
              <div className="user-hatarakikata-image-area">
                  <div className="container">
                      <div className="row user-hatarakikata-image-center">
                          {hatarakikata.map((value, key) => {
                            return (
                              <HatarakikataDisplay key={key} resource={value} />
                            )
                          })}
                      </div>
                  </div>
              </div> :
              <div className="user-hatarakikata-edit">
                  <Link
                    to={{pathname:'/hatarakikata', state:{mode:'save', prevLocation: '/jobs'}}}
                    className='btn user-hatarakikata-button'
                  >
                    Register Hataraki Kata
                  </Link>
              </div>
            }
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

export default connect(mapStateToProps, mapDispatchToProps)(UserHatarakikata)
