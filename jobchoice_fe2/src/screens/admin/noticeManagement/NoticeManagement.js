import React, { Component } from 'react'
import './NoticeManagement.scss'
import { Link } from 'react-router-dom'
import { Breadcrumb } from 'react-bootstrap'
import api from '../../../utilities/api'
import Modal from '../../../components/modal/Modal'
import { LANG, EM } from '../../../constants'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../../store/auth/actions'
import JobChoiceReactTable from '../../../components/jobChoiceReactTable/JobChoiceReactTable'
import { ErrorModal, ClearModal, DateSubmitFormat } from '../../../helpers'
import Input from '../../../components/input/Input'
import { Button } from 'react-bootstrap'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import {enUS, ja} from 'date-fns/esm/locale'
import SearchFieldContainer from '../../../components/searchFieldContainer/SearchFieldContainer'
import { DateTimeFormat } from '../../../helpers'

const errorModal = {...ErrorModal()}
const clearModal = {...ClearModal()}

class NoticeManagement extends Component {
    constructor(props) {
      super(props)
      this.state = {
        pages: -1,
        notifications: [],
        loading: true,
        modal: {
          messageKey: null,
          message: '',
          modal: false,
          modalType: '',
          redirect: null,
        },
        searchFields: {
          start_date: null,
          end_date: null,
          keyword: '',
        },
    }
    this.handleChangeStart = this.handleChangeStart.bind(this)
    this.handleChangeEnd = this.handleChangeEnd.bind(this)
  }

