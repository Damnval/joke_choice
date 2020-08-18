import React from 'react'
import './Search.scss'
import api from '../../utilities/api'
import { TimeFormat } from "./../../helpers"
import Input from '../input/Input'
import NumberDropdown from '../numberDropdown/numberDropdown'
import EmploymentStatusDropDown from './employmentStatusDropDown/EmploymentStatusDropDown'
import EmploymentPeriodDropDown from './employmentPeriodDropDown/EmploymentPeriodDropDown'
import { LANG } from '../../constants'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../store/auth/actions'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"

//  category props for Special Feature details
//  results props for list of jobs after search
//  changeParent prop function for setState parent prop
class SearchComponent extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      form: {
        city: '',
        title: '',
        start_time: '',
        end_time: '',
        salary_min: '',
        salary_max: '',
        employment_status: '',
        employment_period: '',
        hataraki_kata: [],
        keyword: '',
        no_days_week: '',
        days: '',
      },
      workDays: [
        {name: 'Monday',
        name_jp: '日曜日',
        value: false
        },
        {name: 'Tuesday',
        name_jp: '月曜日',
        value: false
        }, 
        {name: 'Wednesday',
        name_jp: '火曜日',
        value: false
        },
        {name: 'Thursday',
        name_jp: '水曜日',
        value: false
        }, 
        {name: 'Friday',
        name_jp: '木曜日',
        value: false
        },
        {name: 'Saturday',
        name_jp: '金曜日',
        value: false
        },
        {name: 'Sunday',
        name_jp: '土曜日',
        value: false
        }
      ],
      link: null,
      results: this.props.results,
      hataraki_kata: [],
      formErrors: {

      },
      specialFeaturesHatarakikata: [],
    }
    this.handleChangeStart = this.handleChangeStart.bind(this)
    this.handleChangeEnd = this.handleChangeEnd.bind(this)
  }

  componentDidMount() {
    if (this.props.specialFeatureId !== undefined) {

      switch (this.props.specialFeatureId) {
        case '1':
          this.state.specialFeaturesHatarakikata.push(49)
          break
        case '2':
          this.state.specialFeaturesHatarakikata.push(50)
          this.state.specialFeaturesHatarakikata.push(56)
          break
        case '3':
          this.state.specialFeaturesHatarakikata.push(43)
          this.state.specialFeaturesHatarakikata.push(44)
          break
        default:
          break
      }

    }

    api.get('api/hataraki-kata').then(response => {
      let hataraki_kata = response.data.results.hataraki_kata.map((val) => {
        return({
          id: val.id,
          name: val.item_en,
          name_jp: val.item_jp,
          value: this.state.specialFeaturesHatarakikata.filter(function (item) {return item === val.id})[0] !== undefined ? true : false
        })
      })
      this.setState({hataraki_kata: hataraki_kata}, () => {
        this.props.changeParent({isLoading:false})
      })
    }).catch(error => {
      console.log(error)
      this.props.changeParent({
        isLoading:false,
        modal: {
          message: LANG[localStorage.JobChoiceLanguage].serverError,
          modal: true,
          modalType: 'error',
          redirect: '/',
        }
      })
    })
  }

  handleSubmit = e => {
    e.preventDefault()
    const state = this.state
    const form = state.form
    this.props.changeParent({
      modal: {
        message: '',
        modal: false,
        modalType: '',
        redirect: null
      },
      isLoading: true
    })

    const days = state.workDays.filter(el => el.value)
      .map(value => {
        return value.name
      })
    const salary = form.salary_min ? {
      min: form.salary_min,
      max: form.salary_max
    } : ''
    const hataraki_kata = state.hataraki_kata.filter(el => el.value)
    .map(value => {
      return value.id
    })
    const category = this.props.category !== undefined ? this.props.category: ''
    const credentials = {
      days: days,
      title: form.title,
      no_days_week: form.no_days_week,
      salary: salary,
      complete_address: form.city,
      employment_period: form.employment_period,
      employment_type: form.employment_status,
      start_time: form.start_time ? TimeFormat(form.start_time) : '',
      end_time: form.end_time ? TimeFormat(form.end_time) : '',
      hataraki_kata_id: hataraki_kata,
      job_category_id: category,
      keyword: form.keyword,
      job_seeker_id: (this.props.user.data && this.props.user.data.job_seeker) ? this.props.user.data.job_seeker.id : null
    }
    // Submit to Backend the credentials
    api.post('api/job/search', credentials).then(response => {
      if (response.data.results) {
        const jobs = response.data.results.jobs
        jobs.data.length > 0 ?
        this.props.changeParent({
          isLoading: false,
          results: jobs.data,
          total: response.data.results.total,
          last_page: jobs.last_page,
          current_page: jobs.current_page
        }) :
        this.props.changeParent({
          modal: {
            messageKey: "noJobsFound",
            modal: true,
            modalType: 'error',
          },
          isLoading: false,
          results: jobs.data,
          total: response.data.results.total
        })
      } else {
        this.props.changeParent({
          modal: {
            messageKey: "noJobsFound",
            modal: true,
            modalType: 'error',
          },
          isLoading: false,
        })
      }
    }).catch(error => {
      console.log(error)
      this.props.changeParent({
        modal: {
          messageKey: "serverError",
          modal: true,
          modalType: 'error',
          redirect: '/',
        },
        isLoading: false
      })
    })
  }

  handleChangeStart(date) {
    this.setState({
      form: {
        ...this.state.form,
        start_time: date,
      }
    })
  }

  handleChangeEnd(date) {
    this.setState({
      form: {
        ...this.state.form,
        end_time: date
      }
    })
  }

  newLink(id) {
    const link= (this.props.user.data.job_seeker ? '/job-detail/' : 'job-offer/') + id
    this.setState({link: link})
  }

  // Object is the object to change
  // Field is an array of fields eg. job_seeker.address.zipcode => [zipcode, address, zipcode]
  // Value is the value to be placed inside 
  changeWithinField = (object, field, value) => {
    if (object) {
      let target = object[field[0]]
      if ( typeof(target) === "object" ) {
        object[field[0]] = this.changeWithinField(object[field[0]], field.splice(1), value)
      } else {
        object[field[0]] = value
      }
    } else {
      object = value
    }

    return object
  }

  handleChange = (name, value) => {
    const fields = name.split('.')
    let {...form} = this.state.form
    this.setState({
      form: this.changeWithinField(form, fields, value)
    })
  }

  renderRow = (label, children, className) => {
    return (
      <tr>
        <th className="search-row-title">
          {label} 
          <span className="optional-badge">
            <small> {LANG[localStorage.JobChoiceLanguage].optional} </small>
          </span>
        </th>
        <td className="further-search-row-field">
          <div className={`search-details-individual ${className}`}>
            {children}
          </div>
        </td>
      </tr>
    )
  }

  toggleCheckbox = (e, field) => {
    const obj = [...this.state[field]]
    const name = e.target.name
    obj[name].value = !obj[name].value
    this.setState({
      [field]: obj
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

  capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
  }

  render() {
    const form = this.state.form
  
    return (
      <form className="search-form" noValidate onSubmit={this.handleSubmit}>
        <table className="col-md-12">
          <tbody>
          {this.renderRow(LANG[localStorage.JobChoiceLanguage].city,
            <Input
              field='city'
              value={form.city}
              inputStyles="search-field-440px"
              onChange={this.handleChange}
            />
          )}
          {this.renderRow(LANG[localStorage.JobChoiceLanguage].occupation,
            <Input
              field='title'
              value={form.title}
              inputStyles="search-field-440px"
              onChange={this.handleChange}
            />
          )}
          {this.renderRow(LANG[localStorage.JobChoiceLanguage].numberOfWorkingDays,
            <>
            <div className={`input-field num-container`}>
              <NumberDropdown
                num={7}
                field='no_days_week'
                value={form.no_days_week}
                onChange={this.handleChange}
                placeholder={LANG[localStorage.JobChoiceLanguage].weekly}
              />
            </div>
            <div className='days-container'>
              {this.state.workDays.map((value, key) => {
                  return(this.renderCheckBox(key, value, 'workDays'))
                })
              }
            </div>
            </>
          )}
          {this.renderRow(LANG[localStorage.JobChoiceLanguage].workingHours,
            <>
              <DatePicker
                selected={this.state.form.start_time}
                onChange={this.handleChangeStart}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={30}
                dateFormat="h:mm aa"
                timeCaption="Time"
              />  ～
              <DatePicker
                selected={this.state.form.end_time}
                onChange={this.handleChangeEnd}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={30}
                dateFormat="h:mm aa"
                timeCaption="Time"
              />
            </>,
            'working-hours-container'
          )}
          {this.renderRow(LANG[localStorage.JobChoiceLanguage].salaryRemuneration,
            <>
            <Input
              field='salary_min'
              value={form.salary_min}
              onChange={this.handleChange}
              inputType="number"
            /> ～
            <Input
              field='salary_max'
              value={form.salary_max}
              onChange={this.handleChange}
              inputType="number"
            />
            </>,
            'working-hours-container'
          )}
          {this.renderRow(LANG[localStorage.JobChoiceLanguage].employmentStatusSearch,
            <EmploymentStatusDropDown
              value={form.employment_status}
              handleChange={this.handleChange}
              className="further-search-dropdown"
            />
          )}
          {this.renderRow(LANG[localStorage.JobChoiceLanguage].employmentPeriod,
            <EmploymentPeriodDropDown
              value={form.employment_period}
              handleChange={this.handleChange}
              className="further-search-dropdown"
            />
          )}
          {this.renderRow(LANG[localStorage.JobChoiceLanguage].hatarakikata,
            <div className='employment-status-container hataraki-kata-container'>
            {this.state.hataraki_kata.map((value, key) => {
              return(this.renderCheckBox(key, value, 'hataraki_kata'))
            })}
          </div>
          )}
          {this.renderRow(LANG[localStorage.JobChoiceLanguage].keyword,
            <Input
              field='keyword'
              value={form.keyword}
              onChange={this.handleChange}
              placeholder={LANG[localStorage.JobChoiceLanguage].searchKeywordPlaceHolder}
              inputStyles="search-field-440px"
            />
          )}
          </tbody>
        </table>
        <div className='search-submit-container'>
          <button className="btn btn-info">{ LANG[localStorage.JobChoiceLanguage].search }</button>
        </div>
      </form>
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

export default connect(mapStateToProps, mapDispatchToProps)(SearchComponent)
