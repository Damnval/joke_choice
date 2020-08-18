import React, { Component } from 'react'
import "react-table/react-table.css"

class AccountRowThreeDetails extends Component {

  render() {
    const accountClass = this.props.accountClass ? this.props.accountClass : ''
    const className = this.props.className ? this.props.className : ''
    const dataClass = this.props.dataClass ? this.props.dataClass : ''
    return (
      <div className={`account-row-3 lefter toper ${className}`}>
        <div className={`account-generic-label generic-label righter ${accountClass}`}>{this.props.generalLabel}</div>
        <div className={`account-label label-1 righter ${accountClass}`}>{this.props.label}</div>
        <div className={`account-data data-1 righter ${dataClass}`}>
          {this.props.data}
        </div>
        <div className={`account-label label-2 righter ${accountClass}`}>{this.props.label_2}</div>
        <div className={`account-data data-2 righter ${dataClass}`}>
          {this.props.data_2}
        </div>
        <div className={`account-label label-3 righter ${accountClass}`}>{this.props.label_3}</div>
        <div className={`account-data data-3 righter ${dataClass}`}>
          {this.props.data_3}
        </div>
      </div>
    )
  }
}

export default AccountRowThreeDetails
