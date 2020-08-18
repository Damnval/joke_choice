import React, { Component } from 'react'
import '../JobOfferDetail.scss'
import { Button } from 'react-bootstrap'
import { Radio } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { LANG } from '../../../../constants'
import { connect } from 'react-redux'
import { uniqueId } from 'lodash'

const formValid = ({ formErrors, section5 }) => {
  let valid = true
  let hasData = false

  section5.job_questions.map((value, key) => {
    Object.values(value).forEach(val => {
      (((typeof val === 'string' && val.trim().length > 0) || val.length > 0)) && (hasData = true)
    })

    if(hasData) {
      Object.values(value).forEach(val => {
        val.length === 0 && (valid = false)
        if(Array.isArray(val) && val.length > 0) {
          val.map((answer, key) => {
            Object.values(answer).forEach(answerVal => {
              answerVal.length === 0 && (valid = false)
            })
          })
        }
      })
    }
  })

  return valid
}

const requiredOptions = [
  {
    value: 0,
    en: "Not Required",
    jp: "任意回答にする",
  },
  {
    value: 1,
    en: "Required",
    jp: "必須回答にする",
  },
]

const answerFormOptions = [
  {
    value: 'single',
    en: 'Single Choice',
    jp: '単一選択',
  },
  {
    value: 'multiple',
    en: 'Multiple Selection',
    jp: '複数選択',
  },
  {
    value: 'free_text',
    en: 'Input Field',
    jp: '入力欄',
  },
]

class JobOfferEditorSection5 extends Component {
  constructor(props) {
    super(props)

    this.state = {
      section5: {
        job_questions: [
          {
            id: 0,
            question: '',
            answer_type: '',
            required_answer: '',
            answers: [],
          }
        ],
      },
      formErrors: {
        job_questions: [
          {
            id: 0,
            question: '',
            answer_type: '',
            required_answer: '',
            answers: [],
          }
        ],
      },
      idCounter: 0,
      loadNow: false,
    }
    
    this.handleFormError = this.handleFormError.bind(this)
  }

  componentDidMount() {
    if(this.props.initialData.job_questions.length > 0) {
      const job_questions = this.props.initialData.job_questions.map((question, key1) => {
        if(question.answer_type !== "free_text") {
          const answers = question.job_question_answers.map((answer, key2) => {
            return ({
              field: answer.answer,
              id: key2,
            })
          })
          return ({
            id: key1,
            question: question.question,
            answer_type: question.answer_type,
            required_answer: question.required_answer,
            answers: answers,
          })
        } else {
          return ({
            id: key1,
            question: question.question,
            answer_type: question.answer_type,
            required_answer: question.required_answer,
          })
        }
      })

      const form_errors = this.props.initialData.job_questions.map((question, key1) => {
        if(question.answer_type !== "free_text") {
          const answers = question.job_question_answers.map((answer, key2) => {
            return ({
              field: '',
              id: key2,
            })
          })
          return ({
            id: key1,
            question: '',
            answer_type: '',
            required_answer: '',
            answers: answers,
          })
        } else {
          return ({
            id: key1,
            question: '',
            answer_type: '',
            required_answer: '',
          })
        }
      })

      this.setState({
        section5: {
          ...this.state.section5,
          job_questions: job_questions,
        },
        formErrors: {
          ...this.state.formErrors,
          job_questions: form_errors,
        },
        idCounter: this.state.section5.job_questions.length + 1,
      }, () => {
        this.setState({loadNow: true,})
        const newData = {...this.state.section5}
        this.props.retrievedData("section5", newData, true)
        this.props.loadNow('section5')
      })
    } else {
      this.props.loadNow('section5')
      this.setState({loadNow: true,})
    }
  }

