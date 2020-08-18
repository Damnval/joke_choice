import React, { Component } from 'react'

class BoxContainer extends Component {

  render() {
    return (
      <div className={`box-container ${this.props.className}`}>
        {this.props.title && <div className="box-container-title">{this.props.title}</div>}
        {this.props.children}
      </div>
    )
  }  
}

export default BoxContainer
