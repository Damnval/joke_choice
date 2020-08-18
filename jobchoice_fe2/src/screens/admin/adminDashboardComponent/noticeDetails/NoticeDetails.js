import React, { Component } from 'react'
import './NoticeDetails.scss'
import { Button, Breadcrumb } from 'react-bootstrap'
import api from '../../../../utilities/api'
import Modal from '../../../../components/modal/Modal'
import ConfirmationModal from '../../../../components/confirmationModal/ConfirmationModal'
import { LANG, EM } from '../../../../constants'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../../../store/auth/actions'
import { ErrorModal } from '../../../../helpers'
import NoticeEdit from './NoticeEdit'
import LoadingIcon from '../../../../components/loading/Loading'
import { DateFormat } from '../../../../helpers'
import AccountRowDetails from '../../accountDetails/accountRowDetails/AccountRowDetails'
import AccountRowTwoDetails from '../../accountDetails/accountRowTwoDetails/AccountRowTwoDetails'
import BoxContainer from '../../../../components/boxContainer/BoxContainer'

const errorModal = {...ErrorModal()}

class NoticeDetails extends Component {
    constructor(props) {
      super(props)
      this.state = {
        isEditing: false,
        pages: -1,
        notifications: [],
        editDetails: false,
        loading: true,
        noticeDetails: this.props.location.state,
        modal: {
          messageKey: null,
          message: '',
          modal: false,
          modalType: '',
          redirect: null,
        },
        form: {
          title: '',
        },
        formErrors: {
          title: '',
        },
        confirmDelete: {
          messageKey: null,
          message: '',
          show: false,
          id: 0
      }
    }
    this.onDelete = this.onDelete.bind(this)
    this.handleEdit = this.handleEdit.bind(this)
    }

