import React, { Component } from 'react'
import './../../admin/manageJobCategories/ManageJobCategories.scss'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import BoxContainer from '../../../components/boxContainer/BoxContainer'
import { LANG, EM } from '../../../constants'
import ReactExport from "react-data-export"
import NumberFormat from 'react-number-format'

class BillingTable extends Component {

  render() {
    const ExcelFile = ReactExport.ExcelFile;
    const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
    return (
      <BoxContainer className="no-shadow border client-billing-box">
        <div className="client-total-billing-container">
          <div className="client-total-billing-row">
            <div className="client-total-billing-label">{LANG[localStorage.JobChoiceLanguage].amtBilled}</div>
            <div className="client-total-billing-detail text-align-right">
              <strong>¥ <NumberFormat value={this.props.total_amount.toFixed(2)} displayType={'text'} thousandSeparator={true}/></strong>
            </div>
          </div>
          <ExcelFile element={<button className="btn btn-secondary btn-excel"><FontAwesomeIcon icon="file-excel"/>{LANG[localStorage.JobChoiceLanguage].dlExcel}</button>}>
              <ExcelSheet dataSet={this.props.excel} name="Billables"/>
          </ExcelFile>
        </div>
        <div className="client-grid-billing-table">
          <div className="client-grid-billing-row header border">
            <div className="client-grid-billing-item">{LANG[localStorage.JobChoiceLanguage].billingCode}</div>
            <div className="client-grid-billing-item">{LANG[localStorage.JobChoiceLanguage].details}</div>
            <div className="client-grid-billing-item">{LANG[localStorage.JobChoiceLanguage].referenceID}</div>
            <div className="client-grid-billing-item text-align-right">{LANG[localStorage.JobChoiceLanguage].unitPrice}</div>
            <div className="client-grid-billing-item text-align-right">{LANG[localStorage.JobChoiceLanguage].quantity}</div>
            <div className="client-grid-billing-item text-align-right">{LANG[localStorage.JobChoiceLanguage].amount}</div>
          </div>
          {this.props.billings.map((value, key) => {
            const detail = EM[localStorage.JobChoiceLanguage].DETAIL_TYPE.filter(
              function(el) { return el.value === value.detail_type ? el : null })[0].name
            return (
              <div key={key} className="client-grid-billing-row border">
                <div className="client-grid-billing-item">{value.billing_code}</div>
                <div className="client-grid-billing-item">{detail}</div>
                <div className="client-grid-billing-item">{value.billable.reference_id}</div>
                <div className="client-grid-billing-item text-align-right">¥ <NumberFormat value={value.billable.price.toFixed(2)} displayType={'text'} thousandSeparator={true}/></div>
                <div className="client-grid-billing-item text-align-right">1</div>
                <div className="client-grid-billing-item text-align-right">¥ <NumberFormat value= {value.billable.incentive_per_share.toFixed(2)} displayType={'text'} thousandSeparator={true}/></div>
              </div>
            )
          })}
        </div>
        <div className="client-summary-billing-container">
          <div className="client-summary-billing-row">
            <div className="toper righter lefter">{LANG[localStorage.JobChoiceLanguage].subTotal}</div>
            <div className="toper righter text-align-right">¥ <NumberFormat value={this.props.sub_total_amount.toFixed(2)} displayType={'text'} thousandSeparator={true}/></div>
          </div>
          <div className="client-summary-billing-row">
            <div className="toper righter lefter">{LANG[localStorage.JobChoiceLanguage].tax}</div>
            <div className="toper righter text-align-right">¥ <NumberFormat value={this.props.consumption_tax_fee.toFixed(2)} displayType={'text'} thousandSeparator={true}/></div>
          </div>
          <div className="client-summary-billing-row">
            <div className="toper bottomer righter lefter">{LANG[localStorage.JobChoiceLanguage].totalFee}</div>
            <div className="toper bottomer righter text-align-right">
              <strong>¥ <NumberFormat value={this.props.total_amount.toFixed(2)} displayType={'text'} thousandSeparator={true}/></strong>
            </div>
          </div>
        </div>
      </BoxContainer>
    )

  }
}

const mapStateToProps = state => {
  return state
}

export default connect(mapStateToProps)(BillingTable)
