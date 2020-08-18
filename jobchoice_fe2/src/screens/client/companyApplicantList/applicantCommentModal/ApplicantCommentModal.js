import React, { Component } from 'react'
import ReactModal from 'react-modal'
import './ApplicantCommentModal.scss'
import * as authActions from '../../../../store/auth/actions'
import QuestionChoiceItem from '../../../../components/questionAndAnswers/QuestionChoiceItem'
import QuestionFreeTextItem from '../../../../components/questionAndAnswers/QuestionFreeTextItem'
import { LANG } from '../../../../constants'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

class ApplicantCommentModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
          show: this.props.show,
          data: null
        }
        
        this.handleClose = this.handleClose.bind(this)
        this.refs = React.createRef()
    }

    componentDidMount() {
        ReactModal.setAppElement('body')
        this.setState({
          show: this.props.show,
          data: this.props.details
        })
     }

    handleClose() {
      this.setState({
        show: false
      }, () => {
        this.props.onClose('career_history_modal', false)
      })
    }

    sizeDialog = () => {
        if (!this.refs.content) return

        let contentHeight = this.refs.content.getBoundingClientRect().height

        this.setState({
          contentHeight: contentHeight,
        })
      }

    render() {
        const padding = 60
        let height = (this.state.contentHeight + padding)
        let heightOffset = height / 2
        let offsetPx = heightOffset + 'px'

        const style = {
            content: {
                border: '0',
                borderRadius: '8px',
                bottom: 'auto',
                left: '50%',
                position: 'fixed',
                right: 'auto',
                top: '50%',
                transform: 'translate(-50%,-50%)',
                width: '600px',
                maxWidth: '30rem',
                background: 'white'
            }
        }

        return (
            <ReactModal
                isOpen={this.state.show}
                onAfterOpen={this.afterOpenModal}
                onRequestClose={this.handleClose}
                className='dialog'
                style={style}
                overlayClassName='background-dynamic' >
                <div className='dialog__content' ref='content'>

                    <div className={`educational-modal-header`}>
                      <span>{LANG[localStorage.JobChoiceLanguage].workExperienceComment}</span>
                    </div>
                    <div className='modal-body question-list-modal'>
                      {this.props.details.job_seeker_answers.length > 0 ?
                        <div className="career-row">
                          {this.props.details.job_seeker_answers.map((item, key) => {
                            return (
                              <div key={key} className="row question-answer-data">
                                <div className="col-xl-12">
                                  <div className="question-answer data">
                                    <div key={key} className="question-container">
                                    <div className="question-marker">
                                      <div>Q</div>
                                    </div>
                                    <div className="question-item">{item.question}</div>
                                  </div>
                                    { (item.answer_type === 'multiple' ||
                                      item.answer_type === 'single') &&
                                      <QuestionChoiceItem item={item.job_question_job_seeker_answers} />
                                    }
                                    {item.answer_type === 'free_text' &&
                                      <QuestionFreeTextItem item={item.job_question_job_seeker_answers[0].free_text_answer} />
                                    }
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>:
                        <div className="null-data">{LANG[localStorage.JobChoiceLanguage].noQuestionAnswered}</div>
                      }
                    </div>
                </div>
            </ReactModal>
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

export default connect(mapStateToProps, mapDispatchToProps)(ApplicantCommentModal)
