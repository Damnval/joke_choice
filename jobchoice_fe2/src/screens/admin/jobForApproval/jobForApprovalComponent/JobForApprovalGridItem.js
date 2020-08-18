import React, { Component } from 'react'

class JobForApprovalGridItem extends Component {

    render() {
      return (
        <div className={`job-for-approval-grid-item righter ${this.props.className}`}>
          {this.props.children}
        </div>
      )
    }
}

export default JobForApprovalGridItem
