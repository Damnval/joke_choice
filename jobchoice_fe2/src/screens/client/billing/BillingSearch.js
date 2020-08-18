import React, { Component } from 'react'
import './../../admin/manageJobCategories/ManageJobCategories.scss'
import { connect } from 'react-redux'
import BoxContainer from '../../../components/boxContainer/BoxContainer'
import { LANG } from '../../../constants'
import MonthDropDown from '../../../components/monthDropDown/MonthDropDown'
import YearRangeDropDown from '../../../components/yearRangeDropDown/YearRangeDropDown'

class BillingSearch extends Component {
  constructor(props) {
    super(props);

    this.state = {
     billings: []
    }

  }

  render() {

    return (
      <BoxContainer className="no-shadow border billing-box">
        <div className="client-search-billing-container">
          <div className="client-search-billing-row">
            <div className="client-search-billing-input-field">
              <label htmlFor="month">{LANG[localStorage.JobChoiceLanguage].month}</label>
              <MonthDropDown
                name='month'
                className="client-billing-search-input"
                value={this.props.searchFields.month}
                infoChange={this.props.infoChange}
              />
            </div>
            <div className="client-search-billing-input-field">
              <label htmlFor="month">{LANG[localStorage.JobChoiceLanguage].year}</label>
              <YearRangeDropDown
                field='year'
                className="client-billing-search-input"
                value={this.props.searchFields.year}
                onChange={this.props.infoChange}
                year={2009}
              />
            </div>
            <button className={`search-btn btn ${this.props.invalidSearch ? 'btn-default' : ''}`} onClick={this.props.onSearch} disabled={this.props.invalidSearch}>{LANG[localStorage.JobChoiceLanguage].search}</button>
          </div>
          <div className="client-search-billing-row">
            {this.props.error && <span className='errorMessage'>Invalid search filter, if month inputted, need year.</span>}
          </div>
        </div>
      </BoxContainer>
    )

  }
}

const mapStateToProps = state => {
  return state
}

export default connect(mapStateToProps)(BillingSearch)
