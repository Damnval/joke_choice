import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../store/auth/actions'
import { LANG } from '../../constants'

class QuestionChoiceItem extends Component {
    render() {
        const item = this.props.item
        return (
          <div className="answer-container">
            <div className="answer-marker">
              <div>A</div>
            </div>
            <div className="answer-list">
              { item.length > 0 ? item.map((el, key) => {
                  return (
                    <ul key={key} className="answer-item">
                      {el.job_question_answer.answer}
                    </ul>
                  )
                }) : 
                  <ul className="no-answer-item">{LANG[localStorage.JobChoiceLanguage].noAnswer}</ul>
              }
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

export default connect(mapStateToProps, mapDispatchToProps)(QuestionChoiceItem)
