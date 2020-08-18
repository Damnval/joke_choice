import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../store/auth/actions'
import "./TopPageCard.scss"
import defaultJobImage from '../../assets/img/job-avatar.jpg'
import Img from 'react-fix-image-orientation'

class TopPageCard extends Component {

  render() {
    const image = this.props.image
    const desc = localStorage.JobChoiceLanguage === 'JP' ? this.props.item_jp: this.props.item_en

    return (
      <div className={this.props.containerStyle}>
        <div className="flip-card-inner">
          <div className="flip-card-front"></div>
          <Img src={image ? image : defaultJobImage} alt="job_image"/>
          
          <div className="flip-card-back">
            <div>{desc}</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(TopPageCard)