  //==================Questions==========================
  handleInputChange(key, name, e) {
    var value = ""
    if(name === "answer_type" || name === "required_answer") {
      value = e
    } else {
      value = e.target.value
    }

    const index = this.state.section5.job_questions.findIndex(formError => formError.id === key)

    let newSection5= this.state.section5
    newSection5.job_questions[index][name] = value

    if(name === "answer_type" && value === "free_text") {
      delete newSection5.job_questions[index].answers
    }

    //FormErrors
    let formErrors= this.state.formErrors
    let required = false

    Object.values(this.state.section5.job_questions[index]).forEach(val => {
      val !== null && val.length > 0 && (required = true)
    })

    if(name === 'required_answer') {
      required = this.state.section5.job_questions[index].required_answer !== undefined ? true : required
    }

    if(required === true) {
      formErrors.job_questions[index].question = this.state.section5.job_questions[index].question === null || this.state.section5.job_questions[index].question.length === 0 ? LANG[localStorage.JobChoiceLanguage].thisIsRequired : ''
      formErrors.job_questions[index].answer_type = this.state.section5.job_questions[index].answer_type === null || this.state.section5.job_questions[index].answer_type.length === 0 ? LANG[localStorage.JobChoiceLanguage].thisIsRequired : ''
      formErrors.job_questions[index].required_answer = this.state.section5.job_questions[index].required_answer === null || this.state.section5.job_questions[index].required_answer.length === 0 ? LANG[localStorage.JobChoiceLanguage].thisIsRequired : ''
    } else {
      formErrors.job_questions[index].question = ''
      formErrors.job_questions[index].answer_type = ''
      formErrors.job_questions[index].required_answer = ''
    }

    if(name === 'question') {
      formErrors.job_questions[index].question = value !== null && value.length > 100 ? LANG[localStorage.JobChoiceLanguage].additionalQuestionApply + LANG[localStorage.JobChoiceLanguage].maxCharacters1 + '100' + LANG[localStorage.JobChoiceLanguage].maxCharacters2 : required === true && (value === null || value.length === 0) ? LANG[localStorage.JobChoiceLanguage].thisIsRequired : ''
    }

    this.setState({
      section5: newSection5,
      formErrors: formErrors,
    }, () => {
      if(name === "answer_type" && value !== "free_text") {
        this.setInitialAnswer(index)
      }
      const newData = {...this.state.section5}
      this.props.retrievedData("section5", newData, formValid(this.state))
    });
  }

  addQuestion() {
    const newArray1 = this.state.section5.job_questions.slice()
    newArray1.push({
      id: this.state.idCounter + 1,
      question: '',
      answer_type: '',
      required_answer: '',
      answers: [],
    })

    const newArray2 = this.state.formErrors.job_questions.slice()
    newArray2.push({
      id: this.state.idCounter + 1,
      question: '',
      answer_type: '',
      required_answer: '',
      answers: [],
    })

    this.setState({
      idCounter: this.state.idCounter + 1,
      section5: {
        ...this.state.section5,
        job_questions: newArray1
      },
      formErrors: {
        ...this.state.formErrors,
        job_questions: newArray2
      },
    })
  }

  deleteQuestion(id) {
    const section5 = this.state.section5.job_questions.filter(question => question.id !== id)
    const formErrors = this.state.formErrors.job_questions.filter(formError => formError.id !== id)
    this.setState({
      section5: {
        ...this.state.section5, 
        job_questions: section5
      },
      formErrors: {
        ...this.state.formErrors, 
        job_questions: formErrors
      },
    }, () => {
      const newData = {...this.state.section5}
      this.props.retrievedData("section5", newData, formValid(this.state))
    })
  }

  setInitialAnswer(key) {
    var job_questions = this.state.section5.job_questions;
    job_questions[key].answers = [{
      id: 0,
      field: '',
    }]

    var formErrors = this.state.formErrors.job_questions;
    formErrors[key].answers = [{
      id: 0,
      field: LANG[localStorage.JobChoiceLanguage].thisIsRequired,
    }]

    this.setState({
      formErrors: {
        ...this.state.formErrors,
        job_questions: formErrors,
      },
      section5: {
        ...this.state.section5,
        job_questions: job_questions,
      }
    }, () => {
      const newData = {...this.state.section5}
      this.props.retrievedData("section5", newData, formValid(this.state))
    });
  }

