import React, { Component } from 'react'
import "react-table/react-table.css"

class AccountRowDetails extends Component {

  render() {
    const accountClass = this.props.accountClass ? this.props.accountClass : ''
    const className = this.props.className ? this.props.className : ''
    const dataClass = this.props.dataClass ? this.props.dataClass : ''
    return (
      <div className={`account-row toper ${className}`}>
        <div className={`account-label righter ${accountClass}`}>{this.props.label}</div>
        <div className={`account-data righter ${dataClass}`}>
          {this.props.data}
        </div>
      </div>
    )
  }
}

export default AccountRowDetails
