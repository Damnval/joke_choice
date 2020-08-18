import React, { Component } from 'react'
import '../CreateJob.scss'
import { connect } from 'react-redux'
import Input from '../../../../components/input/Input'
import InputRadio from '../../../../components/inputRadio/InputRadio'
import InputDropDown from '../../../../components/inputDropDown/InputDropDown'
import InputTextArea from '../../../../components/inputTextArea/InputTextArea'
import InputTextAreaEditing from '../../../../components/inputTextArea/InputTextAreaEditing'
import { LANG, EM } from '../../../../constants'
import InputNumberWithComma from '../../../../components/inputNumberWithComma/inputNumberWithComma'
import InputTime from '../../../../components/inputTime/InputTime'
import { whiteSpaceValidation } from '../../../../helpers'

const formValid = ({ formErrors, section4, job_sub_categories }) => {
  let valid = true

  Object.values(section4).forEach(val => {
    (!val || val === null ||
      ((typeof val === 'string' && val.trim().length === 0) || val.length === 0)
     ) && (valid = false)
  })

  Object.values(formErrors).forEach(val => {
    val.length > 0 && (valid = false)
  })

  valid = valid === true && job_sub_categories.length > 0 ? true : false

  return valid
}

const salaryFrequencyOptions = [
  {
    item_en: 'Yearly',
    item_jp: '年収',
    value: 'yearly',
  },
  {
    item_en: 'Monthly',
    item_jp: '月収',
    value: 'monthly',
  },
  {
    item_en: 'Weekly',
    item_jp: '週給',
    value: 'weekly',
  },
  {
    item_en: 'Daily',
    item_jp: '日給',
    value: 'daily',
  },
  {
    item_en: 'Hourly',
    item_jp: '時給',
    value: 'hourly',
  },
]

const welfareOptions = [
  {
    item_jp: '健康保険',
    item_en: 'Health Care',
    id: 'health_insurance'
  },
  {
    item_jp: '厚生年金',
    item_en: 'Welfare Pension',
    id: 'welfare_pension'
  },
  {
    item_jp: '雇用保険',
    item_en: 'Employment Insurance',
    id: 'employment_insurance'
  },
  {
    item_jp: '労災保険',
    item_en: 'Labor Accident Insurance',
    id: 'labor_accident_insurance'
  },
]

class CreateJobSection4 extends Component {
  constructor(props) {
    super(props)

    this.state = {
      categories: [...this.props.categories],
      category_id: 0,
      category_index: 0,
      section4: {
        qualifications: '',
        planned_hire: '',
        payment_type: '',
        salary: '',
        no_days_week: '',
        ratio_gender_scope: '',
        ratio_age_scope: '',
        start_time: '',
        end_time: '',
      },
      optionalSection4: {
        salary_max_range: '',
        benefits: '',
        no_days_week_max_range: '',
        welfare_description: '',
        welfare_working_period: '',
        working_condition: '',
        job_reasons_to_hire: [
          '', '', ''
        ],
        days: [],
        job_welfares: [],
        required_gender: '',
        required_min_age: '',
        required_max_age: '',
      },
      formErrors: {
        qualifications: '',
        job_sub_category2: '',
        planned_hire: '',
        payment_type: '',
        salary: '',
        salary_max_range: '',
        no_days_week: '',
        no_days_week_max_range: '',
        ratio_gender_scope: '',
        ratio_age_scope: '',
        start_time: '',
        end_time: '',
        required_gender: '',
        required_min_age: '',
        required_max_age: '',
        reason_to_hire1: '',
        reason_to_hire2: '',
        reason_to_hire3: '',
        welfare_description: '',
        welfare_working_period: '',
        working_condition: '',
      },
      job_sub_categories: [],
    }

    this.handleFormError = this.handleFormError.bind(this)
  }

  componentDidMount() {
    if(this.props.viewToEdit === true) {

      let job_sub_categories = []
      if(this.props.viewToEditData.job_sub_categories && this.props.viewToEditData.job_sub_categories!== null && this.props.viewToEditData.job_sub_categories.length > 0) {
        job_sub_categories = this.props.viewToEditData.job_sub_categories.map((sub_category, key) => {
          return (sub_category.job_sub_category_id)
        })
      }

      let category_solo = null
      if(this.props.viewToEditData.job_sub_categories && this.props.viewToEditData.job_sub_categories !== null && this.props.viewToEditData.job_sub_categories.length > 0) {
        category_solo = this.state.categories.map((category, key) => {
          const is_this_it = category.job_sub_category.filter(function (cat) {return cat.id === job_sub_categories[0]})[0]
          if(is_this_it !== undefined) {
            return (category.id)
          } else {
            return null
          }
        })
      }
      
      const category_id = category_solo !== null ? category_solo.filter(function (cat) {return cat !== null})[0] : 1
  
      if(this.props.viewToEditData.job_sub_categories && this.props.viewToEditData.job_sub_categories.length > 0) {
        job_sub_categories.map((sub_category_solo, key) => {
          let categories = [...this.state.categories]
          let sub_category = categories[this.state.categories.indexOf(this.state.categories.filter(function (cat) {return cat.id === category_id})[0])].job_sub_category
          sub_category.filter(function (el) {return el.id === sub_category_solo})[0].isSelected = true
          this.setState({
            categories: [
              ...this.state.categories,
            ]
          })
        })
      }

      this.setState({
        section4: {
          qualifications: this.props.viewToEditData.qualifications,
          planned_hire: this.props.viewToEditData.planned_hire,
          payment_type: this.props.viewToEditData.payment_type,
          salary: this.props.viewToEditData.salary,
          no_days_week: this.props.viewToEditData.no_days_week,
          ratio_gender_scope: this.props.viewToEditData.ratio_gender_scope,
          ratio_age_scope: this.props.viewToEditData.ratio_age_scope,
          start_time: this.props.times.start_time,
          end_time: this.props.times.end_time,
        },
        optionalSection4: {
          salary_max_range: this.props.viewToEditData.salary_max_range,
          benefits: this.props.viewToEditData.benefits,
          no_days_week_max_range: this.props.viewToEditData.no_days_week_max_range,
          welfare_description: this.props.viewToEditData.welfare_description,
          welfare_working_period: this.props.viewToEditData.welfare_working_period,
          working_condition: this.props.viewToEditData.working_condition,
          job_reasons_to_hire: [
            this.props.viewToEditData.job_reasons_to_hire && this.props.viewToEditData.job_reasons_to_hire.length > 0 && this.props.viewToEditData.job_reasons_to_hire[0].length ? this.props.viewToEditData.job_reasons_to_hire[0]: '',
            this.props.viewToEditData.job_reasons_to_hire && this.props.viewToEditData.job_reasons_to_hire.length > 1 && this.props.viewToEditData.job_reasons_to_hire[1].length ? this.props.viewToEditData.job_reasons_to_hire[1]: '',
            this.props.viewToEditData.job_reasons_to_hire && this.props.viewToEditData.job_reasons_to_hire.length > 2 && this.props.viewToEditData.job_reasons_to_hire[2].length ? this.props.viewToEditData.job_reasons_to_hire[2]: ''
          ],
          days: this.props.viewToEditData.days,
          job_welfares: this.props.viewToEditData.job_welfares ? this.props.viewToEditData.job_welfares: [],
          required_gender: this.props.viewToEditData.required_gender,
          required_min_age: this.props.viewToEditData.required_min_age,
          required_max_age: this.props.viewToEditData.required_max_age,
        },
        job_sub_categories: job_sub_categories,
        category_id: category_id,
        category_index: this.props.categories.indexOf(this.props.categories.filter(function (cat) {return cat.id === category_id})[0]),
      })
    }
  }