  //==================Answers==========================
  handleInputAnswerChange(questionKey, answerKey, name, e) {
    const value = e.target.value

    const indexQuestion = this.state.section5.job_questions.findIndex(formError => formError.id === questionKey)
    const indexAnswer = this.state.section5.job_questions[indexQuestion].answers.findIndex(formError => formError.id === answerKey)

    let updatedQuestions = this.state.section5.job_questions
    updatedQuestions[indexQuestion].answers[indexAnswer][name] = value

    let newFormError= this.state.formErrors.job_questions
    newFormError[indexQuestion].answers[indexAnswer][name] = value.length < 1 ? LANG[localStorage.JobChoiceLanguage].thisIsRequired : ""

    this.setState({
      formErrors: {
        ...this.state.formErrors,
        job_questions: newFormError
      },
      section5: {
        ...this.state.section5,
        job_questions: updatedQuestions,
      }
    }, () => {
      const newData = {...this.state.section5}
      this.props.retrievedData("section5", newData, formValid(this.state))
    })
  }

  addAnswer(key) {
    const index = this.state.section5.job_questions.findIndex(question => question.id === key)
    const newQuestionArray1 = this.state.section5.job_questions.slice()
    newQuestionArray1[index].answers.push({
      id: newQuestionArray1[index].answers.length + Number(uniqueId()),
      field: '',
    })

    const newQuestionArray2 = this.state.formErrors.job_questions.slice()
    const indexFormError = this.state.formErrors.job_questions.findIndex(formError => formError.id === key)
    newQuestionArray2[indexFormError].answers.push({
      id: newQuestionArray2[indexFormError].answers.length + Number(uniqueId()),
      field: LANG[localStorage.JobChoiceLanguage].thisIsRequired,
    })

    this.setState({
      section5: {
        ...this.state.section5,
        job_questions: newQuestionArray1
      },
      formErrors: {
        ...this.state.formErrors,
        job_questions: newQuestionArray2
      },
    }, () => {
      const newData = {...this.state.section5}
      this.props.retrievedData("section5", newData, formValid(this.state))
    })
  }

  deleteAnswer(questionId, answerId) {
    const indexQuestion = this.state.section5.job_questions.findIndex(formError => formError.id === questionId)

    var section5 = this.state.section5.job_questions
    const dummyAnswers = section5[indexQuestion].answers.filter(answer => answer.id !== answerId)
    section5[indexQuestion].answers = dummyAnswers

    var formErrors = this.state.formErrors.job_questions
    const dummyFormErrors = formErrors[indexQuestion].answers.filter(formError => formError.id !== answerId)
    formErrors[indexQuestion].answers = dummyFormErrors

    this.setState({
      section5: {
        ...this.state.section5, 
        job_questions: section5
      },
      formErrors: {
        ...this.state.formErrors, 
        job_questions: formErrors
      },
    }, () => {
      const newData = {...this.state.section5}
      this.props.retrievedData("section5", newData, formValid(this.state))
    })
  }

  handleFormError(name, questionKey, answerKey) {
    let formError = ""
    let required = false

    Object.values(this.state.section5.job_questions[questionKey]).forEach(val => {
      if(val !== null && val.length > 0) {
        required = true
      }
    })

    required = this.state.section5.job_questions[questionKey].required_answer !== null && (this.state.section5.job_questions[questionKey].required_answer === 0 || this.state.section5.job_questions[questionKey].required_answer === 1) ? true : required
    
    switch (name) {
      case "question":
        formError = this.state.section5.job_questions[questionKey].question !== null && this.state.section5.job_questions[questionKey].question.length > 100 ? LANG[localStorage.JobChoiceLanguage].additionalQuestionApply + LANG[localStorage.JobChoiceLanguage].maxCharacters1 + '100' + LANG[localStorage.JobChoiceLanguage].maxCharacters2 : required && (this.state.section5.job_questions[questionKey].question === null || this.state.section5.job_questions[questionKey].question.length === 0) ? LANG[localStorage.JobChoiceLanguage].thisIsRequired : ''
        break
      case "answer_type":
      case "required_answer":
        formError = required && (this.state.section5.job_questions[questionKey][name] === null || this.state.section5.job_questions[questionKey][name].length === 0) ? LANG[localStorage.JobChoiceLanguage].thisIsRequired : ''
        break
      case "answer":
        formError = required && (this.state.section5.job_questions[questionKey].answers[answerKey].field === null || this.state.section5.job_questions[questionKey].answers[answerKey].field.length === 0) ? LANG[localStorage.JobChoiceLanguage].thisIsRequired : ""
      default:
        break
    }

    return formError
  }

