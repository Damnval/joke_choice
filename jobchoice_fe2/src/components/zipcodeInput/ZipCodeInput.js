import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../store/auth/actions'
import { LANG } from '../../constants'
import Input from '../input/Input'

class ZipCodeInput extends Component {
  constructor(props) {
    super(props)
    
    this.state = {
      value: '',
      valueTwo: ''
    }

    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount() {
    if (this.props.value) {
      this.setState({
        value: this.props.value.slice(0, 3),
        valueTwo: this.props.value.slice(3),
      })
    }
  }

  // Run setState if there is no initial value,
  // And if New Value is not null
  componentWillReceiveProps(new_props) {
    if (((this.props.value !== new_props.value) && !this.props.value) && new_props.value && new_props.value !== null) {
      this.setState({
        value: new_props.value.slice(0, 3),
        valueTwo: new_props.value.slice(3),
      })
    }
  }

  handleChange = (name, value) => {
    this.setState({
      [name]: value
    }, () => {
      this.props.handleInputChange("zip_code", this.state.value+this.state.valueTwo)
    })
  }

  render() {

    let { error, label, inputStyles, value, field,
          placeholder, ...rest  } = this.props

    return (
      <div className={`${rest.className ? rest.className : ''} input-field`}>
        {label ? 
          <label>
            { label }
            { this.props.required ?
              ( <span className="required-badge">
                  <small> {LANG[localStorage.JobChoiceLanguage].required} </small>
                </span> ) :
              ( <span className="optional-badge">
                  <small> {LANG[localStorage.JobChoiceLanguage].optional} </small>
                </span> )
            } :
          </label> : ""}
        <div className={`date-input-row`}>
          <div className="date-input-field zipcode-input-field">
            <Input 
              field="value"
              inputStyles={inputStyles}
              value={this.state.value}
              placeholder="xxx"
              maxLength="3"
              onChange={this.handleChange}
              pattern="[0-9]*"
            /> - 
            <Input 
              field="valueTwo"
              inputStyles={inputStyles}
              value={this.state.valueTwo}
              placeholder="xxxx"
              maxLength="4"
              onChange={this.handleChange}
              pattern="[0-9]*"
            />
          </div>
        </div>
      {(error) ? (error.length > 0 ?
          <span className={`${this.props.displaycreatejob === 'true' ? 'errorMessage-createJob' : 'errorMessage'}`}>{error}</span> :
            <div className="errorNone"></div>) :
          <div></div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ZipCodeInput)
