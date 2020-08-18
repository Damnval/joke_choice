import React, { Component } from 'react'
import '../Hatarakikata.scss'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../../store/auth/actions'

class HatarakikataDisplay extends Component {
    render() {
      const resource = this.props.resource
      const desc = localStorage.JobChoiceLanguage === 'JP' ? resource.hataraki_kata.item_jp: resource.hataraki_kata.item_en
        return (
          <div className="hatarakikata-image">
            <div className="flip-card-inner">
              <div className="flip-card-front"></div>
              <img src={resource.hataraki_kata.image} alt={desc} />
              <div className="flip-card-back">
                <div className="hatarakikata-image-desc">{desc}</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(HatarakikataDisplay)
