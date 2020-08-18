import React from 'react'
import './../../../client/jobOfferDetail/JobOfferDetail'
import './../JobDetail.scss'
import { LANG } from '../../../../constants'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../../../store/auth/actions'
import api from '../../../../utilities/api'
import Modal from '../../../../components/modal/Modal'

const formValid = ({ formErrors, ...rest }) => {
  let valid = true

  // validate form errors being empty
  Object.values(formErrors).forEach(val => {
    val.length > 0 && (valid = false);
  })

  // validate the form was filled out
  Object.values(rest).forEach(val => {
    val === '' && (valid = false);
  })

  return valid
};

class JobQuestionComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      job_id: this.props.job_id,
      job_questions: [],
      answers: [],
      formErrors: {
        work_exp_comment: "",
      },
      modal: {
        messageKey: null,
        message: '',
        modal: false,
        modalType: '',
        redirect: null,
      },
      disabled: false,
      isLoading: true,
    }
    this.handleState = this.handleState.bind(this)
    this.handleParentClose = this.handleParentClose.bind(this)
  }

  handleState = (newInput) => {this.setState(newInput)}

  componentDidMount() {
    let answers = []
    const formErrors = {...this.state.formErrors}
    this.props.job_questions.map((question, key) => {
      if (question.answer_type === 'free_text') {
        answers.push({
          job_question_id: question.id,
          job_question_answer_id: "",
          free_text_answer: ""
        })
      } else if (question.answer_type === 'single') {
        answers.push({
          job_question_id: question.id,
          job_question_answer_id: "",
          free_text_answer: ""
        })
      } else if (question.answer_type === 'multiple') {
        answers.push({
          job_question_id: question.id,
          job_question_answer_id: [],
          free_text_answer: ""
        })
      }
      if (question.required_answer === 1) {
        formErrors[question.id] = 'thisQuestionRequiresAnswer'
      }

    })
    this.setState({
      job_questions: this.props.job_questions,
      answers: answers,
      formErrors: formErrors,
      disabled: this.props.disabled,
    })
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.setParent({
      modal: {
        messageKey: null,
        message: '',
        modal: false,
        modalType: '',
        redirect: null,
      },
      isLoading: true
    })
    if (formValid(this.state)) {
      const answers = [...this.state.answers.filter((item) =>
        !Array.isArray(item.job_question_answer_id) && 
          (item.job_question_answer_id !== "" || item.free_text_answer !== "")
      )]
      const job_multiple_answers = this.state.answers.filter((item) =>
        Array.isArray(item.job_question_answer_id)
      )

      job_multiple_answers.map((item, key) => {
        item.job_question_answer_id.map((answer, key) => {
          answers.push(
            {
              job_question_id: item.job_question_id,
              job_question_answer_id: answer,
              free_text_answer: ""
            }
          )
        })
      })
      const credentials = {
        job_id: this.state.job_id,
        shared_job_id: this.props.share_job_details ? this.props.share_job_details.shared_job_id : null,
        job_seeker_id: this.props.user.data.job_seeker.id,
        job_questions: answers,
        work_exp_comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, " +
          "sed do eiusmod temporincididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam," +
          " quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
      }

      api.post('api/apply-job', credentials).then(response => {
        this.props.handleJobApply()
      }).catch(error => {
        console.log(error.response.data.error)
        if (error.response.status === 401) {
          this.props.handleRegistrationValidation()
        } else if (error.response.data.error === LANG[localStorage.JobChoiceLanguage].youHaveAlreadyApplied) {
          this.props.setParent({
            modal: {
              messageKey: 'youHaveAlreadyApplied',
              modal: true,
              modalType: 'error',
            },
            isLoading: false
          })
        } else {
          this.props.setParent({
            modal: {
              messageKey: null,
              message: error.response.data.error,
              modal: true,
              modalType: 'error',
              redirect: '/jobs'
            },
            isLoading: false
          })
        }
      })
    }
  }

  handleChange = e => {
    e.preventDefault()
    const { name, value } = e.target
    let formErrors = { ...this.state.formErrors }

    switch (name) {
      case "work_exp_comment":
        formErrors.work_exp_comment =
          value.length < 20 ? LANG[localStorage.JobChoiceLanguage].minimum20 : "";
        break
      default:
        break
    }

    let error = formErrors[parseInt(name)]
    const answers = [...this.state.answers]
    const index = answers.indexOf(answers.filter(function(el) {return el.job_question_id === parseInt(name) ? el : null })[0])

    answers[index].free_text_answer = value
    if (error !== undefined) {
      formErrors[parseInt(name)] =
          answers[index].free_text_answer === "" ? 'thisQuestionRequiresAnswer' : ""
    }
    this.setState({
      formErrors,
      answers: [...answers]
    });
  }

  handleAnswerRadioButton = e => {
    const { name, value } = e.target
    let formErrors = { ...this.state.formErrors }
    const answers = [...this.state.answers]
    let error = formErrors[answers[name].job_question_id]

    answers[name].job_question_answer_id = parseInt(value)
    if (error !== undefined) {
      formErrors[answers[name].job_question_id] =
          answers[name].job_question_answer_id === "" ? 'thisQuestionRequiresAnswer' : ""
    }
    this.setState({
      formErrors,
      answers: [...answers]
    })
  }

  handleAnswerCheckbox = e => {
    const { name, value } = e.target
    let formErrors = { ...this.state.formErrors }
    const answers = [...this.state.answers]
    let error = formErrors[answers[name].job_question_id]

    if(answers[name].job_question_answer_id.filter(function(el) {return el === parseInt(value) ? el : null })[0]) {
      var index = answers[name].job_question_answer_id.indexOf(
        answers[name].job_question_answer_id.filter(function(el) {return el === parseInt(value) ? el : null })[0])
      answers[name].job_question_answer_id.splice(index, 1)

      if (error !== undefined) {
      formErrors[answers[name].job_question_id] =
        answers[name].job_question_answer_id.length === 0 ? 'thisQuestionRequiresAnswer' : ""
      }
    } else {
      answers[name].job_question_answer_id.push(parseInt(value))

      if (error !== undefined) {
        formErrors[answers[name].job_question_id] = ""
      }
    }

    this.setState({
      formErrors,
      answers: [...answers]
    })
  }

  handleParentClose() {
    this.setState({
      modal: {
        messageKey: null,
        message: "",
        modal: false,
        modalType: '',
      }
    })
  }

  renderSingleAnswer = (question, key) => {
    const { formErrors } = this.state
    const answers = this.state.answers.filter(function(el) {return el.job_question_id === question.id ? el : null })[0]

    return (
      <div key={question.id}>
        <p className="applying">
          {key+1}. {question.question}
          {question.required_answer ? <span className="required"><small> ({ LANG[localStorage.JobChoiceLanguage].required }) </small></span> : ""}
        </p>
        <div className="single-answer-list">
          { question.job_question_answers.map((answer, _) => {
              return (
                <div key={answer.id}>
                  <label className="answer-answer" htmlFor="question.question">
                    <input
                      type="radio"
                      noValidate
                      onChange={this.handleAnswerRadioButton}
                      name={key}
                      checked={answers.job_question_answer_id === answer.id}
                      value={answer.id}/>
                    {answer.answer}
                  </label>
                </div>
              )
            })
          }
          {formErrors[question.id] && formErrors[question.id].length > 0 && (
            <div className="errorMessage">{LANG[localStorage.JobChoiceLanguage][formErrors[question.id]]}</div>
          )}
        </div>
      </div>
    )
  }

  renderMultipleAnswer = (question, key) => {
    const { formErrors } = this.state
    const answers = this.state.answers.filter(function(el) {return el.job_question_id === question.id ? el : null })[0]
    return(
      <div key={question.id}>
        <p className="applying">
          {key+1}. {question.question}
          {question.required_answer && <span className="required"><small> ({ LANG[localStorage.JobChoiceLanguage].required }) </small></span>}
        </p>
        <div className="single-answer-list">
          {question.job_question_answers.map((answer, _) => {
            return (
              <div key={answer.id}>
                <label className="answer-answer" htmlFor="question.question">
                  <input
                    type="checkbox"
                    name={key}
                    noValidate
                    onChange={this.handleAnswerCheckbox}
                    checked={answers.job_question_answer_id.filter(function(el) {return el === answer.id ? el : null })[0]}
                    value={answer.id}/>
                  {answer.answer}
                </label>
              </div>
            )
          })}
          {formErrors[question.id] && formErrors[question.id].length > 0 && (
            <div className="errorMessage">{LANG[localStorage.JobChoiceLanguage][formErrors[question.id]]}</div>
          )}
        </div>
      </div>
    )
  }

  renderFreeText = (question, key) => {
    const { formErrors } = this.state
    return(
      <div key={question.id}>
        <p className="applying">
          {key+1}. {question.question}
          {question.required_answer && <span className="required"><small> ({ LANG[localStorage.JobChoiceLanguage].required }) </small></span>}
        </p>
        <div className='free-text'>
          <textarea
            className={`${formErrors.work_exp_comment.length > 0 ? "error" : ''}`}
            name={question.id}
            noValidate
            onChange={this.handleChange}
          />
          {formErrors[question.id] && formErrors[question.id].length > 0 && (
            <div className="errorMessage">{LANG[localStorage.JobChoiceLanguage][formErrors[question.id]]}</div>
          )}
        </div>
      </div>
    )
  }

  render() {
    const { formErrors } = this.state
    return (
      <>
        <p className="applying-header"><strong>{ LANG[localStorage.JobChoiceLanguage].applyforAJob }</strong></p>
        <form className="application-form" onSubmit={this.handleSubmit} noValidate>
          <div className="apply-job-container">
            <div className="apply-job">
              {this.state.job_questions.map((question, key) => {
              if (question.answer_type === 'free_text') {
                return this.renderFreeText(question, key)
              } else if (question.answer_type === 'single') {
                return this.renderSingleAnswer(question, key)
              } else if (question.answer_type === 'multiple') {
                return this.renderMultipleAnswer(question, key)
              }
            })}
            </div>
          </div>
          {this.state.disabled && <><span>{LANG[localStorage.JobChoiceLanguage].thisWillNotBeDisabled}</span><br/></>}
          <div className="submit-row row">
            <button id="submit-button" 
            className={`btn btn-application-valid ${(formValid(this.state) === true) && !this.state.disabled ? 'btn-warning' : 'application-disabled'}`}
            disabled={!formValid(this.state) || this.state.disabled}
            type="submit">{ LANG[localStorage.JobChoiceLanguage].submit }
            </button>

            <Modal
              messageKey={this.state.modal.messageKey}
              show={this.state.modal.modal}
              message={this.state.modal.message}
              type={this.state.modal.modalType}
              redirect={this.state.modal.redirect}
              data={this.state.modal.data}
              handleParentClose={this.handleParentClose}
            />

          </div>
        </form>
      </>
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

export default connect(mapStateToProps, mapDispatchToProps)(JobQuestionComponent)
