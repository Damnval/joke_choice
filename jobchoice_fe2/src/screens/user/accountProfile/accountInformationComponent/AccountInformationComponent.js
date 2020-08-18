import React, { Component } from 'react'
import { connect } from 'react-redux'
import { LANG } from '../../../../constants'
class AccountInformationComponent extends Component {

  render() {

    const props = this.props

    return (
      <div className="row row-bottom-border">
        <div className="col-md-11 offset-md-1">
          <div className="row profile-details-individual">
            <span className='profile-details-individual-title'>
              {props.label}
              { this.props.isEditing ? 
                  this.props.required ?
                    ( <span className="required-badge">
                        <small> {LANG[localStorage.JobChoiceLanguage].required} </small>
                      </span> ) :
                    ( !this.props.noBadge &&
                      <span className="optional-badge">
                        <small> {LANG[localStorage.JobChoiceLanguage].optional} </small>
                      </span> )
                  :
                  ''
              }
            </span>
            {props.children}
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
    return state
}
  
export default connect(mapStateToProps)(AccountInformationComponent)