  onSearch = () => {
    this.setState({
      loading: true,
      ...clearModal
    })
    const credentials = {
      ...this.state.searchFields,
      start_date: this.state.searchFields.start_date ? DateSubmitFormat(this.state.searchFields.start_date) : null,
      end_date: this.state.searchFields.end_date ? DateSubmitFormat(this.state.searchFields.end_date) : null
    }
    
    api.post('api/manage/notification/search', credentials).then(response => {
      this.setState({
        notifications: response.data.results.notifications.data,
        pages: response.data.results.notifications.last_page,
        loading: false
      })
    }).catch(error => {
      console.log(error)
      this.setState({ 
        ...errorModal,
        loading: false
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

  handleChangeStart(date) {
    const endDate = date > this.state.searchFields.end_date ? date : this.state.searchFields.end_date
    this.setState({
      searchFields: {
        ...this.state.searchFields,
        start_date: date,
        end_date: endDate
      }
    })
  }
  
  handleChangeEnd(date) {
    const startDate = date < this.state.searchFields.start_date ? date : this.state.searchFields.start_date
    this.setState({
      searchFields: {
        ...this.state.searchFields,
        start_date: startDate,
        end_date: date
      }
    })
  }

  handleChange = (name, value) => {
    this.setState({
      searchFields: {
        ...this.state.searchFields,
        [name]: value
      }
    })
  }

  render() {

  const data = this.state.notifications

  const columns = [
      {
        Header: LANG[localStorage.JobChoiceLanguage].title,
        id: "title",
        headerClassName: "rt-header-text-area-wrap",
        className: "rt-td-text-area-wrap",
        width: 800,
        accessor: d => 
        <Link to={{pathname:'/admin/manage/notice-management/details', state:d}}>{d.title ? d.title : LANG[localStorage.JobChoiceLanguage].valueNotSet}</Link>
      },
      {
        Header: LANG[localStorage.JobChoiceLanguage].userClient,
        id: "recipient_type",
        headerClassName: "col-center",
        className:" col-center",
        accessor: d => d.recipient_type ?
            EM[localStorage.JobChoiceLanguage].ACCOUNT_TYPE.filter(
              function(el) { return el.value === d.recipient_type })[0].name : LANG[localStorage.JobChoiceLanguage].valueNotSet
      },
      {
        Header: LANG[localStorage.JobChoiceLanguage].notificationDate,
        id: "created_at",
        headerClassName: "col-center",
        className:"col-center",
        accessor: d => d.created_at ? DateTimeFormat(d.created_at) : LANG[localStorage.JobChoiceLanguage].valueNotSet
      },
  ]

  return (
    <div className="admin-background manage-jobs-area col-md-9 col-sm-12 col-xs-12">
      <Breadcrumb className="breadcrumb-hataraki-kata">
        <Breadcrumb.Item href="/home">{ LANG[localStorage.JobChoiceLanguage].dashboard }</Breadcrumb.Item>/
        <Breadcrumb.Item active>{ LANG[localStorage.JobChoiceLanguage].noticeManagement }</Breadcrumb.Item>
      </Breadcrumb>
      <div className="manage-job-area">
        <div className="container-fluid">
          <div className="admin-manage-top">
            <h3>{ LANG[localStorage.JobChoiceLanguage].noticeManagement }</h3>
            <Link to="/admin/manage/notice-management/create" className="btn btn-success">{ LANG[localStorage.JobChoiceLanguage].createNotice }</Link>
          </div>
          <SearchFieldContainer innerSearchStyles="flex-row-start" searchFieldStyles="flex-row-start flex-wrap notice-management-search-container">
            <div className="notice-filter">
              <span>{ LANG[localStorage.JobChoiceLanguage].startDate } : </span>
              <div className="notification-date">
                <DatePicker
                  className="client-job-list-search-date-picker"
                  dateFormat="yyyy/MM/dd"
                  selectsStart
                  startDate={this.state.searchFields.start_date}
                  endDate={this.state.searchFields.end_date}
                  selected={this.state.searchFields.start_date}
                  onChange={this.handleChangeStart}
                  placeholderText={ LANG[localStorage.JobChoiceLanguage].datePlaceholder }
                  locale={localStorage.JobChoiceLanguage === 'JP' ? ja : enUS}
                />
              </div>
              </div>
              <div className="notice-filter">
                <span>{ LANG[localStorage.JobChoiceLanguage].endDate } : </span>
                <div className="notification-date">
                  <DatePicker
                    className="client-job-list-search-date-picker"
                    dateFormat="yyyy/MM/dd"
                    selectsEnd
                    startDate={this.state.searchFields.start_date}
                    endDate={this.state.searchFields.end_date}
                    selected={this.state.searchFields.end_date}
                    onChange={this.handleChangeEnd}
                    placeholderText={ LANG[localStorage.JobChoiceLanguage].datePlaceholder }
                    locale={localStorage.JobChoiceLanguage === 'JP' ? ja : enUS}
                  />
                </div>
              </div>
              <div className="notice-filter">
                <span>{ LANG[localStorage.JobChoiceLanguage].keyword } : </span>
                <Input 
                    className="notice-date-search"
                    inputStyles="notice-management-search-keyword"
                    onChange={this.handleChange}
                    field="keyword"
                    maxLength={70}
                />
              </div>
              <div className="keyword-search-notice">
                  <Button onClick={this.onSearch} className="btn search-btn">{ LANG[localStorage.JobChoiceLanguage].search }</Button>
              </div>
          </SearchFieldContainer>
          <div className="manage-job-table-area">
            <JobChoiceReactTable
              data={data}
              pages={this.state.pages}
              loading={this.state.loading}
              columns={columns}
              onFetchData={(state, instance) => {
              this.props.handleLoadPage(false)
                api.get('api/manage/notification?page='+(state.page+1)).then(response => {
                  this.setState({
                    notifications: response.data.results.notifications.data,
                    pages: response.data.results.notifications.last_page,
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
          messageKey={this.state.modal.messageKey}
          show={this.state.modal.modal} 
          message={this.state.modal.message}
          type={this.state.modal.modalType}
          redirect={this.state.modal.redirect} />
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
  
  export default connect(mapStateToProps, mapDispatchToProps)(NoticeManagement)
  