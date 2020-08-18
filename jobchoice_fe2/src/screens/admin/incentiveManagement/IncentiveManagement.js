import React, { Component } from 'react'
import './IncentiveManagement.scss'
import { Redirect, Link } from 'react-router-dom'
import { Breadcrumb } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import api from '../../../utilities/api'
import Modal from '../../../components/modal/Modal'
import { LANG, EM } from '../../../constants'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../../store/auth/actions'
import JobChoiceReactTable from '../../../components/jobChoiceReactTable/JobChoiceReactTable'
import { ErrorModal, ClearModal, FirstDayCurrentMonth, LastDayCurrentMonth } from '../../../helpers'
import ReactTable from 'react-table'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import {enUS, ja} from 'date-fns/esm/locale'
import { DateFormat, ReturnFullName, DateSubmitFormat } from "../../../helpers"
import NumberFormat from 'react-number-format'
import ReactExport from "react-data-export"
import SearchFieldContainer from '../../../components/searchFieldContainer/SearchFieldContainer'

const clearModal = {...ClearModal()}
const errorModal = {...ErrorModal()}
// const startOfMonth = FirstDayCurrentMonth()
// const endOfMonth = LastDayCurrentMonth()

class IncentiveManagement extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            data: [],
            pages: -1,
            loading: true,
            expanded: true,
            ...clearModal,
            searchFields: {
              start_date: FirstDayCurrentMonth().firstday.toDate(),
              end_date: LastDayCurrentMonth().lastday.toDate(),
            },
            confirmDelete: {
                message: '',
                show: false,
                id: 0
            },
            excel: null,
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
        start_date: DateSubmitFormat(this.state.searchFields.start_date ?
          this.state.searchFields.start_date : FirstDayCurrentMonth().firstday.toDate()),
        end_date: DateSubmitFormat(this.state.searchFields.end_date ?
          this.state.searchFields.end_date : LastDayCurrentMonth().lastday.toDate())
      }
      
      api.post('api/manage/user-incentive/search', credentials).then(response => {
        let name = LANG[localStorage.JobChoiceLanguage].justName
        let amount = LANG[localStorage.JobChoiceLanguage].shareRenumeration
        let kana = LANG[localStorage.JobChoiceLanguage].kana
        let bankName = LANG[localStorage.JobChoiceLanguage].bankName
        let bankCode = LANG[localStorage.JobChoiceLanguage].headerBankCode
        let branchName = LANG[localStorage.JobChoiceLanguage].branchName
        let branchCode = LANG[localStorage.JobChoiceLanguage].headerBranchCode
        let accountNumber = LANG[localStorage.JobChoiceLanguage].accountNum
  
        // This will be used to format Excel Download File
        const excel = [
          {
            columns: ["", ""],
            data: [
                ["Months of Confirmed Incentive", this.state.searchFields.start_date, "~", this.state.searchFields.end_date]
            ]
          },
          {
            ySteps: 4,
            columns: [name, amount, kana, bankName, bankCode, branchName, branchCode, accountNumber],
            data: response.data.results.user.data.map((value, key) => {
              const fullNameKana = ReturnFullName(value.first_name_kana, value.last_name_kana) ? 
                ReturnFullName(value.first_name_kana, value.last_name_kana) : ''
              return [
                `${value.first_name} ${value.last_name}`,
                value.total_share_money,
                fullNameKana,
                value.bank_account.bank_name ? value.bank_account.bank_name : "-",
                value.bank_account.bank_code ? value.bank_account.bank_code : "-",
                value.bank_account.branch_name ? value.bank_account.branch_name : "-",
                value.bank_account.branch_code ? value.bank_account.branch_code : "-",
                value.bank_account.account_number ? value.bank_account.account_number : "-"
              ]
            })
          },
        ]

        this.setState({ 
          loading: false,
          data: response.data.results.user.data,
          pages: response.data.results.user.last_page,
          excel: excel
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

    const data = this.state.data
    const ExcelFile = ReactExport.ExcelFile;
    const ExcelSheet = ReactExport.ExcelFile.ExcelSheet

    console.log(FirstDayCurrentMonth(), LastDayCurrentMonth())

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
            Header: LANG[localStorage.JobChoiceLanguage].userID,
            id: "userId",
            headerClassName: "col-center rt-header-text-area-wrap",
            className: "col-center rt-td-text-area-wrap",
            width: 65,
            accessor: d =>
              <span>{d.id}</span>
          },
          {
            Header: LANG[localStorage.JobChoiceLanguage].justName,
            id: "justName",
            headerClassName: "rt-header-text-area-wrap",
            className: "rt-td-text-area-wrap",
            accessor: d => 
            <Link to={'/admin/manage/job-seeker/' + d.job_seeker_id}><span>{this.checkIfNull(d.first_name)}</span></Link>
          },
          {
            Header: `${LANG[localStorage.JobChoiceLanguage].gender}`,
            id: "gender",
            headerClassName: "col-center rt-header-text-area-wrap",
            className: "col-center rt-td-text-area-wrap",
            width: 120,
            accessor: d =>
              d.gender ?
              <span> {EM[localStorage.JobChoiceLanguage].GENDER.filter(el => el.value === d.gender ? el : null)[0].name} </span> :
              <span className='profile-details-individual-value empty'>{ LANG[localStorage.JobChoiceLanguage].valueNotSet }</span>
          },
          {
            Header: `${LANG[localStorage.JobChoiceLanguage].age}`,
            id: "age",
            headerClassName: "col-center rt-header-text-area-wrap",
            className: "col-center  rt-td-text-area-wrap",
            width: 120,
            accessor: d =>
              d.birth_date ? 
                <span> {moment().diff(d.birth_date, 'years')} </span>
                : <span className='profile-details-individual-value empty'>{ LANG[localStorage.JobChoiceLanguage].valueNotSet }</span>

          },
          {
            Header: LANG[localStorage.JobChoiceLanguage].prefecture,
            headerClassName: "col-center rt-header-text-area-wrap",
            id: "prefecture",
            className: "col-center rt-td-text-area-wrap",
            width: 140,
            accessor: d => <span>{this.checkIfNull(d.prefectures)}</span>
          },
          {
            Header: LANG[localStorage.JobChoiceLanguage].totalShared,
            headerClassName: "col-center rt-header-text-area-wrap",
            id: "totalShared",
            className: "col-center rt-td-text-area-wrap",
            accessor: d => 
              <span>
                <NumberFormat
                  value={d.shared_job_count}
                  displayType={'text'}
                  thousandSeparator={true}
                />
              </span>
          },
          {
            Header: LANG[localStorage.JobChoiceLanguage].totalDisclosed,
            headerClassName: "col-center rt-header-text-area-wrap",
            id: "totalDisclosed",
            className: "col-center rt-td-text-area-wrap",
            accessor: d =>
            <span>
              <NumberFormat
                value={d.no_disclosed}
                displayType={'text'}
                thousandSeparator={true}
              />
            </span>
          },
          {
            Header: LANG[localStorage.JobChoiceLanguage].shareRenumeration,
            headerClassName: "col-center rt-header-text-area-wrap",
            id: "shareRenumeration",
            className: "col-center rt-td-text-area-wrap",
            accessor: d => 
            <span>
              <NumberFormat
                value={d.total_share_money}
                displayType={'text'}
                thousandSeparator={true}
              /> 円 
            </span>
          },
        ]

      const applicantManagement = [
        {
          Header: LANG[localStorage.JobChoiceLanguage].jobTitle,
          id: "noOfApplications",
          headerClassName: "job-offer-management-sub-header col-center",
          className: "rt-td-text-area-wrap col-center",
          accessor: d => <Link to={'/admin/manage/job-offer/for-approval/' + d.job.id}><span>{d.job.title}</span></Link>
        },
        {
          Header: LANG[localStorage.JobChoiceLanguage].disclosedDate,
          id: "noOfUnopened",
          headerClassName: "job-offer-management-sub-header col-center",
          className: "rt-td-text-area-wrap col-center",
          accessor: d => <span>{DateFormat(d.updated_at)}</span>
        },
        {
          Header: LANG[localStorage.JobChoiceLanguage].incentivePerShare,
          id: "noOfDisclosure",
          headerClassName: "job-offer-management-sub-header col-center",
          className: "rt-td-text-area-wrap col-center",
          accessor: d =>
            <span>
              <NumberFormat
                value={d.job.incentive_per_share}
                displayType={'text'}
                thousandSeparator={true}
              /> 円 
            </span>
        },
        {
          Header: LANG[localStorage.JobChoiceLanguage].justName,
          headerClassName: "status job-offer-management-sub-header col-center",
          id: "noOfAccepted",
          className: "col-center status col-center",
          accessor: d => <Link to={'/admin/manage/job-seeker/' + d.job_seeker_id}><span>{this.checkIfNull(d.job_seeker.user.first_name)}</span></Link>
        } 
      ]

    return (
      <div className="admin-background manage-jobs-area col-md-9 col-sm-12 col-xs-12">
        <Breadcrumb className="admin-breadcrumbs-row">
          <Breadcrumb.Item href="/admin">
            { LANG[localStorage.JobChoiceLanguage].dashboard }
          </Breadcrumb.Item>/
          <Breadcrumb.Item active>{ LANG[localStorage.JobChoiceLanguage].incentiveMngmnt }</Breadcrumb.Item>
        </Breadcrumb>
        <div className="manage-job-area">
          <div className="container-fluid">
            <div className="admin-manage-top"><h3>{ LANG[localStorage.JobChoiceLanguage].incentiveMngmnt }</h3></div>
            <SearchFieldContainer innerSearchStyles="flex-row-start" searchFieldStyles="flex-row-start flex-wrap incentive-management-search-container">
              <div className="incentive-date-search-data">
                <label className="client-job-list-search-label">
                  {LANG[localStorage.JobChoiceLanguage].postPeriod}
                  <small className="input-instructions">({ LANG[localStorage.JobChoiceLanguage].inputDateRange })</small>
                </label>
                <div className="incentive-date-search-data">
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
                  <span className="mid-date-picker"><span className="squig">~</span></span>
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
              <button
                className="admin-job-offer-list-search-btn search-btn"
                onClick={this.onSearch}>
                {LANG[localStorage.JobChoiceLanguage].search}
              </button>
              <ExcelFile element={<button className="btn btn-secondary btn-excel flex-end"><FontAwesomeIcon icon="file-excel"/>
                {LANG[localStorage.JobChoiceLanguage].dlExcel}</button>}>
                <ExcelSheet dataSet={this.state.excel} name="Billables"/>
              </ExcelFile>
            </SearchFieldContainer>
            <div className="manage-job-table-area">
              <JobChoiceReactTable
                data={data}
                pages={this.state.pages}
                loading={this.state.loading}
                columns={columns}
                expanded={this.state.expanded}
                onFetchData={(state, instance) => {
                    this.props.handleLoadPage(false)
                    const credentials = this.state.searchFields
                    api.post('api/manage/user-incentive/search?page='+(state.page+1), credentials).then(response => {
                      let name = LANG[localStorage.JobChoiceLanguage].justName
                      let amount = LANG[localStorage.JobChoiceLanguage].shareRenumeration
                      let kana = LANG[localStorage.JobChoiceLanguage].kana
                      let bankName = LANG[localStorage.JobChoiceLanguage].bankName
                      let bankCode = LANG[localStorage.JobChoiceLanguage].headerBankCode
                      let branchName = LANG[localStorage.JobChoiceLanguage].branchName
                      let branchCode = LANG[localStorage.JobChoiceLanguage].headerBranchCode
                      let accountNumber = LANG[localStorage.JobChoiceLanguage].accountNum
                
                      // This will be used to format Excel Download File
                      const excel = [
                        {
                          columns: ["", ""],
                          data: [
                              ["Months of Confirmed Incentive", this.state.searchFields.start_date, "~", this.state.searchFields.end_date]
                          ]
                        },
                        {
                          ySteps: 4,
                          columns: [name, amount, kana, bankName, bankCode, branchName, branchCode, accountNumber],
                          data: response.data.results.user.data.map((value, key) => {
                            const fullNameKana = ReturnFullName(value.first_name_kana, value.last_name_kana) ? 
                              ReturnFullName(value.first_name_kana, value.last_name_kana) : ''
                            return [
                              `${value.first_name} ${value.last_name}`,
                              value.total_share_money,
                              fullNameKana,
                              value.bank_account.bank_name ? value.bank_account.bank_name : "-",
                              value.bank_account.bank_code ? value.bank_account.bank_code : "-",
                              value.bank_account.branch_name ? value.bank_account.branch_name : "-",
                              value.bank_account.branch_code ? value.bank_account.branch_code : "-",
                              value.bank_account.account_number ? value.bank_account.account_number : "-"
                            ]
                          })
                        },
                      ]

                      this.setState({
                        data: response.data.results.user.data,
                        pages: response.data.results.user.last_page,
                        excel: excel,
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
                        data={row.original.applied_jobs}
                        columns={applicantManagement}
                        pageSize={row.original.applied_jobs.length}
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
  
  export default connect(mapStateToProps, mapDispatchToProps)(IncentiveManagement)
