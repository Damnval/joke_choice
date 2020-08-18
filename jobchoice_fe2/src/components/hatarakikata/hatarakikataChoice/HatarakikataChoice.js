import React, { Component } from 'react'
import '../Hatarakikata.scss'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../../store/auth/actions'
class HatarakikataChoice extends Component {
    render() {
      const resource = this.props.resource
      const desc = localStorage.JobChoiceLanguage === 'JP' ? resource.item_jp: resource.item_en

        return (
          <div
          className={this.props.className}
          value={resource.id}
          onClick={this.props.onClickCard ? ()=>{this.props.onClickCard(resource.id)}: null}
        >
            <div className="flip-card-inner">
              <div className="flip-card-front"></div>
              <img src={resource.image} alt={desc} />
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

export default connect(mapStateToProps, mapDispatchToProps)(HatarakikataChoice)
