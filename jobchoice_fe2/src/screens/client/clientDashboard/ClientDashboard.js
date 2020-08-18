import React, { Component } from 'react'
import './ClientDashboard.scss'
import { connect } from 'react-redux'
import ClientDashboardSidebar from './clientDashboardComponents/ClientDashboardSidebar'
import Modal from '../../../components/modal/Modal'
import LoadingIcon from '../../../components/loading/Loading'
import Jobs from '../jobs/Jobs'
import { LANG } from '../../../constants'
import {ClearModal} from '../../../helpers'

const clearModal = {...ClearModal()}

class ClientDashboard extends Component {

    constructor(props) {
      super(props)
  
      this.state = {
        isLoading: false,
        modal: {
          message: '',
          modal: false,
          modalType: '',
          redirect: null,
        },
      }

      this.updateLoading = this.updateLoading.bind(this)
      this.updateModal = this.updateModal.bind(this)
      this.searchClientJobList = this.searchClientJobList.bind(this)
      this.handleModalClose = this.handleModalClose.bind(this)
    }

    updateLoading(value) {
      this.setState({isLoading: value})
    }

    updateModal(value) {
      this.setState({
        modal: value.modal
      })
    }

    searchClientJobList(search={}, page=0, update=false, mode='search') {
      this.setState({
        isLoading: true,
        ...clearModal
      }, () => {
        const clientList = this.props.getClientJobList(search, page, update, mode)
        clientList.then(() => {
          if (update) {
            if (mode === 'search') {
              if (this.props.clientPage.total === 0) {
                this.setState({ 
                  modal: {
                    messageKey: 'noJobsFound',
                    message: LANG[localStorage.JobChoiceLanguage].noJobsFound,
                    modal: true,
                    modalType: 'error',
                  },
                  isLoading: false
                })
              }
            } else if (mode === 'delete') {
              this.setState({ 
                modal: {
                  messageKey: 'successfullyDeletedJob',
                  message: LANG[localStorage.JobChoiceLanguage].successfullyDeletedJob,
                  modal: true,
                  modalType: 'success',
                },
                isLoading: false
              })
            } else if (mode === 'duplicate') {
              this.setState({ 
                modal: {
                  messageKey: 'successfullyDuplicatedJob',
                  message: LANG[localStorage.JobChoiceLanguage].successfullyDuplicatedJob,
                  modal: true,
                  modalType: 'success',
                },
                isLoading: false
              })
            }
          }
          this.setState({
            isLoading: false
          })
        })
      })
    }

    handleModalClose() {
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
        return (
        <div className='clientDash-background'>
          <ClientDashboardSidebar />

          <Jobs
            redirectCreateJob={this.props.redirectCreateJob}
            getClientJobList={this.props.getClientJobList}
            searchClientJobList={this.searchClientJobList}
            jobs={this.props.jobs}
            clientPage={this.props.clientPage}
            isLoading={this.props.isLoading}
            updateLoading={this.updateLoading}
          />

          <Modal 
            show={this.state.modal.modal} 
            message={this.state.modal.message}
            type={this.state.modal.modalType}
            redirect={this.state.modal.redirect}
            data={this.state.modal.data}
            handleParentClose={this.handleModalClose}
          />

          <LoadingIcon show={this.state.isLoading} />
        </div>
        )
    }
}

const mapStateToProps = state => {
  return state
}

export default connect(mapStateToProps)(ClientDashboard)
