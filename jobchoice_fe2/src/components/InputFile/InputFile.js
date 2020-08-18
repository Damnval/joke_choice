import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../store/auth/actions'

class InputFile extends Component {

  render() {
    const { className, error, value, name, id } = this.props
    return (
      <div className={className}>
        <input
          className={(error && error.length > 0) ? "error" : null}
          type="file"
          value={value}
          name={name}
          id={id}
          onChange={this.props.handleChange}
          id={id}
        />
        {(error && error.length > 0) && (
          <span className="errorMessage">{error}</span>
        )}
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

export default connect(mapStateToProps, mapDispatchToProps)(InputFile)