  // When switching job categories
  // Initial checked job sub categories will be cleaned
  changeChosenJobCategory = (name, value) => {
    const actual_value = this.state.categories[value].id
    let categories = [...this.state.categories]
    categories[this.state.category_index].job_sub_category = categories[this.state.category_id].job_sub_category.map((el, key) => {
      el.isSelected = false
      return el
    })
    this.setState({
      category_id: actual_value,
      category_index: value,
      job_sub_categories: [],
      categories: [
        ...this.state.categories,
      ]
    }, () => {
      this.checkHatarakikataAny()
      this.props.retrievedData(
        "section4",
        { ...this.state.section4,
          ...this.state.optionalSection4,
          job_sub_categories: this.state.job_sub_categories
        }, formValid(this.state))
    })
  }

  handleInputChange = (name, value) => {
    let formErrors = { ...this.state.formErrors }

    switch (name) {
      case "reason_to_hire1":
      case "reason_to_hire2":
      case "reason_to_hire3":
        formErrors[name] = value.length > 400 ? LANG[localStorage.JobChoiceLanguage].reason_to_hire + LANG[localStorage.JobChoiceLanguage].maxCharacters1 + '400' + LANG[localStorage.JobChoiceLanguage].maxCharacters2 : ""
        break
      case "welfare_description":
      case "welfare_working_period":
      case "working_condition":
        const tempName1 = name === 'welfare_description' ? LANG[localStorage.JobChoiceLanguage].welfare : name === 'welfare_working_period' ? LANG[localStorage.JobChoiceLanguage].working_period : LANG[localStorage.JobChoiceLanguage].working_period_remarks
        formErrors[name] = value.length > 1000 ? tempName1 + LANG[localStorage.JobChoiceLanguage].maxCharacters1 + '1000' + LANG[localStorage.JobChoiceLanguage].maxCharacters2 : ""
        break
      case "planned_hire":
        formErrors[name] = value.length > 3 ? LANG[localStorage.JobChoiceLanguage].plannedHires + LANG[localStorage.JobChoiceLanguage].maxCharacters1 + '3' + LANG[localStorage.JobChoiceLanguage].maxCharacters2 : ""
        break
      case "no_days_week_max_range":
        formErrors.no_days_week_max_range = (this.state.section4.no_days_week !== '' && value.length > 0 && Number(value) < Number(this.state.section4.no_days_week)) ? LANG[localStorage.JobChoiceLanguage].minRangeNotBeGreatThanMax : value.length > 1 ? LANG[localStorage.JobChoiceLanguage].weekWorkDays + LANG[localStorage.JobChoiceLanguage].maxCharacters1 + '1' + LANG[localStorage.JobChoiceLanguage].maxCharacters2 : value > 6 ? LANG[localStorage.JobChoiceLanguage].mustNotExceed6Days : ""
        formErrors.no_days_week = value.length > 0 && this.state.section4.no_days_week.length === 0 ? LANG[localStorage.JobChoiceLanguage].thisIsRequired : this.state.section4.no_days_week && value.length !== 0 && Number(value) < Number(this.state.section4.no_days_week) ? LANG[localStorage.JobChoiceLanguage].minRangeNotBeGreatThanMax : value.length > 1 ? LANG[localStorage.JobChoiceLanguage].weekWorkDays + LANG[localStorage.JobChoiceLanguage].maxCharacters1 + '1' + LANG[localStorage.JobChoiceLanguage].maxCharacters2 : ''
        break
      case "no_days_week":
        formErrors.no_days_week = value.length === 0 && this.state.optionalSection4.no_days_week_max_range.length > 0 ? LANG[localStorage.JobChoiceLanguage].thisIsRequired : (this.state.optionalSection4.no_days_week_max_range !== '' && Number(value) > Number(this.state.optionalSection4.no_days_week_max_range)) ? LANG[localStorage.JobChoiceLanguage].minRangeNotBeGreatThanMax : value.length > 1 ? LANG[localStorage.JobChoiceLanguage].weekWorkDays + LANG[localStorage.JobChoiceLanguage].maxCharacters1 + '1' + LANG[localStorage.JobChoiceLanguage].maxCharacters2 : value > 6 ? LANG[localStorage.JobChoiceLanguage].mustNotExceed6Days : ""
        formErrors.no_days_week_max_range = (this.state.optionalSection4.no_days_week_max_range !== '' && Number(value) > Number(this.state.optionalSection4.no_days_week_max_range)) ? LANG[localStorage.JobChoiceLanguage].minRangeNotBeGreatThanMax : value.length > 1 ? LANG[localStorage.JobChoiceLanguage].weekWorkDays + LANG[localStorage.JobChoiceLanguage].maxCharacters1 + '1' + LANG[localStorage.JobChoiceLanguage].maxCharacters2 : ""
        break
      case "payment_type":
        formErrors.payment_type = value && value !== null && value.length === 0 && this.state.section4.salary && this.state.section4.salary !== null && this.state.section4.salary.length > 0 ? LANG[localStorage.JobChoiceLanguage].thisIsRequired : ""
        formErrors.salary = value && value !== null && value.length > 0 && this.state.section4.salary && this.state.section4.salary !== null && this.state.section4.salary.length === 0 ? LANG[localStorage.JobChoiceLanguage].thisIsRequired : ""
        break
      case "salary_max_range":
        const salary_without_comma1 = parseFloat(String(this.state.section4.salary).replace(/,/g, ''))
        const salary_max_range_without_comma1 = parseFloat(String(value).replace(/,/g, ''))
        formErrors.salary = value && value !== null && value.length === 0 ? '' : (this.state.section4.salary.length > 0 && Number(salary_max_range_without_comma1) < Number(salary_without_comma1)) ? LANG[localStorage.JobChoiceLanguage].minRangeNotBeGreatThanMax : this.state.section4.salary.length === 0 && value.length > 0 ? LANG[localStorage.JobChoiceLanguage].thisIsRequired : ''
        formErrors.salary_max_range = value && value !== null && value.length === 0 ? '' : (this.state.section4.salary.length > 0 && Number(salary_max_range_without_comma1) < Number(salary_without_comma1)) ? LANG[localStorage.JobChoiceLanguage].minRangeNotBeGreatThanMax : value.length > 7 ? LANG[localStorage.JobChoiceLanguage].salary + LANG[localStorage.JobChoiceLanguage].maxCharacters1 + '6' + LANG[localStorage.JobChoiceLanguage].maxCharacters2 : ''
        formErrors.payment_type = this.state.section4.payment_type.length === 0 && value.length > 0 ? LANG[localStorage.JobChoiceLanguage].thisIsRequired : ""
        break
      case "salary":
        const salary_without_comma2 = parseFloat(String(value).replace(/,/g, ''))
        const salary_max_range_without_comma2 = parseFloat(String(this.state.optionalSection4.salary_max_range).replace(/,/g, ''))
        formErrors.salary = (this.state.optionalSection4.salary_max_range !== '' && Number(salary_without_comma2) > Number(salary_max_range_without_comma2)) ? LANG[localStorage.JobChoiceLanguage].minRangeNotBeGreatThanMax : value.length > 7 ? LANG[localStorage.JobChoiceLanguage].salary + LANG[localStorage.JobChoiceLanguage].maxCharacters1 + '6' + LANG[localStorage.JobChoiceLanguage].maxCharacters2 :  ""
        formErrors.payment_type = this.state.section4.payment_type.length === 0 && value.length > 0 ? LANG[localStorage.JobChoiceLanguage].thisIsRequired : ""
        formErrors.salary_max_range = (this.state.optionalSection4.salary_max_range && this.state.optionalSection4.salary_max_range !== null && this.state.optionalSection4.salary_max_range.length > 0 && value && value !== null && value.length > 0 && Number(salary_max_range_without_comma2) < Number(salary_without_comma2)) ? LANG[localStorage.JobChoiceLanguage].minRangeNotBeGreatThanMax : value.length > 7 ? LANG[localStorage.JobChoiceLanguage].salary + LANG[localStorage.JobChoiceLanguage].maxCharacters1 + '6' + LANG[localStorage.JobChoiceLanguage].maxCharacters2 : ''
        break
      case "ratio_gender_scope":
        formErrors.required_gender = (value === 'required' || value === 'preferable') && this.state.optionalSection4.required_gender.length === 0 ? LANG[localStorage.JobChoiceLanguage].thisIsRequired : ''
        break
      case "required_gender":
        formErrors.required_gender = (this.state.section4.ratio_gender_scope === 'required' || this.state.section4.ratio_gender_scope === 'preferable') && value.length === 0 ? LANG[localStorage.JobChoiceLanguage].thisIsRequired : ''
        break
      case "ratio_age_scope":
        formErrors.required_min_age = (value === 'required' || value === 'preferable') && this.state.optionalSection4.required_min_age.length === 0 ? LANG[localStorage.JobChoiceLanguage].thisIsRequired : (this.state.optionalSection4.required_min_age !== '' && Number(this.state.optionalSection4.required_min_age) >= Number(this.state.optionalSection4.required_max_age)) ? LANG[localStorage.JobChoiceLanguage].minRangeNotMaxRange : ''
        formErrors.required_max_age = (value === 'required' || value === 'preferable') && this.state.optionalSection4.required_max_age.length === 0 ? LANG[localStorage.JobChoiceLanguage].thisIsRequired : (this.state.optionalSection4.required_min_age !== '' && Number(this.state.optionalSection4.required_min_age) >= Number(this.state.optionalSection4.required_max_age)) ? LANG[localStorage.JobChoiceLanguage].minRangeNotMaxRange : ''
        break
      case "required_min_age":
        formErrors.required_min_age = (this.state.optionalSection4.required_max_age !== '' && Number(this.state.optionalSection4.required_max_age) <= Number(value)) ? LANG[localStorage.JobChoiceLanguage].minRangeNotMaxRange : value.length > 2 ? LANG[localStorage.JobChoiceLanguage].ageRangeRequired + LANG[localStorage.JobChoiceLanguage].maxCharacters1 + '2' + LANG[localStorage.JobChoiceLanguage].maxCharacters2 : ((this.state.section4.ratio_age_scope === 'required' || this.state.section4.ratio_age_scope === 'preferable') && value.length === 0) ? LANG[localStorage.JobChoiceLanguage].thisIsRequired : ''
        formErrors.required_max_age = (this.state.optionalSection4.required_max_age !== '' && Number(this.state.optionalSection4.required_max_age) <= Number(value)) ? LANG[localStorage.JobChoiceLanguage].minRangeNotMaxRange : ((this.state.section4.ratio_age_scope === 'required' || this.state.section4.ratio_age_scope === 'preferable') && this.state.optionalSection4.required_max_age.length === 0) || (value.length > 0 && this.state.optionalSection4.required_max_age.length === 0) ? LANG[localStorage.JobChoiceLanguage].thisIsRequired : ''
        break
      case "required_max_age":
        formErrors.required_max_age = (this.state.optionalSection4.required_min_age !== '' && Number(this.state.optionalSection4.required_min_age) >= Number(value)) ? LANG[localStorage.JobChoiceLanguage].minRangeNotMaxRange : value.length > 2 ? LANG[localStorage.JobChoiceLanguage].ageRangeRequired + LANG[localStorage.JobChoiceLanguage].maxCharacters1 + '2' + LANG[localStorage.JobChoiceLanguage].maxCharacters2 : ((this.state.section4.ratio_age_scope === 'required' || this.state.section4.ratio_age_scope === 'preferable') && value.length === 0) ? LANG[localStorage.JobChoiceLanguage].thisIsRequired : ''
        formErrors.required_min_age = (this.state.optionalSection4.required_min_age !== '' && Number(this.state.optionalSection4.required_min_age) >= Number(value)) ? LANG[localStorage.JobChoiceLanguage].minRangeNotMaxRange : ((this.state.section4.ratio_age_scope === 'required' || this.state.section4.ratio_age_scope === 'preferable') && this.state.optionalSection4.required_min_age.length === 0) || (value.length > 0 && this.state.optionalSection4.required_min_age.length === 0) ? LANG[localStorage.JobChoiceLanguage].thisIsRequired : ''
        break
      default:
        break
    }

    switch (name) {
      case "days":
      case "job_welfares":
        if(this.state.optionalSection4[name].filter(function (item) {return item === value})[0]) {
          var indexNew = this.state.optionalSection4[name].indexOf(this.state.optionalSection4[name].filter(function (item) {return item === value})[0])
          var dummyArray = this.state.optionalSection4[name]
          dummyArray.splice(indexNew, 1)
          this.setState({
            formErrors,
            optionalSection4: {
              ...this.state.optionalSection4,
              [name]: dummyArray,
            }
          })
          this.props.retrievedData(
            "section4",
            { ...this.state.section4,
              ...this.state.optionalSection4,
              job_sub_categories: this.state.job_sub_categories
            }, formValid(this.state))
        } else {
          var dummyArray = this.state.optionalSection4[name]
          dummyArray.push(value)
          this.setState({
            formErrors,
            optionalSection4: {
              ...this.state.optionalSection4,
              [name]: dummyArray,
            }
          })
          this.props.retrievedData(
            "section4",
            { ...this.state.section4,
              ...this.state.optionalSection4,
              job_sub_categories: this.state.job_sub_categories
            }, formValid(this.state))
        }
        break
      case "job_type_specific":
        let categories = [...this.state.categories]
        let sub_category = categories[this.state.category_index].job_sub_category
        sub_category.filter(function (el) {return el.id === value})[0].isSelected = !sub_category.filter(function (el) {return el.id === value})[0].isSelected
        this.setState({
          formErrors,
          categories: [
            ...this.state.categories,
          ]
        }, () => {this.checkHatarakikataAny()})
        if(this.state.job_sub_categories.filter(function (item) {return item === value})[0]) {
          var index = this.state.job_sub_categories.indexOf(
            this.state.job_sub_categories.filter(function (item) {return item === value})[0])
          this.state.job_sub_categories.splice(index, 1)
        } else {
          this.state.job_sub_categories.push(value)
        }
        this.props.retrievedData(
          "section4",
          { ...this.state.section4,
            ...this.state.optionalSection4,
            job_sub_categories: this.state.job_sub_categories
          }, formValid(this.state))
        break
      case "reason_to_hire1":
      case "reason_to_hire2":
      case "reason_to_hire3":
        const indexChar = Number(name.charAt(14)) - 1
        let updatedReasons = this.state.optionalSection4.job_reasons_to_hire
        updatedReasons[indexChar] = value

        this.setState({
          formErrors,
          optionalSection4: {
            ...this.state.optionalSection4,
            job_reasons_to_hire: updatedReasons,
          },
        }, () => {
          this.props.retrievedData(
            "section4",
            { ...this.state.section4,
              ...this.state.optionalSection4,
              job_sub_categories: this.state.job_sub_categories
            }, formValid(this.state))
        })
        break
      case "salary_max_range":
      case "benefits":
      case "no_days_week_max_range":
      case "welfare_description":
      case "welfare_working_period":
      case "working_condition":
      case "required_gender":
      case "required_min_age":
      case "required_max_age":
        this.setState({
          formErrors,
          optionalSection4: {
            ...this.state.optionalSection4,
            [name]: value,
          },
        }, () => {
          this.props.retrievedData(
            "section4",
            { ...this.state.section4,
              ...this.state.optionalSection4,
              job_sub_categories: this.state.job_sub_categories
            }, formValid(this.state))
        })
        break
      default:
        this.setState({
          formErrors,
          section4: {
            ...this.state.section4,
            [name]: value
          }
        }, () => {
          this.props.retrievedData(
            "section4",
            { ...this.state.section4,
              ...this.state.optionalSection4,
              job_sub_categories: this.state.job_sub_categories
            }, formValid(this.state))
        })
        break
    }
  }

