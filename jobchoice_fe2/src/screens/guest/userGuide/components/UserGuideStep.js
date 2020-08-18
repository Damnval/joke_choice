import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class UserGuideStep extends Component {
  
  render() {
    const {children, step, className, arrow=true, arrowCount=1, arrowIcon="caret-down"} = this.props

    return (
      <>
        <div className={`guide-content content-${step} ${className ? className : ''}`}>
          {children}
        </div>
        { ( arrowCount === 1 && arrow ) &&
          <div className={`user-guide-step-arrow-down arrow-${step}`}>
            <FontAwesomeIcon icon={arrowIcon} size="2x"/>
          </div>
        }
        { ( arrowCount === 2 && arrow ) &&
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-6">
                <div className={`user-guide-step-arrow-down arrow-${step} first-arrow`}>
                  <FontAwesomeIcon icon={arrowIcon} size="2x"/>
                </div>
              </div>
              <div className="col-lg-6">
                <div className={`user-guide-step-arrow-down arrow-${step}`}>
                  <FontAwesomeIcon icon={arrowIcon} size="2x"/>
                </div>
              </div>
            </div>
          </div>
        }
      </>
    )
  } 
}

export default UserGuideStep
