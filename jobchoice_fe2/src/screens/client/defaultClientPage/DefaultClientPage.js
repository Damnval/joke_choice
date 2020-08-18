import React, { Component } from 'react'
import JobChoiceLayout from '../../../layouts/jobChoiceLayout/JobChoiceLayout'
import LoadingIcon from '../../../components/loading/Loading'
import Modal from '../../../components/modal/Modal'
import ClientDashboardSidebar from '../clientDashboard/clientDashboardComponents/ClientDashboardSidebar'

// Use this Page when Creating new Pages for Company
class DefaultClientPage extends Component {

  render() {
    const { modal, isLoading, children } = this.props

    return (
      <JobChoiceLayout>
        <div className="createJob-outer">
          <ClientDashboardSidebar />
          <div className="client-main-background">
            {children}
          </div>
          
          <Modal 
            show={modal.modal} 
            message={modal.message}
            type={modal.modalType}
            redirect={modal.redirect}
            data={modal.data}
          />

          <LoadingIcon show={isLoading} />
        </div>
      </JobChoiceLayout>
    )
  }
}

export default DefaultClientPage
