import React, { Component } from 'react'
import './../JobOfferComponent.scss'
import { Redirect, Link } from 'react-router-dom'
import { Breadcrumb } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import api from '../../../../utilities/api'
import Modal from '../../../../components/modal/Modal'
import { LANG, EM } from '../../../../constants'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../../../store/auth/actions'
import JobChoiceReactTable from '../../../../components/jobChoiceReactTable/JobChoiceReactTable'
import { ErrorModal, ClearModal, DateSubmitFormat } from '../../../../helpers'
import ReactTable from 'react-table'
import SearchFieldContainer from '../../../../components/searchFieldContainer/SearchFieldContainer'
import Input from '../../../../components/input/Input'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import {enUS, ja} from 'date-fns/esm/locale'
import NumberFormat from 'react-number-format'
import InputDropDown from '../../../../components/inputDropDown/InputDropDown'

const clearModal = {...ClearModal()}
const errorModal = {...ErrorModal()}

class JobOfferManagement extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            jobs: [],
            pages: -1,
            loading: true,
            expanded: true,
            ...clearModal,
            searchFields: {
              published_start_date: null,
              published_end_date: null,
              keyword: '',
              publication_status: '',
              disclosed: ""
            },
            confirmDelete: {
                message: '',
                show: false,
                id: 0
            }
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
        published_start_date: this.state.searchFields.published_start_date ? DateSubmitFormat(this.state.searchFields.published_start_date) : null,
        published_end_date: this.state.searchFields.published_end_date ? DateSubmitFormat(this.state.searchFields.published_end_date) : null
      }
      api.post('api/manage/job/search', credentials).then(response => {
        this.setState({ 
          loading: false,
          jobs: response.data.results.jobs.data,
          pages: response.data.results.jobs.last_page,
        })
      }).catch(error => {
        console.log(error)
        this.setState({ 
          ...errorModal,
          loading: false
        })
      })
    }

    handleClickRadioButton = (e) => {
      const value = e.target.value
      this.setState({
        searchFields: {
          ...this.state.searchFields,
          disclosed: value
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

    handleChangeStart(date) {
      const endDate = date > this.state.searchFields.published_end_date ? date : this.state.searchFields.published_end_date
      this.setState({
        searchFields: {
          ...this.state.searchFields,
          published_start_date: date,
          published_end_date: endDate
        }
      })
    }
  
    handleChangeEnd(date) {
      const startDate = date < this.state.searchFields.published_start_date ? date : this.state.searchFields.published_start_date
      this.setState({
        searchFields: {
          ...this.state.searchFields,
          published_start_date: startDate,
          published_end_date: date
        }
      })
    }

    checkIfNull = (data) => {
      const valueNotSet = <span className='profile-details-individual-value empty'>{ LANG[localStorage.JobChoiceLanguage].valueNotSet }</span>
      return data ? data: valueNotSet
    }

    render() {
      const valueNotSet = <span className='profile-details-individual-value empty'>{ LANG[localStorage.JobChoiceLanguage].valueNotSet }</span>
      const moment = require('moment')
      if (!('data' in this.props.user)) {
        return (<Redirect to="/jobs-management" />)
      }

      if (this.props.user.data.job_seeker || this.props.user.data.company) {
        return (<Redirect to="/home" />)
      }

    const data = this.state.jobs

    const columns = [
          {
            expander: true,
            Header: "",
            width: 65,
            className: "justify-content-center",
            Expander: ({ isExpanded, ...rest }) =>
              <div>
                {isExpanded
                  ? <FontAwesomeIcon className="job-offer-management-toggle-table" icon="chevron-down" />
                  : <FontAwesomeIcon className="job-offer-management-toggle-table" icon="chevron-right" />}
              </div>,
            style: {
              cursor: "pointer",
              fontSize: 25,
              padding: "0",
              textAlign: "center",
              userSelect: "none"
            }
          },
          {
            Header: LANG[localStorage.JobChoiceLanguage].company,
            id: "company",
            headerClassName: "rt-header-text-area-wrap",
            className: "rt-td-text-area-wrap",
            width: 200,
            accessor: d =>
              <Link to={'/admin/manage/client/' + d.company_id}>
                {this.checkIfNull(d.company.company_name)}
              </Link>
          },
          {
            Header: LANG[localStorage.JobChoiceLanguage].jobTitle,
            id: "type",
            headerClassName: "rt-header-text-area-wrap",
            className: "rt-td-text-area-wrap",
            width: 200,
            accessor: d =>
            <Link to={'/admin/manage/job-offer/for-approval/' + d.id}>{this.checkIfNull(d.title)}</Link>
          },
          {
            Header: LANG[localStorage.JobChoiceLanguage].employmentStatus,
            id: "employment_status",
            headerClassName: "col-center rt-header-text-area-wrap",
            className: "col-center rt-td-text-area-wrap",
            width: 160,
            accessor: d =>
              <span>
                {d.employment_type ? EM[localStorage.JobChoiceLanguage].EMPLOYMENT_TYPE.filter(el => el.value === d.employment_type ? el : null)[0].name : valueNotSet}
              </span>
          },
          {
            Header: LANG[localStorage.JobChoiceLanguage].postPeriod,
            headerClassName: "col-center rt-header-text-area-wrap",
            id: "post_period ",
            className: "col-center rt-td-text-area-wrap",
            width: 240,
            accessor: d =>
            <span>
              {d.publication.published_start_date ?
                <>
                  {moment(d.publication.published_start_date, "YYYY-MM-DD").format("YYYY/MM/DD")}
                  <span className="squig">~</span> 
                  {moment(d.publication.published_end_date, "YYYY-MM-DD").format("YYYY/MM/DD")}
                </> :
                '-'
              }
            </span>
          },
          {
            Header: LANG[localStorage.JobChoiceLanguage].status,
            headerClassName: "status",
            id: "status",
            className: "col-center status",
            accessor: d => 
              <span className={`job-offer-management-publication-badge ${d.publication.status}`}>
                {d.employment_type ? EM[localStorage.JobChoiceLanguage].PUBLICATION_STATUS.filter(el => el.value === d.publication.status ? el : null)[0].name : valueNotSet}
              </span>
          },
          {
            Header: LANG[localStorage.JobChoiceLanguage].disclosureAmount,
            headerClassName: "col-center rt-header-text-area-wrap",
            id: 'disclosure_amount',
            accessor: d =><>
              <NumberFormat
                value={d.incentive_per_share}
                displayType={'text'}
                thousandSeparator={true}
              /> 円
            </>,
            className: "col-center rt-td-text-area-wrap"
          },
        ]

      const applicantManagement = [
        { Header: LANG[localStorage.JobChoiceLanguage].applicationMgmt,
          headerClassName: "job-offer-management-top-header",
          columns: [
            {
              Header: LANG[localStorage.JobChoiceLanguage].noOfApplications,
              id: "noOfApplications",
              headerClassName: "job-offer-management-sub-header col-center",
              className: "rt-td-text-area-wrap col-center",
              width: 260,
              accessor: d => 
                <span>
                  <NumberFormat
                    value={d.num_applied}
                    displayType={'text'}
                    thousandSeparator={true}
                  />
                </span>
            },
            {
              Header: LANG[localStorage.JobChoiceLanguage].noOfUnopened,
              id: "noOfUnopened",
              headerClassName: "job-offer-management-sub-header col-center",
              className: "rt-td-text-area-wrap col-center",
              width: 260,
              accessor: d => 
                <span>
                  <NumberFormat
                    value={d.num_waiting}
                    displayType={'text'}
                    thousandSeparator={true}
                  />
                </span>
            },
            {
              Header: LANG[localStorage.JobChoiceLanguage].noOfDisclosure,
              id: "noOfDisclosure",
              headerClassName: "job-offer-management-sub-header col-center",
              className: "rt-td-text-area-wrap col-center",
              width: 260,
              accessor: d => 
                <span>
                  <NumberFormat
                    value={d.num_disclosed}
                    displayType={'text'}
                    thousandSeparator={true}
                  />
                </span>
            },
            {
              Header: LANG[localStorage.JobChoiceLanguage].noOfAccepted,
              headerClassName: "status job-offer-management-sub-header col-center",
              id: "noOfAccepted",
              className: "col-center status col-center",
              width: 260,
              accessor: d => 
                <span>
                  <NumberFormat
                    value={d.num_hired}
                    displayType={'text'}
                    thousandSeparator={true}
                  />
                </span>
            },
            {
              Header: LANG[localStorage.JobChoiceLanguage].dateFinalApplication,
              headerClassName: "job-offer-management-sub-header col-center",
              id: "final_applicant",
              className: "col-center",
              accessor: d => d.latest_application ?
                <span>{moment(d.latest_application.created_at, "YYYY-MM-DD").format("YYYY/MM/DD")}</span> :
                <span> - </span>
            }
          ]
        }   
      ]

    return (
      <div className="admin-background manage-jobs-area col-md-9 col-sm-12 col-xs-12">
        <Breadcrumb className="admin-breadcrumbs-row">
          <Breadcrumb.Item href="/admin">
            { LANG[localStorage.JobChoiceLanguage].dashboard }
          </Breadcrumb.Item>/
          <Breadcrumb.Item active>{ LANG[localStorage.JobChoiceLanguage].jobMngmnt }</Breadcrumb.Item>
        </Breadcrumb>
        <div className="manage-job-area">
          <div className="container-fluid">
            <div className="admin-manage-top"><h3>{ LANG[localStorage.JobChoiceLanguage].jobMngmnt }</h3></div>
            <div>
              <SearchFieldContainer innerSearchStyles="flex-row-start" searchFieldStyles="flex-row-start flex-wrap job-offer-management-search-container">
                <div className="job-offer-management-search-data">
                  <Input
                    label={ LANG[localStorage.JobChoiceLanguage].keyword }
                    inputStyles="job-offer-management-search-keyword"
                    onChange={this.handleChange}
                    field="keyword"
                  />
                </div>
                <div className="shared-job-date-search-data">
                <label className="client-job-list-search-label">
                  {LANG[localStorage.JobChoiceLanguage].memo}
                  <small className="input-instructions">({ LANG[localStorage.JobChoiceLanguage].inputDateRange })</small>
                </label>
                <div className="shared-job-date-search-data">
                  <DatePicker
                    className="client-job-list-search-date-picker"
                    dateFormat="yyyy/MM/dd"
                    selectsStart
                    startDate={this.state.searchFields.published_start_date}
                    endDate={this.state.searchFields.published_end_date}
                    selected={this.state.searchFields.published_start_date}
                    onChange={this.handleChangeStart}
                    placeholderText={ LANG[localStorage.JobChoiceLanguage].datePlaceholder }
                    locale={localStorage.JobChoiceLanguage === 'JP' ? ja : enUS}
                  />
                  <span className="mid-date-picker"><span className="squig">~</span></span>
                  <DatePicker
                    className="client-job-list-search-date-picker"
                    dateFormat="yyyy/MM/dd"
                    selectsEnd
                    startDate={this.state.searchFields.published_start_date}
                    endDate={this.state.searchFields.published_end_date}
                    selected={this.state.searchFields.published_end_date}
                    onChange={this.handleChangeEnd}
                    placeholderText={ LANG[localStorage.JobChoiceLanguage].datePlaceholder }
                    locale={localStorage.JobChoiceLanguage === 'JP' ? ja : enUS}
                  />
                </div>
              </div>
              <div className="job-offer-management-search-data">
                <label className="client-job-list-search-label">
                { LANG[localStorage.JobChoiceLanguage].notDisclosed }?
                </label>
                <div className="admin-job-offer-list-radio-box-input-field">
                  <div>
                    <input type="radio" name="disclosed" value=""
                          checked={this.state.searchFields.disclosed === ""}
                          onChange={this.handleClickRadioButton} className="input-inline-radio"/>
                    <span>{ LANG[localStorage.JobChoiceLanguage].all }</span>
                  </div>
                  <div>
                    <input type="radio" name="disclosed" value={0}
                          checked={this.state.searchFields.disclosed === "0"}
                          onChange={this.handleClickRadioButton} className="input-inline-radio"/>
                    <span>{ LANG[localStorage.JobChoiceLanguage].yes }</span>
                  </div>
                  <div>
                    <input type="radio" name="disclosed" value={1}
                          checked={this.state.searchFields.disclosed === "1"}
                          onChange={this.handleClickRadioButton} className="input-inline-radio"/>
                    <span>{ LANG[localStorage.JobChoiceLanguage].none }</span>
                  </div>
                </div>
              </div>
              <div className="shared-job-date-search-data">
                <label className="client-job-list-search-label">{LANG[localStorage.JobChoiceLanguage].publicationStatus}</label>
                <InputDropDown
                  field="publication_status"
                  onChange={this.handleChange}
                  className="client-job-list-search-status"
                >
                  <option value=""></option>
                  {EM[localStorage.JobChoiceLanguage].PUBLICATION_STATUS.map((el, key) => {
                      return (<option key={key} value={el.value}>{el.name}</option>)
                    })
                  }
                </InputDropDown>
              </div>
              <button
                className="admin-job-offer-list-search-btn search-btn"
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
                columns={columns}
                expanded={this.state.expanded}
                onFetchData={(state, instance) => {
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
                SubComponent={(row) => {
                  return (
                    <div style={{ padding: "20px 10px" }}>
                      <ReactTable
                        data={[data[row.index]]}
                        columns={applicantManagement}
                        pageSize={1}
                        showPagination={false}
                        manual
                      />
                    </div>
                  );
                }}
                />
            </div>
          </div>
        </div>
          <Modal 
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
  
  export default connect(mapStateToProps, mapDispatchToProps)(JobOfferManagement)
