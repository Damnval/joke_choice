import React, { Component } from 'react'
import './ManageJobCategories.scss'
import { Redirect, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import api from '../../../utilities/api'
import Modal from '../../../components/modal/Modal'
import { LANG } from '../../../constants'
import { bindActionCreators } from 'redux'
import * as authActions from '../../../store/auth/actions'
import JobChoiceReactTable from '../../../components/jobChoiceReactTable/JobChoiceReactTable'
import {Breadcrumb} from 'react-bootstrap'
import { ErrorModal, ClearModal } from '../../../helpers'
import ConfirmationModal from '../../../components/confirmationModal/ConfirmationModal'

const clearModal = {...ClearModal()}
const errorModal = {...ErrorModal()}
class ManageJobCategories extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
          job_categories: [],
          loading: true,
          pages: -1,
          page: 0,
          modal: {
            messageKey: null,
            message: '',
            modal: false,
            modalType: '',
            redirect: null,
          },
          confirmDelete: {
            messageKey: null,
            message: '',
            show: false,
            id: 0
          }
        }

        this.handleDelete = this.handleDelete.bind(this)
        this.onDelete = this.onDelete.bind(this)
    }

    handleDelete (id) {
      this.setState({
        modal: {
          messageKey: null,
          message: "",
          modal: false,
          modalType: '',
        },
        confirmDelete: {
          messageKey: null,
          message: '',
          show: false,
          id: 0
        }
      }, () => {
        this.setState({
          confirmDelete: {
            messageKey: 'areYouSureWantDeleteCategory',
            message: LANG[localStorage.JobChoiceLanguage].areYouSureWantDeleteCategory,
            show: true,
            id: id
          },
        })
      })
    }

    handleConfirmClose = () => {
      this.setState({ 
        confirmDelete: {
          messageKey: null,
          message: '',
          show: false,
          id: 0
        }
      })
    }

    onDelete () {
      this.setState({ 
        confirmDelete: {
          messageKey: null,
          message: '',
          show: false,
          id: 0
        }
      }, () => {this.props.handleLoadPage(true)})
      api.delete('api/manage/job-category/' + this.state.confirmDelete.id).then(response => {
        this.getData()
        this.setState({
          modal: {
            message: 'Successfully deleted job category.',
            modal: true,
            modalType: 'success',
          },
        }, () => {this.props.handleLoadPage(false)})
      }).catch(error => {
        console.log(error)
        this.setState({ 
          confirmDelete: {
            messageKey: null,
            message: '',
            show: false,
            id: 0
          },
          ...errorModal
        }, () => {this.props.handleLoadPage(false)})
      })
    }

    getData () {
      api.get('api/manage/job-category?page=1').then(response => {
        this.setState({
            job_categories: response.data.results.jobs.data,
            pages: response.data.results.jobs.last_page,
            loading: false,
            page: 0
        })
      }).catch(error => {
        console.log(error)
        this.setState({ 
          modal: {
            ...errorModal
          },
        })
      })
    }

    handleInDevelopment = () => {
      this.setState({
        modal: {
          messageKey: null,
          message: "",
          modal: false,
          modalType: '',
        }
      }, () => {
        this.setState({
          modal: {
            messageKey: 'thisIsStillInDevelopment',
            message: LANG[localStorage.JobChoiceLanguage].thisIsStillInDevelopment,
            modal: true,
            modalType: 'error',
          }
        })
      })
    }

    handleClose = () => {
      this.setState({ ...clearModal })
    }

    render() {
    if (!('data' in this.props.user)) {
        return (<Redirect to="/login" />)
    }

    if (this.props.user.data.job_seeker || this.props.user.data.company) {
        return (<Redirect to="/home" />)
    }

    const data = this.state.job_categories

    const columns = [
        {
            Header: LANG[localStorage.JobChoiceLanguage].name,
            id: "name",
            headerClassName: "rt-header-text-area-wrap",
            className: "rt-td-text-area-wrap",
            width: 300,
            accessor: d => <button className="btn btn-link" onClick={this.handleInDevelopment}>{d.category}</button>
        },
        {
            Header: LANG[localStorage.JobChoiceLanguage].categoryType,
            id: "type",
            headerClassName: "rt-header-text-area-wrap",
            className: "rt-td-text-area-wrap",
            accessor: d => d.description
        },
        {
            Header: LANG[localStorage.JobChoiceLanguage].actions,
            headerClassName: "icon-col-header-2",
            id: 'view-edit',
            Cell: d => (
              <div>
                <Button
                  bsClass='btn manage-account-table-button btn-view'
                  onClick={this.handleInDevelopment}>
                  <FontAwesomeIcon icon='edit'/>
                </Button>
                <Button
                  bsClass='btn manage-account-table-button btn-view'
                  onClick={() => this.handleDelete(d.value)}>
                  <FontAwesomeIcon icon='trash'/>
                </Button>
              </div>
            ),
            accessor: d => d.id,
            className: "col-center icon-col-2"
        }
    ]

    return (
        <>
          <div className="admin-background manage-accounts-area col-md-9 col-sm-12 col-xs-12">
            <Breadcrumb className="admin-breadcrumbs-row">
            <Breadcrumb.Item>
              <Link to="/admin">{ LANG[localStorage.JobChoiceLanguage].dashboard }</Link>
            </Breadcrumb.Item>/
              <Breadcrumb.Item active>{ LANG[localStorage.JobChoiceLanguage].manageJobCategories }</Breadcrumb.Item>
            </Breadcrumb>
            <div className="container-fluid">
              <div className="admin-manage-top">
                <h3>{ LANG[localStorage.JobChoiceLanguage].manageJobCategories }</h3>
                <Link to={'/job-categories/create'} className="btn btn-success">{ LANG[localStorage.JobChoiceLanguage].createdJobCategory }</Link>
              </div>
              <div className="manage-job-table-area">
                <JobChoiceReactTable
                  data={data}
                  columns={columns}
                  page={this.state.page}
                  pages={this.state.pages}
                  loading={this.state.loading}
                  onFetchData={(state, instance) => {
                    // show the loading overlay
                    api.get('api/manage/job-category?page='+(state.page+1)).then(response => {
                      this.setState({
                          job_categories: response.data.results.jobs.data,
                          pages: response.data.results.jobs.last_page,
                          page: state.page,
                          loading: false
                      })
                    }).catch(error => {
                      console.log(error)
                      this.setState({ 
                        modal: {
                          ...errorModal
                        },
                      })
                    })
                  }}
                />
              </div>
            </div>
          </div>

          <ConfirmationModal 
            show={this.state.confirmDelete.show} 
            message={this.state.confirmDelete.message}
            messageKey={this.state.confirmDelete.messageKey}
            handleParentClose={this.handleConfirmClose}
            handleSuccess={this.onDelete}/>

          <Modal 
            show={this.state.modal.modal} 
            messageKey={this.state.modal.messageKey}
            message={this.state.modal.message}
            type={this.state.modal.modalType}
            handleParentClose={this.handleClose}
            redirect={this.state.modal.redirect} />
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageJobCategories)
