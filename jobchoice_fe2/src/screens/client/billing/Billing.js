import React, { Component } from 'react'
import './../../admin/manageJobCategories/ManageJobCategories.scss'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { Breadcrumb } from 'react-bootstrap'
import { LANG, EM } from '../../../constants'
import { bindActionCreators } from 'redux'
import * as authActions from '../../../store/auth/actions'
import BillingTable from './BillingTable'
import DefaultClientPage from '../defaultClientPage/DefaultClientPage'
import api from '../../../utilities/api'
import './Billing.scss'
import { ErrorModal } from '../../../helpers'
import BillingSearch from './BillingSearch'

const errorModal = {...ErrorModal()}
class Billing extends Component {
  constructor(props) {
    super(props);

    this.state = {
      billings: [],
      total_amount: 0,
      sub_total_amount: 0,
      consumption_tax_fee: 0,
      isLoading: false,
      searchFields: {
        month: '',
        year: ''
      },
      invalidSearch: false,
      modal: {
        messageKey: null,
        message: '',
        modal: false,
        modalType: '',
        redirect: null,
      },
      excel: []
    }
    this.updateLoading = this.updateLoading.bind(this)
    this.infoChange = this.infoChange.bind(this)
    this.getData = this.getData.bind(this)
    this.onSearch = this.onSearch.bind(this)
  }

  componentDidMount() {
    const moment = require('moment')
    this.setState({
      searchFields: {
        month: moment().month()+1,
        year: moment().year()
      },
      isLoading: true
    }, () => {
      this.getData()
    })
  }

  getData = () => {
    const credentials = {
      ...this.state.searchFields
    }
    api.post('api/company-billings', credentials).then(response => {
      let billingCode = LANG[localStorage.JobChoiceLanguage].billingCode
      let referenceID = LANG[localStorage.JobChoiceLanguage].referenceID
      let unitPrice = LANG[localStorage.JobChoiceLanguage].unitPrice
      let quantity = LANG[localStorage.JobChoiceLanguage].quantity
      let amount = LANG[localStorage.JobChoiceLanguage].amount
      let subTotal = LANG[localStorage.JobChoiceLanguage].subTotal
      let tax = LANG[localStorage.JobChoiceLanguage].tax
      let totalFee = LANG[localStorage.JobChoiceLanguage].totalFee
      let details = LANG[localStorage.JobChoiceLanguage].details

      const excel = [
        {
          columns: [billingCode, details, referenceID, unitPrice, quantity, amount],
          data: response.data.results.billings.map((value, key) => {
            return [
              value.billing_code,
              EM[localStorage.JobChoiceLanguage].DETAIL_TYPE.filter(function(el) { return el.value === value.detail_type ? el : null })[0].name,
              value.billable.reference_id,
              value.billable.price,
              1,
              value.billable.incentive_per_share
            ]
          })
        },
        {
          xSteps: 4,
          ySteps: 2,
          columns: ["", ""],
          data: [
              [subTotal, `¥ ${response.data.results.sub_total_amount}`],
              [tax, `¥ ${response.data.results.consumption_tax_fee}`],
              [totalFee, `¥ ${response.data.results.total_amount_fee}`]
          ]
        }
      ]
      this.setState({
        billings: response.data.results.billings,
        total_amount: response.data.results.total_amount_fee,
        sub_total_amount: response.data.results.sub_total_amount,
        consumption_tax_fee: response.data.results.consumption_tax_fee,
        isLoading: false,
        excel: excel
      })
    }).catch(error => {
      console.log(error)
      this.setState({
        ...errorModal,
        isLoading: false
      })
    })
  }


  updateLoading = (state) => {
    this.setState({isLoading: state})
  }

  infoChange = (name, value) => {
    this.setState({
      searchFields: {
        ...this.state.searchFields,
        [name]: value
      }
    }, () => {
      if (this.state.searchFields.month && this.state.searchFields.year === '') {
        this.setState({
          invalidSearch: true
        })
      } else {
        this.setState({
          invalidSearch: false
        })
      }
    })
  }

  onSearch = () => {
    this.setState({
      isLoading: true
    }, () => {
      this.getData()
    })
  }

  render() {

    if (!(this.props.user.data.company)) {
      return (<Redirect to="/home" />)
    }

    return (
      <DefaultClientPage modal={this.state.modal} isLoading={this.state.isLoading}>
        <Breadcrumb className="breadcrumb-featured job-list">
          <Breadcrumb.Item href="/home">{ LANG[localStorage.JobChoiceLanguage].dashboard }</Breadcrumb.Item>/
          <Breadcrumb.Item active>{ LANG[localStorage.JobChoiceLanguage].billing }</Breadcrumb.Item>
        </Breadcrumb>
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12 flex-column justify-content-center">
              <BillingSearch
                invalidSearch={this.state.invalidSearch}
                onSearch={this.onSearch}
                infoChange={this.infoChange}
                searchFields={this.state.searchFields}
                error={this.state.invalidSearch}
              />
              { this.state.billings.length > 0 &&
                <BillingTable
                  billings={this.state.billings}
                  total_amount={this.state.total_amount}
                  sub_total_amount={this.state.sub_total_amount}
                  consumption_tax_fee={this.state.consumption_tax_fee}
                  excel={this.state.excel}
                />
              }
              { (!this.state.isLoading && this.state.billings.length === 0) &&
                <div className="no-data-records job-list-no-data-found">{ LANG[localStorage.JobChoiceLanguage].noBillingFound }</div>
              }
            </div>
          </div>
        </div>
        
      </DefaultClientPage>
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

export default connect(mapStateToProps, mapDispatchToProps)(Billing)
