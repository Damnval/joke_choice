import React, { Component } from 'react'
import './ManageUsers.scss'
import { Redirect, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import api from '../../../utilities/api'
import {Breadcrumb} from 'react-bootstrap'
import { LANG, EM } from '../../../constants'
import JobChoiceReactTable from '../../../components/jobChoiceReactTable/JobChoiceReactTable'
import { ErrorModal, ClearModal, Age, DateTimeFormat, handleSearchInputChange } from '../../../helpers'
import {contactRegex} from '../../../regex'
import Modal from '../../../components/modal/Modal'
import "react-datepicker/dist/react-datepicker.css"
import {enUS, ja} from 'date-fns/esm/locale'
import NumberFormat from 'react-number-format'
import SearchFieldContainer from '../../../components/searchFieldContainer/SearchFieldContainer'
import Input from '../../../components/input/Input'
import ContactNumberInput from '../../../components/contactNumberInput/ContactNumberInput'
import InputNumber from '../../../components/inputNumber/InputNumber'

const errorModal = {...ErrorModal()}
const clearModal = {...ClearModal()}
class ManageUsers extends Component {
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
            gender: "all",
            minAge: "",
            maxAge: "",
            has_applied_job: "1",
            has_shared_job: "0"
          },
          confirmDelete: {
            messageKey: null,
            message: '',
            show: false,
            id: 0
          }
        }

        this.handleClose = this.handleClose.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }
    
    componentDidMount() {
      this.props.handleLoadPage(false)
    }

    getData() {
      api.get('api/manage/job-seeker?page=1').then(response => {
        const users = response.data.results.job_seekers.data

          this.setState({
            users: users,
            pages: response.data.results.job_seekers.last_page,
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

    handleClose = () => {
      this.setState({ ...clearModal })
    }

    handleChange = (name, value) => {
      if (name === "contact_no" && (value.length > 0 && !contactRegex.test(value))) {
      } else if (name === "has_shared_job") {
        this.state.searchFields.has_shared_job === "1" ?
          this.setState({ ...handleSearchInputChange(this.state.searchFields, name, "0") }) :
          this.setState({ ...handleSearchInputChange(this.state.searchFields, name, "1") })
      } else {
        this.setState({ ...handleSearchInputChange(this.state.searchFields, name, value) })
      }
    }

    handleClickRadioButton = (e) => {
      const {name, value} = e.target
      this.setState({ ...handleSearchInputChange(this.state.searchFields, name, value) })
    }

    onSearch = () => {
      this.setState({
        loading: true,
        ...clearModal
      })
      const searchFields = this.state.searchFields
      const credentials = { prefectures: searchFields.prefectures,
                            email: searchFields.email,
                            contact_no: searchFields.contact_no,
                            gender:searchFields.gender,
                            complete_address: searchFields.complete_address,
                            age: {max: searchFields.maxAge, min: searchFields.minAge},
                            has_shared_job: searchFields.has_shared_job,
                            has_applied_job: searchFields.has_applied_job,
                            keyword: searchFields.keyword,
                          }
      
      api.post('api/manage/job-seeker/search', credentials).then(response => {
        const users = response.data.results.job_seekers.data

        this.setState({
          users: users,
          pages: response.data.results.job_seekers.last_page,
          loading: false,
        })
      }).catch(error => {
        console.log(error)
        this.setState({ 
          ...errorModal,
          loading: false
        })
      })
    }

    renderCheckBox = (key, obj, field) => {
      const {name, name_jp, value} = obj
      return (
        <span key={name}>
          <label className="checkbox-box">
            <input
              name={key}
              type="checkbox"
              checked={value}
              onChange={e => this.toggleCheckbox(e, field)}
            />
          </label>
          <label className="search-checkbox-label">{this.capitalize(localStorage.JobChoiceLanguage === 'JP' ? name_jp: name)}</label>
        </span>
      )
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
            Header: LANG[localStorage.JobChoiceLanguage].userID,
            id: "id",
            headerClassName: "col-center rt-header-text-area-wrap text-align-center",
            className: "col-center",
            width: 60,
            accessor: d => <span>{ d.id }</span>
        },
        {
            Header: LANG[localStorage.JobChoiceLanguage].justName,
            id: "name",
            headerClassName: "rt-header-text-area-wrap",
            className: "rt-td-text-area-wrap",
            width: 140,
            accessor: d => {
              const first_name = d.user.first_name ? d.user.first_name : ''
              const last_name = d.user.last_name ? d.user.last_name : ''
              const full_name = first_name || last_name ? `${last_name} ${first_name}` : 
                <span className='profile-details-individual-value empty'>{ LANG[localStorage.JobChoiceLanguage].valueNotSet }</span>
              return <Link to={'/admin/manage/job-seeker/' + d.id}>{full_name}</Link>}
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
          Header: LANG[localStorage.JobChoiceLanguage].gender,
          id: "gender",
          headerClassName: "rt-header-text-area-wrap",
          className: "rt-td-text-area-wrap",
          width: 100,
          accessor: d => <span>{ EM[localStorage.JobChoiceLanguage].GENDER.filter(el => el.value === d.gender)[0].name }</span>
        },
        {
          Header: LANG[localStorage.JobChoiceLanguage].age,
          id: "age",
          headerClassName: "rt-header-text-area-wrap col-center",
          className: "rt-td-text-area-wrap col-center",
          width: 110,
          accessor: d => <span>{ d.birth_date ? Age(d.birth_date) :'-' }</span>
        },
        {
          Header: LANG[localStorage.JobChoiceLanguage].contactNo,
          id: "contact_no",
          headerClassName: "rt-header-text-area-wrap",
          className: "rt-td-text-area-wrap",
          width: 140,
          accessor: d => d.user.contact_no 
        },
        {
          Header: LANG[localStorage.JobChoiceLanguage].email,
          id: "email",
          headerClassName: "rt-header-text-area-wrap",
          className: "rt-td-text-area-wrap email",
          width: 180,
          accessor: d => <div className="admin-email-management">{d.user.email ? d.user.email : LANG[localStorage.JobChoiceLanguage].valueNotSet}</div>
        },
        {
          Header: LANG[localStorage.JobChoiceLanguage].lastLogin,
          id: "loginDate",
          headerClassName: "rt-header-text-area-wrap col-center",
          className: "rt-td-text-area-wrap col-center",
          width: 140,
          accessor: d => d.user.last_login_at ? DateTimeFormat(d.user.last_login_at) : '-'
        },
        {
          Header: LANG[localStorage.JobChoiceLanguage].totalNumberOfApplications,
          id: "totalNumberOfApplications",
          headerClassName: "rt-header-text-area-wrap col-center",
          className: "rt-td-text-area-wrap col-center",
          accessor: d =>
          <NumberFormat
            value={d.count_application ? d.count_application : "0"}
            displayType={'text'}
            thousandSeparator={true}
          />
        },
        {
          Header: LANG[localStorage.JobChoiceLanguage].numberOfShares,
          id: "numberOfShares",
          headerClassName: "rt-header-text-area-wrap col-center",
          className: "rt-td-text-area-wrap col-center",
          accessor: d => 
          <NumberFormat
            value={d.count_shared_jobs ? d.count_shared_jobs : "0"}
            displayType={'text'}
            thousandSeparator={true}
          />
        },
    ]

    return (
      <div className="admin-background manage-accounts-area col-md-9 col-sm-12 col-xs-12">
        <Breadcrumb className="admin-breadcrumbs-row">
          <Breadcrumb.Item hred="/admin">{ LANG[localStorage.JobChoiceLanguage].dashboard }</Breadcrumb.Item>/
          <Breadcrumb.Item active>{ LANG[localStorage.JobChoiceLanguage].userList }</Breadcrumb.Item>
        </Breadcrumb>
        <div className="manage-user-area">
          <div className="container-fluid">
            <div className="admin-manage-top">
            <h3>{ LANG[localStorage.JobChoiceLanguage].userList }</h3>
            </div>
            <div>
              <SearchFieldContainer innerSearchStyles="flex-row-start" searchFieldStyles="flex-row-start flex-wrap job-offer-management-search-container">
                <div className="user-management-search-data">
                  <Input
                    label={ LANG[localStorage.JobChoiceLanguage].keyword }
                    inputStyles="user-management-search-field"
                    onChange={this.handleChange}
                    value={this.state.searchFields.keyword}
                    field="keyword"
                    noBadge={true}
                  />
                </div>
                <div className="user-management-search-data">
                  <Input
                    label={ LANG[localStorage.JobChoiceLanguage].prefectures }
                    inputStyles="user-management-search-field"
                    onChange={this.handleChange}
                    value={this.state.searchFields.prefectures}
                    field="prefectures"
                    noBadge={true}
                  />
                </div>
                <div className="user-management-search-data">
                  <Input
                    label={ LANG[localStorage.JobChoiceLanguage].address }
                    inputStyles="user-management-search-field"
                    onChange={this.handleChange}
                    value={this.state.searchFields.complete_address}
                    field="complete_address"
                    noBadge={true}
                  />
                </div>
                <div className="user-management-search-data">
                  <ContactNumberInput
                    label={ LANG[localStorage.JobChoiceLanguage].cellphoneNumber }
                    inputStyles="user-management-search-field"
                    onChange={this.handleChange}
                    placeholder="xxxxxxxxxx"
                    field="contact_no"
                    value={this.state.searchFields.contact_no}
                    noBadge={true}
                  />
                </div>
                <div className="user-management-search-data">
                  <Input
                    label={ LANG[localStorage.JobChoiceLanguage].emailAddress }
                    inputStyles="user-management-search-field"
                    onChange={this.handleChange}
                    value={this.state.searchFields.email}
                    field="email"
                    noBadge={true}
                  />
                </div>
                <div className="user-management-search-data">
                  <label className="admin-user-list-search-label">
                  { LANG[localStorage.JobChoiceLanguage].gender }
                  </label>
                  <div className="admin-user-radio-box-input-field">
                    <div>
                      <input type="radio" name="gender" value="all"
                            checked={this.state.searchFields.gender === "all"}
                            onChange={this.handleClickRadioButton} className="input-inline-radio"/>
                      <span>{ LANG[localStorage.JobChoiceLanguage].all }</span>
                    </div>
                    <div>
                      <input type="radio" name="gender" value="male"
                            checked={this.state.searchFields.gender === "male"}
                            onChange={this.handleClickRadioButton} className="input-inline-radio"/>
                      <span>{ LANG[localStorage.JobChoiceLanguage].male }</span>
                    </div>
                    <div>
                      <input type="radio" name="gender" value="female"
                            checked={this.state.searchFields.gender === "female"}
                            onChange={this.handleClickRadioButton} className="input-inline-radio"/>
                      <span>{ LANG[localStorage.JobChoiceLanguage].female }</span>
                    </div>
                  </div>
                </div>
                <div className="user-management-search-data flex">
                  <InputNumber
                    label={ LANG[localStorage.JobChoiceLanguage].age }
                    inputStyles="user-management-search-age"
                    onChange={this.handleChange}
                    value={this.state.searchFields.minAge}
                    field="minAge"
                    noBadge={true}
                  />
                  <span className="squig">~</span>
                  <InputNumber
                    inputStyles="user-management-search-age"
                    onChange={this.handleChange}
                    value={this.state.searchFields.maxAge}
                    field="maxAge"
                    noBadge={true}
                  />
                </div>
                <div className="user-management-search-data">
                  <label className="client-job-list-search-label">
                  { LANG[localStorage.JobChoiceLanguage].userWithApplication }
                  </label>
                  <div className="admin-user-radio-box-input-field">
                    <div>
                      <input type="radio" name="has_applied_job" value={1}
                            checked={this.state.searchFields.has_applied_job === "1"}
                            onChange={this.handleClickRadioButton} className="input-inline-radio"/>
                      <span>{ LANG[localStorage.JobChoiceLanguage].yes }</span>
                    </div>
                    <div>
                      <input type="radio" name="has_applied_job" value={0}
                            checked={this.state.searchFields.has_applied_job === "0"}
                            onChange={this.handleClickRadioButton} className="input-inline-radio"/>
                      <span>{ LANG[localStorage.JobChoiceLanguage].none }</span>
                    </div>
                  </div>
                </div>
                <div className="user-management-search-data">
                  <div className="admin-user-list-check-box-input-field">
                    <input type="checkbox"
                      name="has_shared_job"
                      checked={this.state.searchFields.has_shared_job === "1"}
                      value="1"
                      onChange={(e) => this.handleChange(e.target.name, e.target.value)} />
                      <span>{ LANG[localStorage.JobChoiceLanguage].shareExperience }</span>
                  </div>
                </div>
              <button
                className="admin-user-list-search-btn search-btn"
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
                  api.get('api/manage/job-seeker?page='+(state.page+1)).then(response => {
                    const users = response.data.results.job_seekers.data

                      this.setState({
                        users: users,
                        pages: response.data.results.job_seekers.last_page,
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

export default connect(mapStateToProps)(ManageUsers)
