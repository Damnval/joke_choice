import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../store/auth/actions'
import { LANG } from '../../constants'

class QuestionFreeTextItem extends Component {
    render() {
        const answer = this.props.item
        return (
          <div className="answer-container">
            <div className="answer-marker">
              <div>A</div>
            </div>
            <div className="answer-list">
              <ul className={`${answer ? 'answer-item' : 'no-answer-item'}`}>{answer ? answer : LANG[localStorage.JobChoiceLanguage].noAnswer}</ul>
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

export default connect(mapStateToProps, mapDispatchToProps)(QuestionFreeTextItem)
