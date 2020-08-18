import React, { Component } from 'react'
import '../../createJob/CreateJob.scss'
import { connect } from 'react-redux'
import { Button } from 'react-bootstrap'
import Input from '../../../../components/input/Input'
import InputTextAreaEditing from '../../../../components/inputTextArea/InputTextAreaEditing'
import InputDropDown from '../../../../components/inputDropDown/InputDropDown'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const formValid = ({ formErrors, page2 }) => {
  let valid = true
  Object.values(formErrors).forEach(val => {
    val.length > 0 && (valid = false)
  })
  Object.values(page2).forEach(val => {
    val.length === 0 && (valid = false)
  })
  return valid
}

const dataFormat = {
  qualifications: '',
  job_category_id: '',
  planned_hire: '',
  no_days_week: '',
  start_time: '',
  end_time: '',
  employment_period: '',
  working_condition: '',
  location_details: '',
  salary: '',
  benefits: '',
  features: '',
  reason_to_hire: '',
}

class JobOfferEditor2 extends Component {
  constructor(props) {
    super(props)

    this.state = {
      page2: {
        qualifications: this.props.details.qualifications,
        job_category_id: this.props.details.job_category_id,
        planned_hire: this.props.details.planned_hire,
        no_days_week: this.props.details.no_days_week,
        start_time: this.props.details.start_time,
        end_time: this.props.details.end_time,
        employment_period: this.props.details.employment_period,
        working_condition: this.props.details.working_condition,
        location_details: this.props.details.location_details,
        salary: this.props.details.salary,
        benefits: this.props.details.benefits,
        features: this.props.details.features,
        reason_to_hire: this.props.details.reason_to_hire,
        days: [],
      },
      formErrors: {
        ...dataFormat, 
        days: '',
      },
      userDetails: this.props.details,
      view: this.props.view,
    }

    this.handleEdit = this.handleEdit.bind(this)
  }

  componentDidMount() {
    this.props.details.days.map((option) => {
      this.state.page2.days.push(option.day)
    })
  }

  handleInputChange = (name, value) => {
    let formErrors = { ...this.state.formErrors }
    console.log(name, value)

    switch (name) {
      case "start_time":
      case "end_time":
        formErrors[name] = value.length < 1 ? "Invalid Time" : ""
        break
      default:
        formErrors[name] = value.length < 1 ? "This is Required" : ""
        break
    }

    this.setState({formErrors})

    if(name === "days") {
      if(this.state.page2[name].find(item => item === value)) {
        var index = this.state.page2[name].indexOf(this.state.page2[name].find(item => item === value))
        this.state.page2[name].splice(index, 1)
        this.checkWorkDays()
      } else {
        this.state.page2[name].push(value)
        this.checkWorkDays()
      }
    } else {
      this.setState({
        page2: {
          ...this.state.page2,
          [name]: value
        }
      })
    }
  }

  handleEdit() {
    this.props.handleEdit()
    this.setState({view: !this.state.view})
  }

  checkWorkDays() {
    if(this.state.page2.days.length === 0) {
      this.setState({
        formErrors: {
          ...this.state.formErrors,
          days: "Choose at least 1"
        }
      })
    } else {
      this.setState({
        formErrors: {
          ...this.state.formErrors,
          days: ""
        }
      })
    }
  }

  handleSubmit = e => {
    const credentials = {
      ...this.state.page2,
    }
    this.props.pageData(credentials)
  }