  initializeQuestion() {
    this.setState({
      section5: {
        job_questions: [
          {
            id: 0,
            question: '',
            answer_type: '',
            required_answer: '',
            answers: [],
          }
        ],
      },
      formErrors: {
        job_questions: [
          {
            id: 0,
            question: '',
            answer_type: '',
            required_answer: '',
            answers: [],
          }
        ],
      },
      idCounter: 0,
    }, () => {
      const newData = {...this.state.section5}
      this.props.retrievedData("section5", newData, formValid(this.state))
    })
  }

  render() {
    return (
      <div className="createJob-section-bg">
        <div className="section-break no-margin-top">
          {this.state.loadNow && this.state.section5.job_questions.map((value, key) => {
            return (
              <div key={value.id} className="createJob-inputArea">

                <div className="input-field createJob-sameline">
                  <div className="createJob-deletable">
                    <label htmlFor={`question${value.id}`}>
                      {LANG[localStorage.JobChoiceLanguage].additionalQuestionApply}{` ${key + 1}`}
                      {this.handleFormError('question', key, null).length > 0 && <span className="required-badge"><small> {LANG[localStorage.JobChoiceLanguage].required} </small></span>}:
                    </label>
                  </div>
                  <div className="createJob-sameline-right-smaller">
                    <textarea
                      className={`resize-textarea ${this.state.formErrors.job_questions[key].question && this.state.formErrors.job_questions[key].question.length > 0 ? "error" : ''}`}
                      name={`question${value.id}`}
                      value={value.question}
                      noValidate
                      onChange={(e) => this.handleInputChange(value.id, 'question', e)}
                    />
                    {this.state.section5.job_questions.length > 1 &&
                      <Button onClick={() => this.deleteQuestion(value.id)} className="close-button"><FontAwesomeIcon icon="window-close" /></Button>
                    }
                    {this.state.section5.job_questions.length === 1 &&
                      <Button onClick={() => this.initializeQuestion()} className="close-button"><FontAwesomeIcon icon="window-close" /></Button>
                    }
                  </div>
                </div>
                {this.handleFormError('question', key, null).length > 0 ?
                  <span className="errorMessage">{this.handleFormError('question', key, null)}</span> :
                  <div className="errorNone"></div>
                }

                <div className="input-field">
                  <div name={`required${value.id}`} className="input-radio-area createJob-radio-inliner">
                    {this.handleFormError('required_answer', key, null).length > 0 && <><span className="required-badge job-badge"><small> {LANG[localStorage.JobChoiceLanguage].required} </small></span><br/></>}
                    {requiredOptions.map((option) => {
                      return (
                        <div className="input-radio-individual" key={option.value}>
                          <Radio 
                            className="input-radio-click" 
                            name={`required${value.id}`}
                            value={value.required_answer} 
                            checked={option.value === this.state.section5.job_questions[key].required_answer}
                            onChange={() => this.handleInputChange(value.id, 'required_answer', option.value)}>
                            { localStorage.JobChoiceLanguage === "JP" ? option.jp : option.en }
                            </Radio>
                        </div>
                      )
                    })}
                  </div>
                  {this.handleFormError('required_answer', key, null).length > 0 ?
                    <span className="errorMessage">{this.handleFormError('required_answer', key, null)}</span> :
                    <div className="errorNone"></div>
                  }
                </div>

                <div className="input-field createJob-sameline">
                  <label htmlFor={`answerForm${value.id}`}>{LANG[localStorage.JobChoiceLanguage].answerForm} {this.handleFormError('answer_type', key, null).length > 0 && <span className="required-badge"><small> {LANG[localStorage.JobChoiceLanguage].required} </small></span>}:</label>
                  <div name={`answerForm${value.id}`} className="input-radio-area createJob-radio-inliner">
                    {answerFormOptions.map((option) => {
                      return (
                        <div className="input-radio-individual" key={option.value}>
                          <Radio 
                            className="input-radio-click" 
                            name={`answerFormSpecific${value.id}`}
                            value={value.answer_type} 
                            checked={option.value === this.state.section5.job_questions[key].answer_type}
                            onChange={() => this.handleInputChange(value.id, 'answer_type', option.value)}>
                            { localStorage.JobChoiceLanguage === "JP" ? option.jp : option.en }
                            </Radio>
                        </div>
                      )
                    })}
                  </div>
                  {this.handleFormError('answer_type', key, null).length > 0 ?
                    <span className="errorMessage">{this.handleFormError('answer_type', key, null)}</span> :
                    <div className="errorNone"></div>
                  }
                </div>

                <div className="input-field">
                  <label htmlFor={`answers${value.id}`}>{LANG[localStorage.JobChoiceLanguage].answerItem} :</label>
                  {this.state.section5.job_questions[key].answer_type === "" && 
                    <div><span>{LANG[localStorage.JobChoiceLanguage].chooseAnswerType}</span></div>
                  }
                  {this.state.section5.job_questions[key].answer_type === "free_text" && 
                    <div><span>{LANG[localStorage.JobChoiceLanguage].answersInputField}</span></div>
                  }
                  {this.state.section5.job_questions[key].answers && this.state.section5.job_questions[key].answer_type !== "free_text" &&
                    <div className="createJob-answer-area">
                      {this.state.section5.job_questions[key].answers.map((answer, key2) => {
                        return (
                          <div key={key2}>
                            <div className="input-field createJob-answer-deletable">
                            {this.handleFormError('answer', key, key2).length > 0 && <><span className="required-badge job-badge"><small> {LANG[localStorage.JobChoiceLanguage].required} </small></span><br/><br/></>}
                              <input
                                id={`question${value.id}answer${answer.id}`}
                                className={this.state.formErrors.job_questions[key].answers[key2].field && this.state.formErrors.job_questions[key].answers[key2].field.length > 0 ? "error" : ''}
                                value={answer.field}
                                type="text"
                                name={`question${value.id}answer${answer.id}`}
                                noValidate
                                onChange={(e) => this.handleInputAnswerChange(value.id, answer.id, 'field', e)}
                              />
                              {this.state.section5.job_questions[key].answers.length > 1 &&
                                <Button onClick={() => this.deleteAnswer(value.id, answer.id)} className="close-button"><FontAwesomeIcon icon="window-close" /></Button>
                              }
                            </div>
                            {this.handleFormError('answer', key, key2).length > 0 ?
                              <span className="errorMessage">{this.handleFormError('answer', key, key2)}</span> :
                              <div className="errorNone"></div>
                            }
                          </div>
                        )
                      })}
                      {this.state.section5.job_questions[key].answer_type !== null && this.state.section5.job_questions[key].answer_type.length > 1 &&
                        <div className="createJob-answer-footer">
                          <Button onClick={() => this.addAnswer(value.id)} className="createJob-add-button"><FontAwesomeIcon icon="plus-circle" /></Button>
                        </div>
                      }
                    </div>
                  }
                  
                </div>
              </div>
            )})
          }
        </div>
        <div className="createJob-section-footer">
          <Button onClick={() => this.addQuestion()}>{LANG[localStorage.JobChoiceLanguage].addTo}</Button>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return state
}

export default connect(mapStateToProps)(JobOfferEditorSection5)
