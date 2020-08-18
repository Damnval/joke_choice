import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../../store/auth/actions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './HatarakikataCard.scss'
class HatarakikataCard extends Component {

  render() {
    const resource = this.props.resource
    const desc = localStorage.JobChoiceLanguage === 'JP' ? resource.item_jp: resource.item_en
    const id = this.props.id

    return (
      <div className="hatarakikata-image-card" id={`hatarakikata-${id}`}>
        <div className="flip-card-inner">
          <div className="flip-card-front"></div>
          <img src={resource.image} alt="job_image"/>
          <div className="flip-card-back">
            <button className="btn close-icon"
              onClick={() => this.props.removeHatarakikata(id)}>
              <FontAwesomeIcon icon={['fa', 'times']}/>
            </button>
            <div className="chosen-hatarakikata-description">{desc}</div>
          </div>
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(HatarakikataCard)