  renderInput = (value) => {
    switch (value.type) {
      case "work_time":
        if(!this.state.view) {
          return(
            <div id={value.name} className="createJob-timeInput">
              <Input
                inputType="time"
                field="start_time"
                onChange={this.handleInputChange}
                error={this.state.formErrors.start_time}
                value={this.state.page2.start_time}
                displaycreatejob={'true'}
              />
              <span> - </span>
              <Input
                inputType='time'
                field="end_time"
                onChange={this.handleInputChange}
                error={this.state.formErrors.end_time}
                value={this.state.page2.end_time}
                displaycreatejob={'true'}
              />
            </div>
          )
        } else {
          return(<span className="offer-detail">{this.state.userDetails.start_time} - {this.state.userDetails.end_time}</span>)
        }
      case "text_area":
        if(!this.state.view) {
          return(
            <InputTextAreaEditing
              id={value.name}
              field={value.name}
              onChange={this.handleInputChange}
              error={this.state.formErrors[value.name]}
              value={this.state.page2[value.name]}
            />
          )
        } else {
          return(<div className="offer-textArea">{this.state.userDetails[value.name]}</div>)
        }
      case "dropdown":
        if(!this.state.view) {
          return(
            <InputDropDown 
              id={value.name}
              placeholder=" "
              field={value.name}
              options={value.options}
              onChange={this.handleInputChange}
              error={this.state.formErrors[value.name]}
              value={this.state.page2[value.name]}
            >
              {(value.options.map((option) => {
                return (
                  <option key={option.id} value={option.id}>
                    {option.category}
                  </option>)
              }))}
            </InputDropDown>
          )
        } else {
          return(<span className="offer-detail">{value.name === "job_category_id" ? this.state.userDetails.job_category.category: this.state.userDetails[value.name]}</span>)
        }
      case "number":
        if(!this.state.view) {
          return(
            <Input
              id={value.name}
              placeholder={value.label}
              field={value.name}
              onChange={this.handleInputChange}
              error={this.state.formErrors[value.name]}
              value={this.state.page2[value.name]}
              inputType="number"
            />
          )
        } else {
          return(<span className="offer-detail">{this.state.userDetails[value.name]}</span>)
        }
      case "multiple_select":
        if(!this.state.view) {
          return(
            <>
              <div className={`createJob-multipleSelect ${this.state.formErrors[value.name].length > 0 ? "errorBorder": ""}`} id={value.name}>
                {value.options !== null && value.options.map((option, key) => {
                  return(
                    <span key={key}>
                      <label className="createJob-multipleSelect-box">
                        <input
                          name={key}
                          type="checkbox"
                          onChange={e => this.handleInputChange(value.name, option)}
                          defaultChecked={this.state.page2[value.name].find(d => d === option)}
                        />
                      </label>
                      <label className="createJob-multipleSelect-box-label">{option}</label>
                    </span>
                  )
                })}
              </div>
              {(this.state.formErrors[value.name] && this.state.formErrors[value.name].length > 0) &&
                <div className="errorMessage">{this.state.formErrors[value.name]}</div>
              }
            </>
          )
        } else {
          return(
            <div className="offer-otherHatarakikata">
              <ul>
                {this.state.userDetails[value.name].map((option, key) => {
                  return(
                    <li key={key}>
                      <label className="createJob-multipleSelect-box-label">{option.day}</label>
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        }
      default:
        if(!this.state.view) {
          return(
            <Input
              id={value.name}
              placeholder={value.label}
              field={value.name}
              onChange={this.handleInputChange}
              error={this.state.formErrors[value.name]}
              value={this.state.page2[value.name]}
            />
          )
        } else {
          return(<span className="offer-detail">{this.state.userDetails[value.name]}</span>)
        }
    }
  }

  render() {
    const inputs = [
      {
        name: "qualifications",
        type: "text",
        label: "Qualification",
      },
      // {
      //   name: "job_category_id",
      //   type: "dropdown",
      //   label: "Industry",
      //   options: this.props.category,
      // },
      {
        name: "planned_hire",
        type: "number",
        label: "Recruitment Numbers",
      },
      {
        name: "no_days_week",
        type: "text",
        label: "Working Days",
      },
      {
        name: "working_hours",
        type: "work_time",
        label: "Working Hours",
      },
      {
        name: "days",
        type: "multiple_select",
        label: "Possible Work Days",
        options: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
      },
      {
        name: "employment_period",
        type: "dropdown",
        label: "Working Term",
        options: [
          {id: "long_term", category: "Long-term 【more than 3 months】"},
          {id: "short_term", category: "Short-term 【more than 1 week and less than 3 months】"},
          {id: "single_term", category: "Single shot 【less than 1 week】"},
        ],
      },
      {
        name: "working_condition",
        type: "text_area",
        label: "Remarks on Working Conditions",
      },
      {
        name: "location_details",
        type: "text_area",
        label: "Location Details",
      },
      {
        name: "salary",
        type: "number",
        label: "Salary - Allowance",
      },
      {
        name: "benefits",
        type: "text_area",
        label: "Salary, Allowance, Transportation Fee",
      },
      {
        name: "features",
        type: "text",
        label: "Features",
      },
      // {
      //   name: "reason_to_hire",
      //   type: "text_area",
      //   label: "Will hire right away if you are...",
      // },
    ]

    return (
      <>
        <div className="offer-title">
          <label><span>Job Offer - Recruitment Information - Page 2</span><span className="createJob-smaller"> (2 / 2)</span></label>
          <Button className="offer-edit-btn" onClick={this.handleEdit}>
            <FontAwesomeIcon icon='edit'/><span> {this.state.view ? 'Edit' : 'Cancel'}</span>
          </Button>
        </div>
        <div className="createJob-inputArea">
          {inputs.map((value, key) => {
            return(
              <div key={key} className="createJob-input-individual">
                <label htmlFor={value.name}>
                  <span>{value.label} {value.optional !== true ? <span className="required">*</span> : <span></span>} :</span>
                </label>
                <div className="createJob-input-actual">
                  {this.renderInput(value)}
                </div>
              </div>
            )
          })}
        </div>
        <div className={`createJob-submitArea ${!this.state.view ? 'offer-submitArea' : 'offer-submitArea-nonFlexed'}`}>
          <Button
            className="createJob-submitArea-btn"
            id="createJob-submitArea-btn-nextPage"
            onClick={this.props.handleShow}
          >
            <span>Previous Page</span>
          </Button>
          {!this.state.view &&
            <Button
              className="createJob-submitArea-btn"
              id="createJob-submitArea-btn-save"
              onClick={this.handleSubmit}
              disabled={!formValid(this.state)}
            >
              <span>Submit</span>
            </Button>
          }
        </div>
      </>
    )
  }
}

const mapStateToProps = state => {
  return state
}

export default connect(mapStateToProps)(JobOfferEditor2)
