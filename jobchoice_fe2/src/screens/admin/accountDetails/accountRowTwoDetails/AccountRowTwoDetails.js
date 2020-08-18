import React, { Component } from 'react'
import "react-table/react-table.css"

class AccountRowTwoDetails extends Component {

  render() {
    const accountClass = this.props.accountClass ? this.props.accountClass : ''
    const className = this.props.className ? this.props.className : ''
    const dataClass = this.props.dataClass ? this.props.dataClass : ''
    return (
      <div className={`account-row-2 lefter toper ${className}`}>
        <div className={`account-label label-1 righter ${accountClass}`}>{this.props.label}</div>
        <div className={`account-data data-1 righter ${dataClass}`}>
          {this.props.data}
        </div>
        <div className={`account-label label-2 righter ${accountClass}`}>{this.props.label_2}</div>
        <div className={`account-data data-2 righter ${dataClass}`}>
          {this.props.data_2}
        </div>
      </div>
    )
  }
}

export default AccountRowTwoDetails