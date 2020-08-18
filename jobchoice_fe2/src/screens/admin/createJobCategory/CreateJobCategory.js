import React, { Component } from 'react'
import './CreateJobCategory.scss'
import api from '../../../utilities/api'
import JobChoiceLayout from '../../../layouts/jobChoiceLayout/JobChoiceLayout'
import Modal from '../../../components/modal/Modal'
import LoadingIcon from '../../../components/loading/Loading'
import Input from '../../../components/input/Input'
import InputTextArea from '../../../components/inputTextArea/InputTextArea'
import { LANG } from '../../../constants'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../../store/auth/actions'
import {Breadcrumb} from 'react-bootstrap'

const formValid = ({ formErrors, form }) => {
  let valid = true

  Object.values(formErrors).forEach(val => {
    val.length > 0 && (valid = false)
  })

  // validate form errors being empty
  Object.values(form).forEach(val => {
    (val.length === 0) && (valid = false)
  })

  return valid
}

class CreateJobCategory extends Component {
  constructor(props) {
    super(props)
    
    this.state = {
      form: {
        category: '',
        description: ''
      },
      isLoading: false,
      modal: {
        messageKey: null,
        message: '',
        modal: false,
        modalType: '',
        redirect: null,
      },
      formErrors: {
        description: ""
      }
    }

    this.changeInput = this.changeInput.bind(this)

  }

  componentDidMount() {

    this.setState({
      credentials: this.props.location.state
    })

  }

  handleSubmit = e => {
    e.preventDefault()
    this.setState({
      modal: {
        messageKey: null,
        message: '',
        modal: false,
        modalType: '',
        redirect: null,
      },
      isLoading: true
    })

    const credentials = {...this.state.form}
    api.post('api/manage/job-category', credentials).then(response => {
      this.setState({
        isLoading: false,
        modal: {
          messageKey: 'successfullyCreatedJobCategory',
          message: LANG[localStorage.JobChoiceLanguage].successfullyCreatedJobCategory,
          modal: true,
          modalType: 'success',
          redirect: '../../admin/manage/job-categories',
        }
      })
    }).catch(error => {
      let log = error.response.data.error
      try {
        log = Object.entries(JSON.parse(error.response.data.error))
        this.setState({
          isLoading: false,
          modal: {
            messageKey: null,
            message: log[0][1][0],
            modal: true,
            modalType: 'error',
          }
        })
      } catch (e) {
        console.log(e)
        this.setState({
          isLoading: false,
          modal: {
            messageKey: null,
            message: log,
            modal: true,
            modalType: 'error',
          }
        })
      }
    })

  }

  changeInput = (input, value) => {
    
    let error = ""

    if (input === "description" && value.length < 10) {
      error = LANG[localStorage.JobChoiceLanguage].minimum10
    }

    this.setState({
      formErrors: {
        ...this.state.formErrors,
        description: error
      },
      form : {
        ...this.state.form,
        [input]: value
      }
    })
  }

  render() {

    return (
      <div>
        <JobChoiceLayout className="jobchoice-body">
        <Breadcrumb className="breadcrumb-hataraki-kata">
            <Breadcrumb.Item href="/home">{ LANG[localStorage.JobChoiceLanguage].dashboard }</Breadcrumb.Item>/
            <Breadcrumb.Item href="/admin/manage/job-categories">{ LANG[localStorage.JobChoiceLanguage].manageJobCategories }</Breadcrumb.Item>/
            <Breadcrumb.Item active>{ LANG[localStorage.JobChoiceLanguage].createdJobCategory }</Breadcrumb.Item>
        </Breadcrumb>
        <div className="flex container">
          <div className="information-wrapper">
            <h1>{ LANG[localStorage.JobChoiceLanguage].createdJobCategory }</h1>
            <form onSubmit={this.handleSubmit} noValidate>
              <div className="form-row">
                <Input
                  label={ LANG[localStorage.JobChoiceLanguage].categoryTitle }
                  field='category'
                  value={this.state.form.category}
                  onChange={this.changeInput}
                  maxLength="50"
                  required={true}
                />
              </div>
              <div className="form-row">
                <InputTextArea
                  label={ LANG[localStorage.JobChoiceLanguage].categoryDescription }
                  field='description'
                  value={this.state.form.description}
                  onChange={this.changeInput}
                  error={this.state.formErrors.description}
                  maxLength="255"
                  required={true}
                />
              </div>
              <div className="register">
                <button
                 className={`${formValid(this.state) === true ? 'register-button' : 'register-disabled'}`}
                 disabled={!formValid(this.state)}
                 type="submit">
                  { LANG[localStorage.JobChoiceLanguage].submit }
                </button>
              </div>
            </form>
          </div>
        </div>

        <Modal
          show={this.state.modal.modal}
          messageKey={this.state.modal.messageKey}
          message={this.state.modal.message}
          type={this.state.modal.modalType}
          redirect={this.state.modal.redirect}
          data={this.state.modal.data}
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

export default connect(mapStateToProps, mapDispatchToProps)(CreateJobCategory)