  checkHatarakikataAny() {
    if(this.state.job_sub_categories && this.state.job_sub_categories.length === 0) {
      this.setState({
        formErrors: {
          ...this.state.formErrors,
          job_type_specific: LANG[localStorage.JobChoiceLanguage].thisIsRequired
        }
      })
    } else {
      this.setState({
        formErrors: {
          ...this.state.formErrors,
          job_type_specific: ""
        }
      })
    }
  }

  checkLabel(name, value) {
    switch(name) {
      case 'job_type_specific':
        let categories = [...this.state.categories]
        let sub_category = categories[this.state.category_index].job_sub_category
        sub_category.filter(function (el) {return el.id === value})[0].isSelected = !sub_category.filter(function (el) {return el.id === value})[0].isSelected
        this.setState({
          categories: [
            ...this.state.categories,
          ]
        }, () => {this.checkHatarakikataAny()})
        if(this.state.job_sub_categories.filter(function (item) {return item === value})[0]) {
          var index = this.state.job_sub_categories.indexOf(
            this.state.job_sub_categories.filter(function (item) {return item === value})[0])
          this.state.job_sub_categories.splice(index, 1)
        } else {
          this.state.job_sub_categories.push(value)
        }
        this.props.retrievedData(
          "section4",
          { ...this.state.section4,
            ...this.state.optionalSection4,
            job_sub_categories: this.state.job_sub_categories
          }, formValid(this.state))
        break
        case "days":
        case "job_welfares":
          if(this.state.optionalSection4[name].filter(function (item) {return item === value})[0]) {
            var indexNew = this.state.optionalSection4[name].indexOf(this.state.optionalSection4[name].filter(function (item) {return item === value})[0])
            var dummyArray = this.state.optionalSection4[name]
            dummyArray.splice(indexNew, 1)
            this.setState({
              optionalSection4: {
                ...this.state.optionalSection4,
                [name]: dummyArray,
              }
            })
            this.props.retrievedData(
              "section4",
              { ...this.state.section4,
                ...this.state.optionalSection4,
                job_sub_categories: this.state.job_sub_categories
              }, formValid(this.state))
          } else {
            var dummyArray = this.state.optionalSection4[name]
            dummyArray.push(value)
            this.setState({
              optionalSection4: {
                ...this.state.optionalSection4,
                [name]: dummyArray,
              }
            })
            this.props.retrievedData(
              "section4",
              { ...this.state.section4,
                ...this.state.optionalSection4,
                job_sub_categories: this.state.job_sub_categories
              }, formValid(this.state))
          }
          break
      default:
        break
    }
  }

