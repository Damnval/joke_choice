import React, { Component } from "react"
import './../Register.scss'
import './RegisterForm3.scss'
import api from '../../../../utilities/api'
import InputTextArea from '../../../../components/inputTextArea/InputTextArea'
import JobChoiceLayout from '../../../../layouts/jobChoiceLayout/JobChoiceLayout'
import Modal from '../../../../components/modal/Modal'
import LoadingIcon from '../../../../components/loading/Loading'
import WorkExperienceRow from "../../../../components/accountInformation/workExperienceRow/WorkExperienceRow"
import EducationalBackgroundRow from "../../../../components/accountInformation/educationalBackgroundRow/EducationalBackgroundRow"
import InputFile from "../../../../components/InputFile/InputFile"
import { LANG, EM } from './../../../../constants'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../../../store/auth/actions'
import RegisterBreadcrumbs from "../registerBreadcrumbs/RegisterBreadcrumbs"
import InputRadio from "../../../../components/inputRadio/InputRadio"
import { Image } from "load-image-react"

const fileTypes = ['image/png', 'image/jpeg', 'image/gif']

const formValid = ({ formErrors, form }) => {
  const educList = form.educational_bg
  const workList = form.work_exp
  let educValidList = []
  let workValidList = []

  let valid = true

  Object.values(formErrors).forEach(val => {
    if (val instanceof Array) {
      Object.values(val).forEach(el => {
        Object.values(el).splice(1).forEach(item => {
          item.length > 0 && (valid = false)
        })
      })
    } else {
      val.length > 0 && (valid = false)
    }
  })

  educValidList = educList.filter(el =>
    Object.values(el).splice(1).filter(el => el.trim().length === 0).length > 0 &&
    Object.values(el).splice(1).filter(el => el.trim().length === 0).length < 3
  )

  workValidList = workList.filter(el =>
    Object.values(el).splice(1).filter(el => el.trim().length === 0).length > 0 &&
    Object.values(el).splice(1).filter(el => el.trim().length === 0).length < 4
  )

  return (educValidList.length === 0 && workValidList.length === 0 && (valid))
}

