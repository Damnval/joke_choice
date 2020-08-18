import React, { Component } from 'react'
import './ManageAccounts.scss'
import { Redirect, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import api from '../../../utilities/api'
import {Breadcrumb} from 'react-bootstrap'
import { LANG, EM } from '../../../constants'
import JobChoiceReactTable from '../../../components/jobChoiceReactTable/JobChoiceReactTable'
import { ErrorModal, ClearModal } from '../../../helpers'
import Modal from '../../../components/modal/Modal'
import ConfirmationModal from '../../../components/confirmationModal/ConfirmationModal'

const errorModal = {...ErrorModal()}
const clearModal = {...ClearModal()}
class ManageAccounts extends Component {
    constructor(props) {
        super(props);

        this.state = {
          loading: true,
          pages: -1,
          page: 0,
          users: [],
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
        this.handleClose = this.handleClose.bind(this)
    }
    
    componentDidMount() {
      this.props.handleLoadPage(false)
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

    handleDelete (id) {
      this.setState({
        confirmDelete: {
          messageKey: null,
          message: '',
          show: false,
          id: 0
        },
        ...clearModal,
      }, () => {
        this.setState({
          confirmDelete: {
            messageKey: 'areYouSureWantDeleteUser',
            message: LANG[localStorage.JobChoiceLanguage].areYouSureWantDeleteUser,
            show: true,
            id: id
          }
        })
      })
    }

    onDelete = () => {
      this.setState({ 
        confirmDelete: {
          messageKey: null,
          message: '',
          show: false,
          id: 0
        }
      }, () => {this.props.handleLoadPage(true)})
      api.delete('api/manage/user/' + this.state.confirmDelete.id).then(response => {
        this.getData()
        this.setState({
          modal: {
            messageKey: 'successfullyDeletedAccount',
            message: LANG[localStorage.JobChoiceLanguage].successfullyDeletedAccount,
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

    getData() {
      api.get('api/manage/user?page=1').then(response => {
        const users = response.data.results.user.data

          const usersDummy = users.map(function(user){
            if (user.company !== null) {
              return {...user, type: 'Company'}
            }
            return {...user, type: 'Job Seeker'}
          })

          this.setState({
            users: usersDummy,
            pages: response.data.results.user.last_page,
            page: 0,
            loading: false
          }, () => this.props.handleLoadPage(false))

      }).catch(error => {
        console.log(error)
        this.setState({ 
          modal: {
            ...errorModal
          },
        }, () => this.props.handleLoadPage(false))
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

    const data = this.state.users

    const columns = [
        {
            Header: LANG[localStorage.JobChoiceLanguage].justName,
            id: "name",
            headerClassName: "rt-header-text-area-wrap",
            className: "rt-td-text-area-wrap",
            accessor: d => {
              const first_name = d.first_name ? d.first_name : ''
              const last_name = d.last_name ? d.last_name : ''
              const full_name = first_name || last_name ? `${last_name} ${first_name}` : 
                <span className='profile-details-individual-value empty'>{ LANG[localStorage.JobChoiceLanguage].valueNotSet }</span>
              return <Link to={'/admin/manage/accounts/' + d.id}>{full_name}</Link>}
          },
        {
            Header: LANG[localStorage.JobChoiceLanguage].accountType,
            id: "type",
            headerClassName: "rt-header-text-area-wrap",
            className: "rt-td-text-area-wrap",
            accessor: d => d.type ? EM[localStorage.JobChoiceLanguage].ACCOUNT_TYPE.filter(
              function(account) {return account.table_value === d.type ? account : null })[0].name : LANG[localStorage.JobChoiceLanguage].valueNotSet
        },
        {
            Header: LANG[localStorage.JobChoiceLanguage].email,
            id: "email",
            headerClassName: "rt-header-text-area-wrap",
            className: "rt-td-text-area-wrap",
            accessor: d => d.email ? d.email : LANG[localStorage.JobChoiceLanguage].valueNotSet
        },
        {
            Header: LANG[localStorage.JobChoiceLanguage].actions,
            headerClassName: "icon-col-header-2",
            id: 'view-actions',
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
      <div className="admin-background manage-accounts-area col-md-9 col-sm-12 col-xs-12">
        <Breadcrumb className="admin-breadcrumbs-row">
          <Breadcrumb.Item hred="/admin">{ LANG[localStorage.JobChoiceLanguage].dashboard }</Breadcrumb.Item>/
          <Breadcrumb.Item active>{ LANG[localStorage.JobChoiceLanguage].accounts }</Breadcrumb.Item>
        </Breadcrumb>
        <div className="manage-job-area">
          <div className="container-fluid">
            <div className="admin-manage-top">
            <h3>{ LANG[localStorage.JobChoiceLanguage].mngAccounts }</h3>
            </div>
            <ConfirmationModal 
              show={this.state.confirmDelete.show} 
              messageKey={this.state.confirmDelete.messageKey}
              message={this.state.confirmDelete.message}
              handleParentClose={this.handleConfirmClose}
              handleSuccess={this.onDelete}/>
            <div className="manage-job-table-area">
              <JobChoiceReactTable
                data={data}
                pages={this.state.pages}
                loading={this.state.loading}
                page={this.state.page}
                columns={columns}
                onFetchData={(state, instance) => {
                  // show the loading overlay
                  this.props.handleLoadPage(false)
                  api.get('api/manage/user?page='+(state.page+1)).then(response => {
                    const users = response.data.results.user.data
          
                      const usersDummy = users.map(function(user){
                        if (user.company !== null) {
                          return {...user, type: 'Company'}
                        }
                        return {...user, type: 'Job Seeker'}
                      })
          
                      this.setState({
                        users: usersDummy,
                        pages: response.data.results.user.last_page,
                        loading: false,
                        page: state.page,
                      }, () => this.props.handleLoadPage(false))
          
                  }).catch(error => {
                    console.log(error)
                    this.setState({ 
                      modal: {
                        ...errorModal
                      },
                    }, () => this.props.handleLoadPage(false))
                  })
              }}
              />
            </div>
          </div>
        </div>
        <Modal 
          messageKey={this.state.modal.messageKey}
          show={this.state.modal.modal} 
          message={this.state.modal.message}
          type={this.state.modal.modalType}
          handleParentClose={this.handleClose}
          redirect={this.state.modal.redirect} />
      </div>
    )
  }
}

const mapStateToProps = state => {
  return state
}

export default connect(mapStateToProps)(ManageAccounts)
