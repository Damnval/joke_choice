import React, { Component } from 'react'
import './ManageClients.scss'
import { Redirect, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import api from '../../../utilities/api'
import {Breadcrumb} from 'react-bootstrap'
import { LANG } from '../../../constants'
import JobChoiceReactTable from '../../../components/jobChoiceReactTable/JobChoiceReactTable'
import { ErrorModal, ClearModal, handleSearchInputChange, DateTimeFormat } from '../../../helpers'
import Modal from '../../../components/modal/Modal'
import SearchFieldContainer from '../../../components/searchFieldContainer/SearchFieldContainer'
import Input from '../../../components/input/Input'
import ContactNumberInput from '../../../components/contactNumberInput/ContactNumberInput'
import NumberFormat from 'react-number-format'

const errorModal = {...ErrorModal()}
const clearModal = {...ClearModal()}
class ManageClients extends Component {
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
          searchFields: {
            keyword: '',
            prefectures: '',
            complete_address: "",
            contact_no: "",
            email: "",
            has_job_posted: "all",
            has_not_disclosed: "all",
          },
        }

        this.handleChange = this.handleChange.bind(this)
    }
    
    componentDidMount() {
      this.props.handleLoadPage(false)
    }

    handleChange = (name, value) => {
      this.setState({ ...handleSearchInputChange(this.state.searchFields, name, value) })
    }

    handleClickRadioButton = (e) => {
      const {name, value} = e.target
      this.setState({ ...handleSearchInputChange(this.state.searchFields, name, value) })
    }

    onSearch = () => {
      this.setState({
        loading: true,
        ...clearModal,
        page: 0,
      })
      const searchFields = this.state.searchFields
      
      api.post('api/manage/company/search', searchFields).then(response => {
        const users = response.data.results.companies.data
          
        this.setState({
          users: users,
          pages: response.data.results.companies.last_page,
          loading: false,
          page: this.state.page,
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

    handleClose = () => {
      this.setState({ ...clearModal })
    }

    checkIfNull = (data) => {
      const valueNotSet = <span className='profile-details-individual-value empty'>{ LANG[localStorage.JobChoiceLanguage].valueNotSet }</span>
      return data ? data: valueNotSet
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
            Header: LANG[localStorage.JobChoiceLanguage].clientID,
            id: "id",
            headerClassName: "col-center rt-header-text-area-wrap text-align-center",
            className: "col-center",
            width: 80,
            accessor: d => <span>{ d.id }</span>
        },
        {
          Header: LANG[localStorage.JobChoiceLanguage].companyName,
          id: "name",
          headerClassName: "rt-header-text-area-wrap",
          className: "rt-td-text-area-wrap",
          accessor: d => {
            const company_name = d.company_name ? `${d.company_name}` : 
              <span className='profile-details-individual-value empty'>{ LANG[localStorage.JobChoiceLanguage].valueNotSet }</span>
            return <Link to={'/admin/manage/client/' + d.id}>{company_name}</Link>}
        },
        {
          Header: LANG[localStorage.JobChoiceLanguage].prefecture,
          id: "prefectures",
          headerClassName: "rt-header-text-area-wrap",
          className: "rt-td-text-area-wrap",
          width: 120,
          accessor: d => <span>{ this.checkIfNull(d.geolocation.prefectures) }</span>
        },
        {
          Header: LANG[localStorage.JobChoiceLanguage].address,
          id: "address",
          headerClassName: "rt-header-text-area-wrap",
          className: "rt-td-text-area-wrap",
          width: 160,
          accessor: d => <span>{ this.checkIfNull(d.geolocation.complete_address) }</span>
        },
        {
          Header: LANG[localStorage.JobChoiceLanguage].contactNo,
          id: "contact_no",
          headerClassName: "rt-header-text-area-wrap",
          className: "rt-td-text-area-wrap",
          width: 130,
          accessor: d => d.user.contact_no 
        },
        {
          Header: LANG[localStorage.JobChoiceLanguage].email,
          id: "email",
          headerClassName: "rt-header-text-area-wrap",
          className: "rt-td-text-area-wrap",
          accessor: d => d.user.email ? d.user.email : LANG[localStorage.JobChoiceLanguage].valueNotSet
        },
        {
          Header: LANG[localStorage.JobChoiceLanguage].lastPublishedDate,
          id: "publishedDate",
          headerClassName: "rt-header-text-area-wrap col-center",
          className: "rt-td-text-area-wrap col-center",
          width: 140,
          accessor: d => d.last_published_date[0] ? DateTimeFormat(d.last_published_date[0].date) : '-'
        },
        {
          Header: LANG[localStorage.JobChoiceLanguage].numOfUndisclosed,
          id: "numberOfUndisclosed",
          headerClassName: "rt-header-text-area-wrap col-center",
          className: "rt-td-text-area-wrap col-center",
          accessor: d =>
          <NumberFormat
            value={d.number_of_undisclosed ? d.number_of_undisclosed : "0"}
            displayType={'text'}
            thousandSeparator={true}
          />
        },
    ]

    return (
      <div className="admin-background manage-accounts-area col-md-9 col-sm-12 col-xs-12">
        <Breadcrumb className="admin-breadcrumbs-row">
          <Breadcrumb.Item hred="/admin">{ LANG[localStorage.JobChoiceLanguage].dashboard }</Breadcrumb.Item>/
          <Breadcrumb.Item active>{ LANG[localStorage.JobChoiceLanguage].clientList }</Breadcrumb.Item>
        </Breadcrumb>
        <div className="manage-job-area">
          <div className="container-fluid">
            <div className="admin-manage-top">
            <h3>{ LANG[localStorage.JobChoiceLanguage].clientList }</h3>
            </div>
            <div>
              <SearchFieldContainer innerSearchStyles="flex-row-start" searchFieldStyles="flex-row-start flex-wrap job-offer-management-search-container">
                <div className="user-management-search-data">
                  <Input
                    label={ LANG[localStorage.JobChoiceLanguage].keyword }
                    inputStyles="client-management-search-field"
                    onChange={this.handleChange}
                    value={this.state.searchFields.keyword}
                    field="keyword"
                    noBadge={true}
                  />
                </div>
                <div className="user-management-search-data">
                  <Input
                    label={ LANG[localStorage.JobChoiceLanguage].prefectures }
                    inputStyles="client-management-search-field"
                    onChange={this.handleChange}
                    value={this.state.searchFields.prefectures}
                    field="prefectures"
                    noBadge={true}
                  />
                </div>
                <div className="user-management-search-data">
                  <Input
                    label={ LANG[localStorage.JobChoiceLanguage].address }
                    inputStyles="client-management-search-field"
                    onChange={this.handleChange}
                    value={this.state.searchFields.complete_address}
                    field="complete_address"
                    noBadge={true}
                  />
                </div>
                <div className="user-management-search-data">
                  <ContactNumberInput
                    label={ LANG[localStorage.JobChoiceLanguage].cellphoneNumber }
                    inputStyles="client-management-search-field"
                    onChange={this.handleChange}
                    placeholder="xxxxxxxxxx"
                    field="contact_no"
                    value={this.state.searchFields.contact_no}
                    noBadge={true}
                  />
                </div>
                <div className="user-management-search-data">
                  <Input
                    label={ LANG[localStorage.JobChoiceLanguage].email }
                    inputStyles="client-management-search-field"
                    onChange={this.handleChange}
                    value={this.state.searchFields.email}
                    field="email"
                    noBadge={true}
                  />
                </div>
                <div className="user-management-search-data search-next-row">
                  <label className="admin-user-list-search-label">
                    { LANG[localStorage.JobChoiceLanguage].postingJob } :
                  </label>
                  <div className="admin-user-radio-box-input-field">
                    <div>
                      <input type="radio" name="has_job_posted" value="all"
                            checked={this.state.searchFields.has_job_posted === "all"}
                            onChange={this.handleClickRadioButton} className="input-inline-radio"/>
                      <span>{ LANG[localStorage.JobChoiceLanguage].all }</span>
                    </div>
                    <div>
                      <input type="radio" name="has_job_posted" value="yes"
                            checked={this.state.searchFields.has_job_posted === "yes"}
                            onChange={this.handleClickRadioButton} className="input-inline-radio"/>
                      <span>{ LANG[localStorage.JobChoiceLanguage].yes }</span>
                    </div>
                    <div>
                      <input type="radio" name="has_job_posted" value="none"
                            checked={this.state.searchFields.has_job_posted === "none"}
                            onChange={this.handleClickRadioButton} className="input-inline-radio"/>
                      <span>{ LANG[localStorage.JobChoiceLanguage].none }</span>
                    </div>
                  </div>
                </div>
                <div className="user-management-search-data search-next-row">
                  <label className="admin-user-list-search-label">
                    { LANG[localStorage.JobChoiceLanguage].notDisclosed } :
                  </label>
                  <div className="admin-user-radio-box-input-field">
                    <div>
                      <input type="radio" name="has_not_disclosed" value="all"
                            checked={this.state.searchFields.has_not_disclosed === "all"}
                            onChange={this.handleClickRadioButton} className="input-inline-radio"/>
                      <span>{ LANG[localStorage.JobChoiceLanguage].all }</span>
                    </div>
                    <div>
                      <input type="radio" name="has_not_disclosed" value="yes"
                            checked={this.state.searchFields.has_not_disclosed === "yes"}
                            onChange={this.handleClickRadioButton} className="input-inline-radio"/>
                      <span>{ LANG[localStorage.JobChoiceLanguage].yes }</span>
                    </div>
                    <div>
                      <input type="radio" name="has_not_disclosed" value="none"
                            checked={this.state.searchFields.has_not_disclosed === "none"}
                            onChange={this.handleClickRadioButton} className="input-inline-radio"/>
                      <span>{ LANG[localStorage.JobChoiceLanguage].none }</span>
                    </div>
                  </div>
                </div>
                <button
                  className="admin-user-list-search-btn search-btn no-margin"
                  onClick={this.onSearch}>
                  {LANG[localStorage.JobChoiceLanguage].search}
                </button>
              </SearchFieldContainer>
            </div>
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
                  api.get('api/manage/company?page='+(state.page+1)).then(response => {
                    const users = response.data.results.companies.data
          
                    this.setState({
                      users: users,
                      pages: response.data.results.companies.last_page,
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

export default connect(mapStateToProps)(ManageClients)