  handleFormError(name, value) {
    let formError = ""

    switch (name) {
      case "qualifications":
        const whiteSpaceValidator = value && value !== null ? whiteSpaceValidation(value) : null
        formError = whiteSpaceValidator !== null ? LANG[localStorage.JobChoiceLanguage][whiteSpaceValidator] : ''
        break
      case "reason_to_hire1":
      case "reason_to_hire2":
      case "reason_to_hire3":
        formError = value.length > 400 ? LANG[localStorage.JobChoiceLanguage].reason_to_hire + LANG[localStorage.JobChoiceLanguage].maxCharacters1 + '400' + LANG[localStorage.JobChoiceLanguage].maxCharacters2 : ""
        break
      case "welfare_description":
      case "welfare_working_period":
      case "working_condition":
        const tempName1 = name === 'welfare_description' ? LANG[localStorage.JobChoiceLanguage].welfare : name === 'welfare_working_period' ? LANG[localStorage.JobChoiceLanguage].working_period : LANG[localStorage.JobChoiceLanguage].working_period_remarks
        formError = value && value !== null && value.length > 1000 ? tempName1 + LANG[localStorage.JobChoiceLanguage].maxCharacters1 + '1000' + LANG[localStorage.JobChoiceLanguage].maxCharacters2 : ""
        break
      case "planned_hire":
        formError = value && value !== null && value.length > 3 ? LANG[localStorage.JobChoiceLanguage].plannedHires + LANG[localStorage.JobChoiceLanguage].maxCharacters1 + '3' + LANG[localStorage.JobChoiceLanguage].maxCharacters2 : ""
        break
      case "no_days_week_max_range":
        formError = (this.state.section4.no_days_week !== '' && value && value !== null && value.length > 0 && Number(value) < Number(this.state.section4.no_days_week)) ? LANG[localStorage.JobChoiceLanguage].minRangeNotBeGreatThanMax : value && value !== null && value.length > 1 ? LANG[localStorage.JobChoiceLanguage].weekWorkDays + LANG[localStorage.JobChoiceLanguage].maxCharacters1 + '1' + LANG[localStorage.JobChoiceLanguage].maxCharacters2 : value && value !== null && value > 6 ? LANG[localStorage.JobChoiceLanguage].mustNotExceed6Days : ""
        break
      case "no_days_week":
        formError = value && value !== null && value.length === 0 && this.state.optionalSection4.no_days_week_max_range && this.state.optionalSection4.no_days_week_max_range !== null && this.state.optionalSection4.no_days_week_max_range.length > 0 ? LANG[localStorage.JobChoiceLanguage].thisIsRequired : (this.state.optionalSection4.no_days_week_max_range !== '' && Number(value) > Number(this.state.optionalSection4.no_days_week_max_range)) ? LANG[localStorage.JobChoiceLanguage].minRangeNotBeGreatThanMax : value && value !== null && value.length > 1 ? LANG[localStorage.JobChoiceLanguage].weekWorkDays + LANG[localStorage.JobChoiceLanguage].maxCharacters1 + '1' + LANG[localStorage.JobChoiceLanguage].maxCharacters2 : value && value !== null && value > 6 ? LANG[localStorage.JobChoiceLanguage].mustNotExceed6Days : ""
        break
      case "payment_type":
        formError = value && value !== null && value.length === 0 && this.state.section4.salary.length > 0 ? LANG[localStorage.JobChoiceLanguage].thisIsRequired : ""
        break
      case "salary_max_range":
        const salary_without_comma1 = parseFloat(String(this.state.section4.salary).replace(/,/g, ''))
        const salary_max_range_without_comma1 = parseFloat(String(value).replace(/,/g, ''))
        formError = value && value !== null && value.length === 0 ? '' : (this.state.section4.salary && this.state.section4.salary !== null && this.state.section4.salary.length > 0 && Number(salary_max_range_without_comma1) < Number(salary_without_comma1)) ? LANG[localStorage.JobChoiceLanguage].minRangeNotBeGreatThanMax : value && value !== null && value.length > 7 ? LANG[localStorage.JobChoiceLanguage].salary + LANG[localStorage.JobChoiceLanguage].maxCharacters1 + '6' + LANG[localStorage.JobChoiceLanguage].maxCharacters2 : ''
        break
      case "salary":
        const salary_without_comma2 = parseFloat(String(value).replace(/,/g, ''))
        const salary_max_range_without_comma2 = parseFloat(String(this.state.optionalSection4.salary_max_range).replace(/,/g, ''))
        formError = (this.state.optionalSection4.salary_max_range !== '' && Number(salary_without_comma2) > Number(salary_max_range_without_comma2)) ? LANG[localStorage.JobChoiceLanguage].minRangeNotBeGreatThanMax : value && value !== null && value.length > 7 ? LANG[localStorage.JobChoiceLanguage].salary + LANG[localStorage.JobChoiceLanguage].maxCharacters1 + '6' + LANG[localStorage.JobChoiceLanguage].maxCharacters2 :  ""
        break
      case "required_gender":
        formError = (this.state.section4.ratio_gender_scope === 'required' || this.state.section4.ratio_gender_scope === 'preferable') && value.length === 0 ? LANG[localStorage.JobChoiceLanguage].thisIsRequired : ''
        break
      case "required_min_age":
        formError = (this.state.optionalSection4.required_max_age !== '' && Number(this.state.optionalSection4.required_max_age) <= Number(value)) ? LANG[localStorage.JobChoiceLanguage].minRangeNotMaxRange : value && value !== null && value.length > 2 ? LANG[localStorage.JobChoiceLanguage].ageRangeRequired + LANG[localStorage.JobChoiceLanguage].maxCharacters1 + '2' + LANG[localStorage.JobChoiceLanguage].maxCharacters2 : ((this.state.section4.ratio_age_scope === 'required' || this.state.section4.ratio_age_scope === 'preferable') && value.length === 0) ? LANG[localStorage.JobChoiceLanguage].thisIsRequired : ''
        break
      case "required_max_age":
        formError = (this.state.optionalSection4.required_min_age !== '' && Number(this.state.optionalSection4.required_min_age) >= Number(value)) ? LANG[localStorage.JobChoiceLanguage].minRangeNotMaxRange : value && value !== null && value.length > 2 ? LANG[localStorage.JobChoiceLanguage].ageRangeRequired + LANG[localStorage.JobChoiceLanguage].maxCharacters1 + '2' + LANG[localStorage.JobChoiceLanguage].maxCharacters2 : ((this.state.section4.ratio_age_scope === 'required' || this.state.section4.ratio_age_scope === 'preferable') && value.length === 0) ? LANG[localStorage.JobChoiceLanguage].thisIsRequired : ''
        break
      default:
        break
    }

    return formError
  }

