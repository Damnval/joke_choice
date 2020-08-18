import React, { Component } from 'react'
import './JobOfferComponent.scss'
import { Redirect, Link } from 'react-router-dom'
import { Button, Breadcrumb } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import api from '../../../utilities/api'
import Modal from '../../../components/modal/Modal'
import ConfirmationModal from '../../../components/confirmationModal/ConfirmationModal'
import { LANG, EM } from '../../../constants'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../../store/auth/actions'
import JobChoiceReactTable from '../../../components/jobChoiceReactTable/JobChoiceReactTable'
import { ErrorModal, ClearModal } from '../../../helpers'

const clearModal = {...ClearModal()}
const errorModal = {...ErrorModal()}
class JobOfferComponent extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            jobs: [],
            pages: -1,
            loading: true,
            modal: {
                message: '',
                messageKey: '',
                modal: false,
                modalType: '',
                redirect: null,
            },
            confirmDelete: {
                message: '',
                show: false,
                id: 0
            }
        }

        this.onDelete = this.onDelete.bind(this)
    }

    onDelete () {
      this.props.handleLoadPage(true)
      this.setState({
        confirmDelete: {
          message: '',
          messageKey: null,
          show: false,
          id: 0
        }
      })
      
      api.delete('api/job/' + this.state.confirmDelete.id).then(response => {
          this.setState({ 
              modal: {
                  messageKey: 'successDelete',
                  modal: true,
                  modalType: 'success'
              },
              isLoading: false,
          }, () => {
            api.get('api/manage/job?page=1').then(response => {
              this.setState({
                jobs: response.data.results.jobs.data,
                pages: response.data.results.jobs.last_page,
                loading: false
              })
            }).catch(error => {
              console.log(error)
              this.setState({ ...errorModal })
            })})
      }).catch(error => {
        console.log(error)
        this.setState({ 
          ...errorModal,
          isLoading: false
        })
      })
    }

    handleDelete (id) {
      this.setState({
        confirmDelete: {
          message: '',
          messageKey: null,
          show: false,
          id: 0
        },
        ...clearModal
      }, () => {
        this.setState({
          confirmDelete: {
            messageKey: 'confirmationMsg',
            show: true,
            id: id
          }
        })
      })
    }

    handleInDevelopment = () => {
      this.setState({ ...clearModal }, () => {
        this.setState({
          modal: {
            messageKey: 'thisIsStillInDevelopment',
            modal: true,
            modalType: 'error',
          }
        })
      })
    }

    handleClose = () => {
      this.setState({ ...clearModal })
    }

    handleConfirmClose = () => {
      this.setState({ 
        confirmDelete: {
          message: '',
          show: false,
          id: 0
        }
      })
    }


    render() {
    if (!('data' in this.props.user)) {
      return (<Redirect to="/jobs-management" />)
    }

    if (this.props.user.data.job_seeker || this.props.user.data.company) {
      return (<Redirect to="/home" />)
    }

    const data = this.state.jobs

    const columns = [
        {
          Header: LANG[localStorage.JobChoiceLanguage].company,
          id: "company",
          headerClassName: "rt-header-text-area-wrap",
          className: "rt-td-text-area-wrap",
          accessor: d => <a href={'/admin/manage/job-offer/for-approval/' + d.id}>{d.company.company_name}</a>
        },
        {
            Header: LANG[localStorage.JobChoiceLanguage].jobCategory,
            id: "category",
            headerClassName: "rt-header-text-area-wrap",
            className: "rt-td-text-area-wrap",
            accessor: d => d.job_job_sub_categories.map((el, key) => {
              let ret = el.job_sub_category.sub_category
              if (key !== d.job_job_sub_categories.length-1) {
                  ret = ret + ', '
              }
              return ret
            })
        },
        {
          Header: LANG[localStorage.JobChoiceLanguage].jobTitle,
          id: "type",
          headerClassName: "rt-header-text-area-wrap",
          className: "rt-td-text-area-wrap",
          accessor: d => <span>{d.title}</span>
        },
        {
          Header: LANG[localStorage.JobChoiceLanguage].status,
          headerClassName: "status",
          id: "status",
          className: "col-center status",
          accessor: d => <span>{EM[localStorage.JobChoiceLanguage].APPROVAL_STATUS.filter(function(item) { return item.value === d.approval_status ? item : null })[0].name}</span>
        },
        {
          Header: LANG[localStorage.JobChoiceLanguage].actions,
          headerClassName: "icon-col-header-2",
          id: 'view-edit',
          Cell: d => (
            <div>
              <Button bsClass='btn manage-account-table-button btn-view' onClick={this.handleInDevelopment}>
                <FontAwesomeIcon icon="trash" />
              </Button>
            </div>
          ),
          accessor: d => d.id,
          className: "col-center icon-col-2"
        },
    ]

    return (
      <div className="admin-background manage-jobs-area col-md-9 col-sm-12 col-xs-12">
        <Breadcrumb className="admin-breadcrumbs-row">
          <Breadcrumb.Item>
            <Link to="/admin">{ LANG[localStorage.JobChoiceLanguage].dashboard }</Link>
          </Breadcrumb.Item>/
          <Breadcrumb.Item active>{ LANG[localStorage.JobChoiceLanguage].jobMngmnt }</Breadcrumb.Item>
        </Breadcrumb>
        <div className="manage-job-area">
          <div className="container-fluid">
            <div className="admin-manage-top"><h3>{ LANG[localStorage.JobChoiceLanguage].jobMngmnt }</h3></div>
            <div className="manage-job-table-area">
              <JobChoiceReactTable
                data={data}
                pages={this.state.pages}
                loading={this.state.loading}
                columns={columns}
                onFetchData={(state, instance) => {
                    // show the loading overlay
                    this.props.handleLoadPage(false)
                    api.get('api/manage/job?page='+(state.page+1)).then(response => {
                      this.setState({
                        jobs: response.data.results.jobs.data,
                        pages: response.data.results.jobs.last_page,
                        loading: false
                      })
                    }).catch(error => {
                      console.log(error)

                      this.setState({ 
                        ...errorModal,
                        loading: false
                      })
                    })
                  }}
                />
            </div>
          </div>
        </div>
          <Modal 
            show={this.state.modal.modal} 
            messageKey={this.state.modal.messageKey}
            message={this.state.modal.message}
            type={this.state.modal.modalType}
            handleParentClose={this.handleClose}
            redirect={this.state.modal.redirect} />

          <ConfirmationModal 
            show={this.state.confirmDelete.show} 
            message={this.state.confirmDelete.message}
            messageKey={this.state.modal.messageKey}
            handleParentClose={this.handleConfirmClose}
            handleSuccess={this.onDelete}/>
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
  
  export default connect(mapStateToProps, mapDispatchToProps)(JobOfferComponent)
