import React, { Component } from 'react'
import './../../admin/manageJobCategories/ManageJobCategories.scss'
import './ManageJobs.scss'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { Breadcrumb } from 'react-bootstrap'
import { LANG } from '../../../constants'
import "react-table/react-table.css"
import LoadingIcon from '../../../components/loading/Loading'
import Modal from '../../../components/modal/Modal'
import ClientJobList from './clientJobList/ClientJobList'

class Jobs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      jobs: [],
      isLoading: true,
      modal: {
        messageKey: null,
        message: '',
        modal: false,
        modalType: '',
        redirect: null,
      },
    }
    this.updateLoading = this.updateLoading.bind(this)
    this.setParent = this.setParent.bind(this)
    this.handleParentClose = this.handleParentClose.bind(this)
  }

  updateLoading = (state) => {
    this.setState({isLoading: state})
  }

  setParent = (newState) => {
    this.setState({...newState})
  }

  handleParentClose () {
    this.setState({
      modal: {
        messageKey: null,
        message: '',
        modal: false,
        modalType: '',
        redirect: null,
      },
    })
  }

  render() {

    if (!(this.props.user.data.company)) {
      return (<Redirect to="/home" />)
    }

    return (
        <div className="manage-jobs-outer">
          <div className="manage-jobs-background">
            <Breadcrumb className="breadcrumb-featured job-list">
              <Breadcrumb.Item active>{ LANG[localStorage.JobChoiceLanguage].jobMngmnt }</Breadcrumb.Item>
              <button
                className="btn btn-success btn-create-job"
                onClick={this.props.redirectCreateJob}>
                { LANG[localStorage.JobChoiceLanguage].createJob }
              </button>
            </Breadcrumb>
            <ClientJobList
              jobs={this.props.jobs}
              updateLoading={this.props.updateLoading}
              isLoading={this.props.isLoading}
              setParent={this.setParent}
              clientPage={this.props.clientPage}
              getClientJobList={this.props.getClientJobList}
              searchClientJobList={this.props.searchClientJobList}
            />
          </div>
          
          <Modal 
            show={this.state.modal.modal} 
            messageKey={this.state.modal.messageKey}
            message={this.state.modal.message}
            type={this.state.modal.modalType}
            redirect={this.state.modal.redirect}
            data={this.state.modal.data}
            handleParentClose={this.handleParentClose}
          />
        </div>
    )
  }
}

const mapStateToProps = state => {
  return state
}

export default connect(mapStateToProps)(Jobs)