  render() {
    return (
      <div className="createJob-section-bg createJob-no-bottom">
        <div className="createJob-section-header">
          <span>{LANG[localStorage.JobChoiceLanguage].recruitDetailsInfo}</span>
        </div>
        <div className="createJob-inputArea">
          {!this.props.viewToEdit ?
            <InputTextArea
              field="qualifications"
              label={LANG[localStorage.JobChoiceLanguage].recruitDetailsInfo}
              onChange={this.handleInputChange}
              value={this.state.section4.qualifications}
              error={this.handleFormError('qualifications', this.state.section4.qualifications)}
              additionalStyle="createJob-input-solo"
              resize={true}
              required
            /> :
            <InputTextAreaEditing
              field="qualifications"
              label={LANG[localStorage.JobChoiceLanguage].recruitDetailsInfo}
              onChange={this.handleInputChange}
              value={this.state.section4.qualifications}
              error={this.handleFormError('qualifications', this.state.section4.qualifications)}
              additionalStyle="createJob-input-solo"
              resize={true}
              required
            />
          }
        </div>
        <div className="createJob-inputArea createJob-sameline">
          <label htmlFor="job_type">
            {LANG[localStorage.JobChoiceLanguage].jobCategory}
            <span className="required-badge">
              <small>{LANG[localStorage.JobChoiceLanguage].required}</small>
            </span>:
          </label>
          <div name="job_type">
            <InputDropDown
              id="job_type_large"
              field="job_type_large"
              onChange={this.changeChosenJobCategory}
              value={this.state.category_index}
              >
                {(this.state.categories.map((option, key) => {
                  return (
                    <option key={key} value={key}>
                      {option.category}
                    </option>)
                }))}
            </InputDropDown>
            <div
              className={`createJob-multipleSelect ${this.state.formErrors.job_type_specific && this.state.formErrors.job_type_specific !== null && this.state.formErrors.job_type_specific.length > 0 ? "errorBorder": ""}`}
              id="job_type_specific">
            {this.state.categories[this.state.category_index].job_sub_category.map(
                (option, key) => {
                  return(
                    <span key={option.sub_category}>
                      <label className="createJob-multipleSelect-box">
                        <input
                          name={option.sub_category}
                          type="checkbox"
                          checked={option.isSelected}
                          onChange={e =>
                            {
                              this.handleInputChange("job_type_specific", option.id)
                            }
                          }
                        />
                      </label>
                      <label onClick={() => this.checkLabel('job_type_specific', option.id)} className="createJob-multipleSelect-box-label">{option.sub_category}</label>
                    </span>
                  )
              })}
            </div>
          </div>
        </div>

        <div className="createJob-inputArea">
          <Input
            field="planned_hire"
            pattern="[0-9]*"
            label={LANG[localStorage.JobChoiceLanguage].createJobPlannedHires}
            onChange={this.handleInputChange}
            value={this.state.section4.planned_hire}
            error={this.handleFormError('planned_hire', this.state.section4.planned_hire)}
            className="createJob-input-solo"
            required
          />
        </div>

        <div className="createJob-inputArea createJob-sameline">
          <label htmlFor="salary">
            {LANG[localStorage.JobChoiceLanguage].salary}
            <span className="required-badge"><small>{LANG[localStorage.JobChoiceLanguage].required}</small></span>:
          </label>
          <div name="salary" className="three-in-line">
            <InputDropDown
              placeholder=" "
              field="payment_type"
              options={salaryFrequencyOptions}
              onChange={this.handleInputChange}
              error={this.handleFormError('payment_type', this.state.section4.payment_type)}
              value={this.state.section4.payment_type}
            >
                {(salaryFrequencyOptions.map((option) => {
                  return (
                    <option key={option.value} value={option.value}>
                      {localStorage.JobChoiceLanguage === "JP" ? option.item_jp : option.item_en}
                    </option>)
                }))}
            </InputDropDown>
            <div id="job-salary-center" className="createJob-inputArea-oneline">
              <InputNumberWithComma
                field="salary"
                pattern="[0-9\.,]+"
                onChange={this.handleInputChange}
                value={this.state.section4.salary}
                error={this.handleFormError('salary', this.state.section4.salary)}
                required
              />
              <span>円</span>
            </div>
            <div id="job-salary-right" className="createJob-inputArea-oneline-triple">
              <span id="first-span">～</span>
              <InputNumberWithComma
                field="salary_max_range"
                pattern="[0-9\.,]+"
                onChange={this.handleInputChange}
                value={this.state.optionalSection4.salary_max_range}
                error={this.handleFormError('salary_max_range', this.state.optionalSection4.salary_max_range)}
              />
              <span id="second-span">円</span>
            </div>
          </div>
        </div>

        <div className="createJob-inputArea">
          {!this.props.viewToEdit ?
            <InputTextArea
              field="benefits"
              label={LANG[localStorage.JobChoiceLanguage].benefits}
              onChange={this.handleInputChange}
              value={this.state.optionalSection4.benefits}
              additionalStyle="createJob-input-solo"
              resize={true}
            /> :
            <InputTextAreaEditing
              field="benefits"
              label={LANG[localStorage.JobChoiceLanguage].benefits}
              onChange={this.handleInputChange}
              value={this.state.optionalSection4.benefits}
              additionalStyle="createJob-input-solo"
              resize={true}
            />
          }
        </div>

        <div className="createJob-inputArea createJob-sameline">
          <label htmlFor="job_week">
            {LANG[localStorage.JobChoiceLanguage].weekWorkDays}
            <span className="required-badge">
              <small>{LANG[localStorage.JobChoiceLanguage].required}</small>
            </span>:
          </label>
          <div name="job_week" id="job-type" className="createJob-inputArea-oneline">
            <div className="createJob-inputArea-oneline createJob-weekDays">
              <Input
                field="no_days_week"
                pattern="[0-9]*"
                onChange={this.handleInputChange}
                value={this.state.section4.no_days_week}
                error={this.handleFormError('no_days_week', this.state.section4.no_days_week)}
                required
              />
              <span>{LANG[localStorage.JobChoiceLanguage].moreThan} {LANG[localStorage.JobChoiceLanguage].preDays}</span>
            </div>
            <div className="createJob-inputArea-oneline createJob-weekDays">
              <Input
                className="createJob-inputFull"
                field="no_days_week_max_range"
                pattern="[0-9]*"
                onChange={this.handleInputChange}
                value={this.state.optionalSection4.no_days_week_max_range}
                error={this.handleFormError('no_days_week_max_range', this.state.optionalSection4.no_days_week_max_range)}
              />
              <span>{LANG[localStorage.JobChoiceLanguage].withIn} {LANG[localStorage.JobChoiceLanguage].Days}</span>
            </div>
          </div>
        </div>
        <div id="job_week_empty" className="createJob-inputArea createJob-inputArea-oneline">
          <div></div>
          <div id="job_week_empty_desc">
            <span>{LANG[localStorage.JobChoiceLanguage].conditionsAre}</span>
          </div>
        </div>

        <div className="createJob-inputArea createJob-sameline">
          <label htmlFor="week_days_available">
            {LANG[localStorage.JobChoiceLanguage].workDaysAvailable}
            <span className="optional-badge">
              <small> {LANG[localStorage.JobChoiceLanguage].optional} </small>
            </span>
            :
          </label>
          <div name="week_days_available" className="createJob-multipleSelect-oneline" id="week_days_available">
            {EM[localStorage.JobChoiceLanguage].WEEKDAYS.map((option, key) => {
              return(
                <span key={key}>
                  <label>
                    <input
                      name={key}
                      type="checkbox"
                      onChange={() => this.handleInputChange("days", option.id)}
                      checked={this.state.optionalSection4.days && this.state.optionalSection4.days.length > 0 && this.state.optionalSection4.days.filter(function (day) {return day === option.id})[0]}
                    />
                  </label>
                  <label onClick={() => this.checkLabel('days', option.id)} className="createJob-hoverer">{option.item}</label>
                </span>
              )
            })}
          </div>
        </div>

        <div className="createJob-matchingCalculations">
          <label className="createJob-section-header" htmlFor="matching_calc_conditions">{LANG[localStorage.JobChoiceLanguage].matchingCalcConditions}<span className="required-badge"><small> {LANG[localStorage.JobChoiceLanguage].required} </small></span>:</label><br />
          <span>※性別年齢指定で完全非表示にする子は出来ません。下記設定でユーザーとのマッチング率を変更することができます。　詳しくはマッチングロジックについてをご参照下さい。</span>
          <div name="matching_calc_conditions">
            <div id="job-matching-gender" className="createJob-inputArea-oneline">
              <InputRadio
                id="ratio_gender_scope"
                field="ratio_gender_scope"
                label={LANG[localStorage.JobChoiceLanguage].gender}
                options={EM[localStorage.JobChoiceLanguage].MATCHING_CALC}
                onChange={this.handleInputChange}
                error={this.handleFormError('ratio_gender_scope', this.state.section4.ratio_gender_scope)}
                value={this.state.section4.ratio_gender_scope}
                additionalStyleUpperDiv="createJob-radio-inliner"
                required
              />
              <div id="required_gender">
                <InputRadio
                  field="required_gender"
                  label={LANG[localStorage.JobChoiceLanguage].specificGenderRequired}
                  options={EM[localStorage.JobChoiceLanguage].MATCHING_CALC_GENDER}
                  onChange={this.handleInputChange}
                  error={this.handleFormError('required_gender', this.state.optionalSection4.required_gender)}
                  value={this.state.optionalSection4.required_gender}
                  required={this.state.section4.ratio_gender_scope === 'required' || this.state.section4.ratio_gender_scope === 'preferable'}
                  additionalStyleUpperDiv="createJob-radio-inliner"
                />
              </div>
            </div>
            <div id="job-matching-age" className="createJob-inputArea-oneline">
              <InputRadio
                id="ratio_age_scope"
                field="ratio_age_scope"
                label={LANG[localStorage.JobChoiceLanguage].age}
                options={EM[localStorage.JobChoiceLanguage].MATCHING_CALC}
                onChange={this.handleInputChange}
                error={this.handleFormError('ratio_age_scope', this.state.section4.ratio_age_scope)}
                value={this.state.section4.ratio_age_scope}
                additionalStyleUpperDiv="createJob-radio-inliner"
                required
              />
              <div id="job-matching-age-area">
                <label htmlFor="matching_calc_conditions">
                  {LANG[localStorage.JobChoiceLanguage].ageRangeRequired}
                  {this.state.section4.ratio_age_scope === 'required' ||
                    this.state.section4.ratio_age_scope === 'preferable' ?
                      <span className="required-badge"><small>{LANG[localStorage.JobChoiceLanguage].required}</small></span> :
                      <span className="optional-badge"><small>{LANG[localStorage.JobChoiceLanguage].optional}</small></span>}:
                </label><br />
                <div className="job-matching-age-input job-matching-age-width">
                  <Input
                    field="required_min_age"
                    pattern="[0-9]*"
                    placeholder={LANG[localStorage.JobChoiceLanguage].enterMinAgeRange}
                    onChange={this.handleInputChange}
                    value={this.state.optionalSection4.required_min_age}
                    error={this.handleFormError('required_min_age', this.state.optionalSection4.required_min_age)}
                    className="job-matching-age-input-div1"
                  />
                  <span>～</span>
                  <Input
                    field="required_max_age"
                    pattern="[0-9]*"
                    placeholder={LANG[localStorage.JobChoiceLanguage].enterMaxAgeRange}
                    onChange={this.handleInputChange}
                    value={this.state.optionalSection4.required_max_age}
                    error={this.handleFormError('required_max_age', this.state.optionalSection4.required_max_age)}
                    className="job-matching-age-input-div2"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="createJob-time-info">
          <span>
            <b>時間が選べるお仕事の場合は具体的なシフトを複数ご登録ください。<br/>
            最上段に登録いただくシフトパターンが最も目立ちます。<br/>
            10時～16時など主婦が働きやすい時間帯を最上段にすると応募効果が高まるのでお勧めです。</b>
          </span><br /><br />
          <span>例）9時～18時のうち5時間から相談可の求人の場合</span><br />
          <span>○、10:00AM～4:00PM、11:00AM～5:00PM、9:00AM～6:00PM</span><br />
          <span>×、9:00AM～6:00PM、10:00AM～4:00PM、11:00AM～5:00PM</span><br />
        </div> */}

        <div className="createJob-inputArea createJob-sameline">
          <label htmlFor="matching_calc_conditions">
            {LANG[localStorage.JobChoiceLanguage].workingHours}
            <span className="required-badge"><small>{LANG[localStorage.JobChoiceLanguage].required}</small></span>:
          </label>
          <div className="job-matching-age-input">
            <InputTime
              field="start_time"
              onChange={ this.handleInputChange }
              error={ this.handleFormError('start_time', this.state.section4.start_time) }
              value={ this.state.section4.start_time }
              displaycreatejob={ 'true' }
              className="job-matching-age-input-div1"
              calendarClassName="job-matching-time-calendar"
            />
            <span>～</span>
            <InputTime
              field="end_time"
              onChange={ this.handleInputChange }
              error={ this.handleFormError('end_time', this.state.section4.end_time) }
              value={ this.state.section4.end_time }
              displaycreatejob={ 'true' }
              className="job-matching-age-input-div2"
              calendarClassName="job-matching-time-calendar"
            />
          </div>
        </div>

        <div className="createJob-inputArea createJob-sameline section-break">
          <label htmlFor="job_welfares">
            {LANG[localStorage.JobChoiceLanguage].welfare}
            <span className="optional-badge"><small>{LANG[localStorage.JobChoiceLanguage].optional}</small></span>:
          </label>
          <div name="job_welfares" className="createJob-multipleSelect-oneline" id="week_days_available">
            {welfareOptions.map((option, key) => {
              return(
                <span key={key}>
                  <label>
                    <input
                      name={key}
                      type="checkbox"
                      onChange={e => this.handleInputChange("job_welfares", option.id)}
                      checked={this.state.optionalSection4.job_welfares.length > 0 && this.state.optionalSection4.job_welfares.filter(function (welfare) {return welfare === option.id})[0]}
                    />
                  </label>
                  <label onClick={() => this.checkLabel('job_welfares', option.id)} className="createJob-hoverer">{localStorage.JobChoiceLanguage === 'JP' ? option.item_jp: option.item_en}</label>
                </span>
              )
            })}
          </div>
        </div>

        <div className="createJob-inputArea">
          {!this.props.viewToEdit ?
            <InputTextArea
              field="welfare_description"
              label={LANG[localStorage.JobChoiceLanguage].welfare}
              onChange={this.handleInputChange}
              value={this.state.optionalSection4.welfare_description}
              error={this.handleFormError('welfare_description', this.state.optionalSection4.welfare_description)}
              additionalStyle="createJob-input-solo"
              resize={true}
            /> :
            <InputTextAreaEditing
              field="welfare_description"
              label={LANG[localStorage.JobChoiceLanguage].welfare}
              onChange={this.handleInputChange}
              value={this.state.optionalSection4.welfare_description}
              error={this.handleFormError('welfare_description', this.state.optionalSection4.welfare_description)}
              additionalStyle="createJob-input-solo"
              resize={true}
            />
          }
        </div>

        <div className="createJob-inputArea">
          {!this.props.viewToEdit ?
            <InputTextArea
              field="welfare_working_period"
              label={LANG[localStorage.JobChoiceLanguage].working_period}
              onChange={this.handleInputChange}
              value={this.state.optionalSection4.welfare_working_period}
              error={this.handleFormError('welfare_working_period', this.state.optionalSection4.welfare_working_period)}
              additionalStyle="createJob-input-solo"
              resize={true}
            /> :
            <InputTextAreaEditing
              field="welfare_working_period"
              label={LANG[localStorage.JobChoiceLanguage].working_period}
              onChange={this.handleInputChange}
              value={this.state.optionalSection4.welfare_working_period}
              error={this.handleFormError('welfare_working_period', this.state.optionalSection4.welfare_working_period)}
              additionalStyle="createJob-input-solo"
              resize={true}
            />
          }
        </div>

        <div className="createJob-inputArea">
          {!this.props.viewToEdit ?
            <InputTextArea
              field="working_condition"
              label={LANG[localStorage.JobChoiceLanguage].working_period_remarks}
              onChange={this.handleInputChange}
              value={this.state.optionalSection4.working_condition}
              error={this.handleFormError('working_condition', this.state.optionalSection4.working_condition)}
              additionalStyle="createJob-input-solo"
              resize={true}
            /> :
            <InputTextAreaEditing
              field="working_condition"
              label={LANG[localStorage.JobChoiceLanguage].working_period_remarks}
              onChange={this.handleInputChange}
              value={this.state.optionalSection4.working_condition}
              error={this.handleFormError('working_condition', this.state.optionalSection4.working_condition)}
              additionalStyle="createJob-input-solo"
              resize={true}
            />
          }
        </div>

        <div className="createJob-inputArea">
          {!this.props.viewToEdit ?
            <InputTextArea
              field="reason_to_hire1"
              label={LANG[localStorage.JobChoiceLanguage].reason_to_hire + '1'}
              onChange={this.handleInputChange}
              value={this.state.optionalSection4.job_reasons_to_hire[0]}
              error={this.handleFormError('reason_to_hire1', this.state.optionalSection4.job_reasons_to_hire[0])}
              additionalStyle="createJob-input-solo"
              resize={true}
            /> :
            <InputTextAreaEditing
              field="reason_to_hire1"
              label={LANG[localStorage.JobChoiceLanguage].reason_to_hire + '1'}
              onChange={this.handleInputChange}
              value={this.state.optionalSection4.job_reasons_to_hire[0]}
              error={this.handleFormError('reason_to_hire1', this.state.optionalSection4.job_reasons_to_hire[0])}
              additionalStyle="createJob-input-solo"
              resize={true}
            />
          }
        </div>

        <div className="createJob-inputArea">
          {!this.props.viewToEdit ?
            <InputTextArea
              field="reason_to_hire2"
              label={LANG[localStorage.JobChoiceLanguage].reason_to_hire + '2'}
              onChange={this.handleInputChange}
              value={this.state.optionalSection4.job_reasons_to_hire[1]}
              error={this.handleFormError('reason_to_hire2', this.state.optionalSection4.job_reasons_to_hire[1])}
              additionalStyle="createJob-input-solo"
              resize={true}
            /> :
            <InputTextAreaEditing
              field="reason_to_hire2"
              label={LANG[localStorage.JobChoiceLanguage].reason_to_hire + '2'}
              onChange={this.handleInputChange}
              value={this.state.optionalSection4.job_reasons_to_hire[1]}
              error={this.handleFormError('reason_to_hire2', this.state.optionalSection4.job_reasons_to_hire[1])}
              additionalStyle="createJob-input-solo"
              resize={true}
            />
          }
        </div>

        <div className="createJob-inputArea">
          {!this.props.viewToEdit ?
            <InputTextArea
              field="reason_to_hire3"
              label={LANG[localStorage.JobChoiceLanguage].reason_to_hire + '3'}
              onChange={this.handleInputChange}
              value={this.state.optionalSection4.job_reasons_to_hire[2]}
              error={this.handleFormError('reason_to_hire3', this.state.optionalSection4.job_reasons_to_hire[2])}
              additionalStyle="createJob-input-solo"
              resize={true}
            /> :
            <InputTextAreaEditing
              field="reason_to_hire3"
              label={LANG[localStorage.JobChoiceLanguage].reason_to_hire + '3'}
              onChange={this.handleInputChange}
              value={this.state.optionalSection4.job_reasons_to_hire[2]}
              error={this.handleFormError('reason_to_hire3', this.state.optionalSection4.job_reasons_to_hire[2])}
              additionalStyle="createJob-input-solo"
              resize={true}
            />
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return state
}

export default connect(mapStateToProps)(CreateJobSection4)
