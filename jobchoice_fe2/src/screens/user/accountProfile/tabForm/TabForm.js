import React, { Component } from 'react'
import './../AccountProfile.scss'
import { connect } from 'react-redux'

class TabForm extends Component {

  render() {

    const props = this.props

    return (
      <>
        <div className="row">
          <div className="col-md-12">
            <div className="row row-bottom-border">
              <div className="col-md-12">
                <div className="tab-title-container">{props.label} 
                &nbsp;&nbsp;{
                  (props.editing) == true ? <label className="clear-bank" onClick={props.event}>{props.title}</label> : ""
                }
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
            <div className="col-md-12">
              {this.props.children}
              <div className="row">
                <div className="col-md-11 offset-md-1">
                    {this.props.buttonSet}
                </div>
              </div>
            </div>
        </div>
      </>
    )
  }
}

const mapStateToProps = state => {
    return state
}
  
export default connect(mapStateToProps)(TabForm)
