import React, { Component } from 'react'
import './AdminDashboard.scss'
import { connect } from 'react-redux'
import AdminDashboardLeft from './AdminDashboardLeft'
import JobChoiceLayout from '../../../layouts/jobChoiceLayout/JobChoiceLayout'
import { Switch, Route } from 'react-router-dom'
import Loading from '../../../components/loading/Loading'
import ManageJobCategories from '../manageJobCategories/ManageJobCategories'
import NoticeManagement from '../noticeManagement/NoticeManagement'
import NoticeDetails from '../adminDashboardComponent/noticeDetails/NoticeDetails'
import CreateNotice from '../adminDashboardComponent/createNotice/CreateNotice'
import JobForApproval from '../jobForApproval/JobForApproval'
import JobOfferManagement from '../adminDashboardComponent/jobOfferManagement/JobOfferManagement'
import ManageUsers from '../manageUsers/ManageUsers'
import ManageClients from '../manageClients/ManageClients'
import JobSeekerDetails from '../accountDetails/jobSeekerDetails/JobSeekerDetails'
import CompanyDetails from '../accountDetails/companyDetails/CompanyDetails'
import IncentiveManagement from '../incentiveManagement/IncentiveManagement'

class AdminDashboard extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
          isLoading: false,
          jobs: [],
          jobCounts: null,
          modal: {
            messageKey: null,
            message: '',
            modal: false,
            modalType: '',
            redirect: null,
          },
        }
        this.handleLoadPage = this.handleLoadPage.bind(this)
    }

    handleLoadPage = (state) => {
      this.setState({
        isLoading: state
      })
    }

    render() {
      return (
        <div>
          <JobChoiceLayout>
            <div className="user-dashboard-background">
              <div className="row min-height">
                <div className="col-md-3 col-sm-12 col-xs-12">
                  <AdminDashboardLeft location={this.props.location}/>
                </div>
                {/* This works similarly to Routes.js */}
                {/* This page will handle the Loading Functionality of Admin */}
                {/* Use this.props.handleLoadPage when loading the page */}
                <Switch>
                  <Route
                    exact
                    path="/admin/manage/job-seeker/:id"
                    render={(props) =>
                      <JobSeekerDetails {...this.props}
                        isLoading={this.state.isLoading}
                        handleLoadPage={this.handleLoadPage}/>}
                  />
                  <Route
                    exact
                    path="/admin/manage/client/:id"
                    render={(props) =>
                      <CompanyDetails {...this.props}
                        isLoading={this.state.isLoading}
                        handleLoadPage={this.handleLoadPage}/>}
                  />
                  <Route
                    exact
                    path="/admin/manage/notice-management"
                    render={(props) =>
                      <NoticeManagement
                        isLoading={this.state.isLoading}
                        handleLoadPage={this.handleLoadPage}/>
                    }
                  />
                  <Route
                    exact
                    path="/admin/manage/notice-management/details"
                    render={(props) =>
                      <NoticeDetails
                        {...props}
                        isLoading={this.state.isLoading}
                        handleLoadPage={this.handleLoadPage}/>
                    }
                  />
                  <Route
                    exact
                    path="/admin/manage/notice-management/create"
                    render={(props) =>
                      <CreateNotice
                        {...props}
                        isLoading={this.state.isLoading}
                        handleLoadPage={this.handleLoadPage}/>
                    }
                  />
                  <Route
                    exact
                    path="/admin/manage/job-categories"
                    render={(props) =>
                      <ManageJobCategories
                        isLoading={this.state.isLoading}
                        handleLoadPage={this.handleLoadPage}/>
                    }
                  />
                  <Route
                    exact
                    path="/admin/manage/job-offer/for-approval/:id"
                    render={(props) =>
                      <JobForApproval
                        {...props}
                        isLoading={this.state.isLoading}
                        handleLoadPage={this.handleLoadPage}/>
                    }
                  />  
                  <Route
                    exact
                    path="/admin/manage/incentives"
                    render={(props) =>
                      <IncentiveManagement
                        {...props}
                        isLoading={this.state.isLoading}
                        handleLoadPage={this.handleLoadPage}/>
                    }
                  />
                  <Route
                    path="/admin/manage/job-offers"
                    render={(props) =>
                      <JobOfferManagement
                        isLoading={this.state.isLoading}
                        handleLoadPage={this.handleLoadPage}/>
                    }
                  />
                  <Route
                    exact
                    path="/admin"
                    render={(props) =>
                      <ManageUsers
                        isLoading={this.state.isLoading}
                        handleLoadPage={this.handleLoadPage}/>
                    }
                  />
                  <Route
                    path="/admin/manage/clients"
                    render={(props) =>
                      <ManageClients {...this.props}
                        isLoading={this.state.isLoading}
                        handleLoadPage={this.handleLoadPage}/>}
                  />
                </Switch>
              </div>
            </div>
            <Loading show={this.state.isLoading} />
          </JobChoiceLayout>
        </div>
      )
    }
}

const mapStateToProps = state => {
  return state
}

export default connect(mapStateToProps)(AdminDashboard)
