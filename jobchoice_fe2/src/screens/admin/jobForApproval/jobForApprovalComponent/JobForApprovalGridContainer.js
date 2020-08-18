import React, { Component } from 'react'

class JobForApprovalGridContainer extends Component {

    render() {
      return (
        <div className={`job-for-approval-grid-container ${this.props.className}`}>
          {this.props.children}
        </div>
      )
    }
}

export default JobForApprovalGridContainer