    handleEdit = (state) => {
      this.setState({
        isEditing: state
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

    editDetails = (e) => {
        if(this.state.editDetails){
          this.setState({editDetails: false})
        }
  
        if(!this.state.editDetails){
          const title = this.props.location.state.title
          this.setState({
            editDetails: true,
            details: {
              ...this.state.details,
              title: '',
            }
          })
        }
      }

      toggleEdit = e => {
        this.setState({
          isEditing: !this.state.isEditing,
        })
      }

    onDelete () {
      this.setState({
        confirmDelete: {
          message: '',
          show: false,
          id: 0,
        },
        isLoading: true,
      })

      api.delete('api/manage/notification/' + this.props.location.state.id).then(response => {
        this.setState({ 
          isLoading: false,
            modal: {
              messageKey: 'successfullyDeletedNotification',
              message: LANG[localStorage.JobChoiceLanguage].successfullyDeletedNotification,
              modal: true,
              modalType: 'success',
              redirect: '/admin/manage/notice-management',
            },
        }, () => {
          api.get('api/manage/notification?page=1').then(response => {
            this.setState({
              notification: response.data.results.notification,
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
          show: false,
          id: 0
        },
        modal: {
          message: '',
          modal: false,
          modalType: '',
          redirect: null,
        },
      }, () => {
        this.setState({
          confirmDelete: {
            messageKey: 'wantToDeleteNotification',
            message: LANG[localStorage.JobChoiceLanguage].wantToDeleteNotification,
            show: true,
            id: id
          }
        })
      })
    }

  render() {

    const title = this.props.location.state.title
    const description = this.props.location.state.description
    const age_from = this.props.location.state.age_from
    const age_to = this.props.location.state.age_to
    const recipient_type = this.props.location.state.recipient_type
    const published_start_date = this.props.location.state.publication.published_start_date
    const published_end_date = this.props.location.state.publication.published_end_date
    const area = this.props.location.state.area
    const type = this.props.location.state.type
    
    return (
  
      <div className="admin-background manage-jobs-area col-md-9 col-sm-12 col-xs-12">
        <Breadcrumb className="breadcrumb-hataraki-kata">
          <Breadcrumb.Item href="/home">{ LANG[localStorage.JobChoiceLanguage].dashboard }</Breadcrumb.Item>/
          <Breadcrumb.Item href="/admin/manage/notice-management">{ LANG[localStorage.JobChoiceLanguage].noticeManagement }</Breadcrumb.Item>/
          <Breadcrumb.Item active>{ LANG[localStorage.JobChoiceLanguage].noticeDetails }</Breadcrumb.Item>
        </Breadcrumb>
        <div className="manage-job-area">
          <div className="container-fluid">
            <div>
            {this.state.isEditing ? 
              <NoticeEdit
                noticeDetails={this.state.noticeDetails}
                handleEdit={this.handleEdit}
              /> :
              <form className="edit-notice-form">
                <AccountRowDetails
                  label={ LANG[localStorage.JobChoiceLanguage].noticeTitle }
                  data={title} />
                <AccountRowDetails
                  label={ LANG[localStorage.JobChoiceLanguage].description }
                  data={description} />
                <AccountRowTwoDetails
                  dataClass="bottomer"
                  accountClass="bottomer"
                  label={ LANG[localStorage.JobChoiceLanguage].publicationPostDate }
                  data={DateFormat(published_start_date)} 
                  label_2={ LANG[localStorage.JobChoiceLanguage].to }
                  data_2={DateFormat(published_end_date)} />
                <BoxContainer>
                  <div className="publication-area">
                    <AccountRowTwoDetails
                      accountClass="bottomer"
                      label={ LANG[localStorage.JobChoiceLanguage].publicationArea }
                      data={EM[localStorage.JobChoiceLanguage].PUBLICATION_AREA.filter(function(item) { return item.value === area ? item : null })[0].name} 
                      label_2={ LANG[localStorage.JobChoiceLanguage].category }
                      data_2={EM[localStorage.JobChoiceLanguage].NOTIFICATION_TYPE.filter(function(item) { return item.value === type ? item : null })[0].name} />
                    <AccountRowTwoDetails
                      dataClass="bottomer"
                      accountClass="bottomer"
                      label={ LANG[localStorage.JobChoiceLanguage].ageRange }
                      data={
                        <div>
                          {age_from === null ? LANG[localStorage.JobChoiceLanguage].valueNotSet : age_from}
                          <span className="squig"> ~ </span>
                          {age_to === null ? LANG[localStorage.JobChoiceLanguage].valueNotSet : age_to}
                        </div>
                      } 
                      label_2={ LANG[localStorage.JobChoiceLanguage].destination }
                      data_2={EM[localStorage.JobChoiceLanguage].ACCOUNT_TYPE.filter(function(item) { return item.value === recipient_type ? item : null })[0].name} />
                  </div>
                </BoxContainer>
                <div className="notice-buttons-holder">
                  <span className="publication-btn">
                    <span className='btn-edit'>
                      <Button 
                        onClick={()=>this.toggleEdit()}
                        className='btn btn-primary btn-notice-detail'
                        >{ LANG[localStorage.JobChoiceLanguage].edit }
                      </Button>
                    </span>
                    <span>
                      <Button 
                        onClick={()=>this.handleDelete()}
                        className='btn-danger btn-notice-detail'
                        >{ LANG[localStorage.JobChoiceLanguage].delete }
                      </Button>
                    </span>
                  </span>
                </div>
            </form>
            }
            </div>
          </div>
        </div>
        <Modal
          show={this.state.modal.modal}
          message={this.state.modal.message}
          messageKey={this.state.modal.messageKey}
          type={this.state.modal.modalType}
          redirect={this.state.modal.redirect}/>

        <ConfirmationModal 
          show={this.state.confirmDelete.show} 
          message={this.state.confirmDelete.message}
          messageKey={this.state.confirmDelete.messageKey}
          handleParentClose={this.handleConfirmClose}
          handleSuccess={this.onDelete}/>

        <LoadingIcon show={this.state.isLoading} />
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

export default connect(mapStateToProps, mapDispatchToProps)(NoticeDetails)