class RegisterForm3 extends Component {
  constructor(props) {
    super(props)

    this.state = {
      form: {
        profile_picture: null,
        marital_status: "",
        about_me: "",
        educational_bg: [
          {
            id:0,
            school: "",
            year: "",
            month: ""
          }
        ],
        work_exp: [
          {
            id:0,
            company: "",
            position: "",
            start_date: "",
            end_date: ""
          }
        ],
        skills: []
      },
      skills: [],
      isLoading: true,
      formErrors: {
        gender: "",
        birthday: "",
        educational_bg: [
          {
            id:0,
            school: "",
            year: "",
            month: ""
          }
        ],
        work_exp: [
          {
            id:0,
            company: "",
            position: "",
            start_date: "",
            end_date: ""
          }
        ],
      },
      modal: {
        messageKey: null,
        message: '',
        modal: false,
        modalType: '',
        redirect: null,
        data: null
      },
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }

  componentDidMount() {
    if (this.props.location.state) {
      const credentials = this.props.location.state.credentials
      let educational_bg = [{
          id:0,
          school: "",
          year: "",
          month: ""
        }]
      let work_exp = [{
          id:0,
          company: "",
          position: "",
          start_date: "",
          end_date: ""
        }]
      let formErrors = {
        gender: "",
        birthday: "",
        educational_bg: [
          {
            id:0,
            school: "",
            year: "",
            month: ""
          }
        ],
        work_exp: [
          {
            id:0,
            company: "",
            position: "",
            start_date: "",
            end_date: ""
          }
        ]}

      if (credentials.educational_bg) {
        educational_bg = [ ...credentials.educational_bg ]
      }

      if (credentials.work_exp) {
        work_exp = [ ...credentials.work_exp ]
      }

      if (this.props.location.state.formErrors && this.props.location.state.formErrors.form3 !== null) {
        formErrors = {...this.props.location.state.formErrors.form3}
      }

      api.get('api/skill').then(response => {
        const credentials = this.props.location.state.credentials
        const skills = response.data.results.skills.map (value => {
          let setSkill = false
          if ( credentials ) {
            setSkill = credentials.skills.filter(function(item) { return item === value.id })[0]
          }
          return({
            id: value.id,
            name: value.name,
            value: setSkill
          })
        })
        this.setState({
          modal: {
            messageKey: 'youCanAlreadyApply',
            message: LANG[localStorage.JobChoiceLanguage].youCanAlreadyApply,
            modal: true,
            modalType: 'success',
          },
          isLoading: false,
          skills: skills,
          form: {
            profile_picture: credentials.job_seeker.profile_picture,
            marital_status: credentials.job_seeker.marital_status,
            about_me: credentials.job_seeker.description,
            educational_bg: educational_bg,
            work_exp: work_exp,
            skills: []
          },
          formErrors: {...formErrors}
        })
      }).catch(error => {
        console.log(error)
        this.setState({
          isLoading: false,
          modal: {
            messageKey: 'serverError',
            message: LANG[localStorage.JobChoiceLanguage].serverError,
            modal: true,
            modalType: 'error',
            redirect: '/',
          }
        })
      })
    } else {
      this.props.history.push('/register/form/1/job_seeker/'+this.props.match.params.token)
    }
  }

  // When using Input and InputTextArea Components
  handleChange = (name, value) => {
    let formErrors = { ...this.state.formErrors }

    this.setState({
      modal: {
        messageKey: null,
        message: '',
        modal: false,
        modalType: '',
        redirect: null,
      },
      formErrors,
      form: {
        ...this.state.form,
        [name]: value,
      }
    })
  }

  handleFile = e => {
    e.preventDefault()
    let reader = new FileReader()
    const file = e.target.files[0]
    if (file) {
      if (!fileTypes.every(type =>file.type !== type)) {
        if(file.size > 5000000) {
          this.setState({
            form: {
              ...this.state.form,
              profile_picture: "",
            },
            formErrors: {
              ...this.state.formErrors,
              profile_picture: "fileSizeTooLarge",
            },
          }, e.target.value = null)
        } else {
          reader.onload = (e) => {
            this.setState({
              form: {
                ...this.state.form,
                profile_picture: e.target.result,
              },
              formErrors: {
                ...this.state.formErrors,
                profile_picture: "",
              },
            })
          }
          reader.readAsDataURL(e.target.files[0])
        }
      } else {
        this.setState({
          form: {
            ...this.state.form,
            profile_picture: "",
          },
          formErrors: {
            ...this.state.formErrors,
            profile_picture: "invalidFileType",
          },
        }, e.target.value = null)
      }
    }
  }

  // When using deep fields with Input Components
  handleChangeFormList = (field, value) => {
    let formField = [...this.state.form[field.name]]
    let errorList = [...this.state.formErrors[field.name]]
    let limit = (field.name === "educational_bg") ? 3 :
      (field.name === "work_exp") ? 4 : 0

    formField[field.key][field.attr] = value

    // Checks if all fields are inputted
    let currentFieldKeys = Object.keys(formField[field.key]).splice(1)

    if (currentFieldKeys.filter(el => {return formField[field.key][el].length === 0} ).length > 0 &&
        currentFieldKeys.filter(el => {return formField[field.key][el].length === 0} ).length < limit) {

      const invalidList = currentFieldKeys.map(el => {
        return (typeof formField[field.key][el] === 'string' &&
                formField[field.key][el].trim().length === 0 ?
                [el, "requiredInput"] : [el, ""])
      })

      invalidList.forEach(el => {
        errorList[field.key][el[0]] = el[1]
      })

    } else if (currentFieldKeys.filter(el => {return formField[field.key][el].length === 0} ).length === 0) {
      const invalidList = currentFieldKeys.map(el => {
        return (typeof formField[field.key][el] === 'string' &&
                formField[field.key][el].trim().length === 0 ?
                [el, "requiredInput"] : [el, ""])
      })
      invalidList.forEach(el => {
        errorList[field.key][el[0]] = el[1]
      })
    } else {
      currentFieldKeys.forEach(el => {
        errorList[field.key][el] = ""
      })
    }
    if (field.name === "work_exp") {
      (formField[field.key].end_date < formField[field.key].start_date) ?
        errorList[field.key].end_date = 'invalidDateRange'
        : errorList[field.key].end_date = ""
    }else if (field.name === 'educational_bg') {
      const moment = require('moment')
      if (formField[field.key].year && formField[field.key].month) {
        const dateSet = moment(`${formField[field.key].year}/${formField[field.key].month}`, "YYYY/MMMM")
        errorList[field.key].month = (dateSet > moment()) ? 'invalidDateInput' : ""
      }
    }

    this.setState({
      modal: {
        messageKey: null,
        message: '',
        modal: false,
        modalType: '',
        redirect: null,
      },
      form: {
        ...this.state.form,
        [field.name]: formField,
      },
      formErrors: {
        ...this.state.formErrors,
        [field.name]: errorList
      }
    })
  }

  toggleSkill = (e, field) => {
    const obj = [...this.state[field]]
    const name = e.target.name
    obj[name].value = !obj[name].value
    this.setState({
      [field]: obj
    })
  }

  handleSubmit = e => {
    e.preventDefault();
    let {...credentials} = this.props.location.state.credentials
    const formInfo = this.state.form
    const skillSet = this.state.skills.filter(el => el.value).map (el => {
      return el.id
    })

    this.setState({
      isLoading:true,
      modal: {
        messageKey: null,
        message: '',
        modal: false,
        modalType: '',
        redirect: null,
      }
    }, () => {
      let workList = Object.values([...this.state.form.work_exp]).filter(el => {
        return (
          Object.values(el).splice(1).every(field => field !== "")
        )
      })

      let educList = Object.values([...this.state.form.educational_bg]).filter(el => {
        return (
          Object.values(el).splice(1).every(field => field !== "")
        )
      })
      credentials = {
        ...credentials,
        job_seeker: {
          ...credentials.job_seeker,
          marital_status: formInfo.marital_status,
          description: formInfo.about_me,
          profile_picture: formInfo.profile_picture
        },
        work_exp: workList,
        educational_bg: educList,
        skills: skillSet
      }
      api.post('api/register/details', credentials).then(response => {
        this.setState({
          isLoading: false,
          modal: {
            messageKey: 'thankYouForRegistering',
            message: LANG[localStorage.JobChoiceLanguage].thankYouForRegistering,
            modal: true,
            modalType: 'success',
            redirect: `/verify/${this.props.match.params.token}`,
            data : {
              credentials: credentials
            }
          }
        })
      }).catch(error => {
        console.log(error)
        this.setState({
          isLoading: false,
          modal: {
            messageKey: 'serverError',
            message: LANG[localStorage.JobChoiceLanguage].serverError,
            modal: true,
            modalType: 'error',
            redirect: '/',
          }
        })
      })
    })
  }

  addRow = (e, key, field) => {
    e.preventDefault()
    const list = this.state.form[field]
    const errorList = this.state.formErrors
    const newInput =  (field === "educational_bg") ?
                      { id: key+1,
                        school: "",
                        year: "",
                        month: "" } :
                      { id: key+1,
                        company: "",
                        position: "",
                        start_date: "",
                        end_date: ""}
    this.setState({
      form: {
        ...this.state.form,
        [field]: [
          ...list,
          newInput
        ]
      },
      formErrors: {
        ...errorList,
        [field]: [
          ...errorList[field],
          {...newInput}
        ]
      }
    })
  }

  removeRow = (e, key, field) => {
    e.preventDefault()
    const list = this.state.form[field]
    const errorList = this.state.formErrors
    this.setState({
      form: {
        ...this.state.form,
        [field]: list.filter(el => el.id !== key)
      },
      formErrors: {
        ...errorList,
        [field]: errorList[field].filter(el => el.id !== key)
      }
    })
  }

  backPage = () => {

    let {...credentials} = this.props.location.state.credentials
    const formInfo = this.state.form
    const skillSet = this.state.skills.filter(el => el.value).map (el => {
      return el.id
    })

    let workList = this.state.form.work_exp

    let educList = this.state.form.educational_bg

    credentials = {
      ...credentials,
      job_seeker: {
        ...credentials.job_seeker,
        marital_status: formInfo.marital_status,
        description: formInfo.about_me,
        profile_picture: formInfo.profile_picture
      },
      work_exp: workList,
      educational_bg: educList,
      skills: skillSet
    }

    this.props.history.push({pathname:`/register/form/2/${this.props.match.params.token}`,
      state:{
        data: {
          credentials: credentials,
          hataraki_kata: credentials.hataraki_kata,
          formErrors: {
            form3: {
              ...this.state.formErrors
            }
          }
        }
      }
    })

  }

  handleClose = () => {
    this.setState({
      modal: {
        messageKey: null,
        message: '',
        modal: false,
        modalType: '',
        redirect: null,
      }
    })
  }

  render() {
    const profile_picture = this.state.form.profile_picture ? this.state.form.profile_picture :
      require('../../../../assets/img/job-avatar.jpg')
  return (
    <div>
      <JobChoiceLayout className="jobchoice-body">
      {!this.state.isLoading && <div className="container">
        <div className="row">
          <div className="col-lg-12 col-xl-10 offset-xl-1">
            <RegisterBreadcrumbs step={3} />
            <div className="register-card">
              <h1 className="register-card-title">{ LANG[localStorage.JobChoiceLanguage].profileInformation }</h1>
              <form onSubmit={this.handleSubmit} noValidate>
                <div className="register-card-body">
                  <div className="form-box no-border register-center-object">
                    <div className="field-row form3-row">
                      <div className="profile-picture-container">
                        <label className="register-file" htmlFor='file'>
                          <span>
                            { LANG[localStorage.JobChoiceLanguage].facePhoto }
                            <span className="optional-badge">
                              <small> {LANG[localStorage.JobChoiceLanguage].optional} </small>
                            </span>:
                          </span>
                          <label className="btn btn-primary btn-profile-picture" htmlFor="profile_picture">
                            { LANG[localStorage.JobChoiceLanguage].selectImage }
                          </label>
                        </label>
                        <div className="profile-picture-border-container">
                          <div className="profile-picture">
                            <Image
                              src={profile_picture}
                              alt={LANG[localStorage.JobChoiceLanguage].thumbnail} className={this.state.form.profile_picture ? '' : 'default-profile-picture'}
                              loadOptions={{
                                downsamplingRatio: 0.5,
                                maxWidth: 179,
                                maxHeight: 179,
                                cover: true
                              }}
                            />
                          </div>
                          <div className="profile-picture-description">
                            { LANG[localStorage.JobChoiceLanguage].registerFrontFace }
                          </div>
                        </div>
                        <InputFile
                          className="input-field profile-picture-hidden-input"
                          id="profile_picture"
                          error={this.state.formErrors.profile_picture}
                          handleChange={this.handleFile}
                        />
                        {(this.state.formErrors.profile_picture && this.state.formErrors.profile_picture.length > 0) && (
                          <span className="errorMessage">{LANG[localStorage.JobChoiceLanguage][this.state.formErrors.profile_picture]}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="form-box no-border">
                    <InputRadio
                      id="marital_status"
                      field="marital_status"
                      value={this.state.form.marital_status}
                      label={LANG[localStorage.JobChoiceLanguage].areYouMarried}
                      options={EM[localStorage.JobChoiceLanguage].BIQUESTION}
                      onChange={this.handleChange}
                      additionalStyle="registration-form-3-marital-status"
                      additionalStyleUpperDiv="register-center-object"
                    />
                  </div>
                  <div className="form-box no-border">
                    <div>
                      <strong>
                        { LANG[localStorage.JobChoiceLanguage].educationalBackground }
                          <span className="optional-badge">
                            <small> {LANG[localStorage.JobChoiceLanguage].optional} </small>
                          </span>
                      </strong>
                    </div>
                    {this.state.form.educational_bg.map((value, key) => {
                      return (
                        <EducationalBackgroundRow
                          className="register-educational-bg"
                          key={key}
                          id={value.id}
                          num={key}
                          max={this.state.form.educational_bg.length}
                          school={{name: "educational_bg", key: key, attr: "school"}}
                          year_educ={{name: "educational_bg", key: key, attr: "year"}}
                          month_educ={{name: "educational_bg", key: key, attr: "month"}}
                          error= {this.state.formErrors.educational_bg[key]}
                          errorKey= {this.state.formErrors.educational_bg[key]}
                          value={this.state.form.educational_bg[key]}
                          isEditing={true}
                          addRow={this.addRow}
                          removeRow={this.removeRow}
                          handleChange={this.handleChangeFormList}
                          schoolClassName="register-educ-background-field"
                          ifError={(Object.values(
                            this.state.formErrors.educational_bg[key]).splice(1).filter(
                              el => el !== "").length > 0)}
                        />
                      )
                    })}
                  </div>
                  <div className="form-box full-width no-border">
                    <p><strong>
                      { LANG[localStorage.JobChoiceLanguage].possessionSkills }
                      <span className="optional-badge">
                        <small> {LANG[localStorage.JobChoiceLanguage].optional} </small>
                      </span>
                    </strong></p>
                    <div className="skill-set">
                      {this.state.skills.map((value, key) => {
                        return (
                          <label key={key} className="checkbox">
                            <input
                              id={key}
                              name={key}
                              type="checkbox"
                              checked={value.value}
                              onChange={e => this.toggleSkill(e, 'skills')} />
                            <span className="label-checkbox">{value.name}</span>
                          </label>
                        )
                      })}
                    </div>
                    <InputTextArea
                      label={ LANG[localStorage.JobChoiceLanguage].qualificationExperiencePR }
                      field='about_me'
                      placeholderKey="aboutMePlaceholder"
                      value={this.state.form.about_me}
                      onChange={this.handleChange}
                      inputStyles="about-me-registration-form"
                      isRegistering={true}
                    />
                  </div>
                  <div className="form-box flex-col justify-flex-start no-border">
                  </div>
                  <div className="form-box no-border">
                    <div>
                      <strong>
                        { LANG[localStorage.JobChoiceLanguage].workExperience }
                        <span className="optional-badge">
                          <small> {LANG[localStorage.JobChoiceLanguage].optional} </small>
                        </span>
                      </strong>
                    </div>
                    {this.state.form.work_exp.map((value, key) => {
                      return (
                        <WorkExperienceRow
                          key={key}
                          id={value.id}
                          num={key}
                          max={this.state.form.work_exp.length}
                          company={{name: "work_exp", key: key, attr: "company"}}
                          position={{name: "work_exp", key: key, attr: "position"}}
                          start_date={{name: "work_exp", key: key, attr: "start_date"}}
                          end_date={{name: "work_exp", key: key, attr: "end_date"}}
                          error= {this.state.formErrors.work_exp[key]}
                          errorKey= {this.state.formErrors.work_exp[key]}
                          value={this.state.form.work_exp[key]}
                          isEditing={true}
                          addRow={this.addRow}
                          removeRow={this.removeRow}
                          handleChange={this.handleChangeFormList}
                          ifError={(Object.values(
                            this.state.formErrors.work_exp[key]).splice(1).filter(
                              el => el !== "").length > 0)}
                        />
                      )
                    })}
                  </div>
                  <div className="submit-form-3 submit-flex-row-space-between">
                    <button
                      className="btn btn-outline-secondary btn-register-size"
                      onClick={this.backPage}
                      type="submit">
                      { LANG[localStorage.JobChoiceLanguage].modalEmailBackBtn }
                    </button>
                    <button
                      type="submit"
                      disabled={!formValid(this.state)}
                      className={`btn-register-size ${formValid(this.state) === true ? "btn btn-success" : 'btn btn-light'}`}
                    >
                      { LANG[localStorage.JobChoiceLanguage].register }
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>}

      <Modal
        show={this.state.modal.modal}
        message={this.state.modal.message}
        messageKey={this.state.modal.messageKey}
        type={this.state.modal.modalType}
        redirect={this.state.modal.redirect}
        data={this.state.modal.data}
        handleParentClose={this.handleClose}
      />

      <LoadingIcon show={this.state.isLoading} />
      </JobChoiceLayout>
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

export default connect(mapStateToProps, mapDispatchToProps)(RegisterForm3)
