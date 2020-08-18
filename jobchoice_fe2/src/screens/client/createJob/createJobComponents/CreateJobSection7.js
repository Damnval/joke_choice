import React, { Component } from 'react'
import '../CreateJob.scss'
import { connect } from 'react-redux'
import Input from '../../../../components/input/Input'
import InputTextArea from '../../../../components/inputTextArea/InputTextArea'
import { LANG } from '../../../../constants'

const format = {
  business_content: '',
  no_employees: '',
  founded_year: '',
  founded_month: '',
  capital: '',
  url: '',
  recruiter: '',
}

class CreateJobSection7 extends Component {
  constructor(props) {
    super(props)

    this.state = {
      section7: {...format},
    }
  }

  handleInputChange = (name, value) => {

    this.setState({
      section7: {
        ...this.state.section7,
        [name]: value
      }
    })
  }

  render() {
    return (
      <div className="createJob-section-bg">

        <div className="createJob-section-header">
          <span>{LANG[localStorage.JobChoiceLanguage].companyProfileInformation}</span>
        </div>

        <div className="createJob-inputArea">
          <InputTextArea
            field="business_content"
            label={LANG[localStorage.JobChoiceLanguage].businessContent}
            onChange={this.handleInputChange}
            value={this.state.section7.business_content}
          />
        </div>

        <div className="createJob-inputArea">
        <label htmlFor="year_month_founded">{LANG[localStorage.JobChoiceLanguage].noOfEmployees} :</label>
          <div id="job-number-employees" className="createJob-inputArea-oneline">
            <Input
              field="no_employees"
              inputType="number"
              pattern="[0-9]*"
              onChange={this.handleInputChange}
              value={this.state.section7.no_employees}
            />
            <span>名</span>
          </div>
        </div>

        <div className="createJob-inputArea">
          <label htmlFor="year_month_founded">{LANG[localStorage.JobChoiceLanguage].yearMonthFounded} :</label>
          <div name="year_month_founded" id="job-year-month-founded" className="createJob-inputArea-oneline">
            <Input
              field="founded_year"
              onChange={this.handleInputChange}
              value={this.state.section7.founded_year}
            />
            <span>年</span>
            <Input
              field="founded_month"
              onChange={this.handleInputChange}
              value={this.state.section7.founded_month}
            />
            <span>月</span>
          </div>
        </div>

        <div className="createJob-inputArea">
        <label htmlFor="year_month_founded">{LANG[localStorage.JobChoiceLanguage].capital} :</label>
          <div id="job-capital" className="createJob-inputArea-oneline">
            <Input
              field="capital"
              inputType="number"
              pattern="[0-9]*"
              onChange={this.handleInputChange}
              value={this.state.section7.capital}
            />
            <span>万円</span>
          </div>
        </div>

        <div className="createJob-inputArea">
          <Input
            field="url"
            label="URL"
            onChange={this.handleInputChange}
            value={this.state.section7.url}
          />
        </div>

        <div className="createJob-inputArea">
          <Input
            field="recruiter"
            label={LANG[localStorage.JobChoiceLanguage].recruiter}
            onChange={this.handleInputChange}
            value={this.state.section7.recruiter}
          />
        </div>

      </div>
    )
  }
}

const mapStateToProps = state => {
  return state
}

export default connect(mapStateToProps)(CreateJobSection7)
