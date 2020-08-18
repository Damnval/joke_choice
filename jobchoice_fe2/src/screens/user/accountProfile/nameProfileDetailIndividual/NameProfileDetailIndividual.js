import React, { Component } from 'react'
import { connect } from 'react-redux'
import Input from '../../../../components/input/Input'
import { LANG } from '../../../../constants'

class NameProfileDetailIndividual extends Component {

  render() {

    const {label, first_label, detail, last_label, value, field, isEditing, error, required} = this.props
    const first_name = detail.first_name ? detail.first_name : ''
    const last_name = detail.last_name ? detail.last_name : ''
    const full_name = (first_name || last_name) ? `${last_name} ${first_name}` : LANG[localStorage.JobChoiceLanguage].valueNotSet 
    const classNameValue = (first_name || last_name) ? '' : 'empty'
    return (
      <div className="row row-bottom-border">
        <div className="col-md-11 offset-md-1">
        {
          !isEditing ? 
            <div className='profile-details-individual'>
              <span className='profile-details-individual-title'>{ label } </span>
              <span className={`profile-details-individual-value ${classNameValue}`}>{full_name}</span>
            </div>
          :
            <>
              <div className='profile-details-individual'>
                <span className='profile-details-individual-title'>
                  { last_label }: 
                  { this.props.required ?
                    <span className="required-badge">
                      <small> {LANG[localStorage.JobChoiceLanguage].required} </small>
                    </span> :
                    <span className="optional-badge">
                      <small> {LANG[localStorage.JobChoiceLanguage].optional} </small>
                    </span>
                  }
                </span>
                <Input 
                  value={value.last_name}
                  field={field.last_name}
                  maxLength="50"
                  inputStyles="profile-details-individual-edit"
                  onChange={this.props.handleInputChange}
                  error={error && error.last_name}
                  required={this.props.required}
                />
              </div>
              <div className='profile-details-individual'>
                <span className='profile-details-individual-title'>
                  { first_label }: 
                  { this.props.required ?
                    <span className="required-badge">
                      <small> {LANG[localStorage.JobChoiceLanguage].required} </small>
                    </span> :
                    <span className="optional-badge">
                      <small> {LANG[localStorage.JobChoiceLanguage].optional} </small>
                    </span>
                  }
                </span>
                <Input 
                  value={value.first_name}
                  field={field.first_name}
                  maxLength="50"
                  inputStyles="profile-details-individual-edit"
                  onChange={this.props.handleInputChange}
                  error={error && error.first_name}
                  required={this.props.required}
                />
              </div>
            </>
          
        }
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
    return state
}
  
export default connect(mapStateToProps)(NameProfileDetailIndividual)
