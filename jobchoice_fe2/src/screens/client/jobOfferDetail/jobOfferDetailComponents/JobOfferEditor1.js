import React, { Component } from 'react'
import '../JobOfferDetail.scss'
import '../../createJob/CreateJob.scss'
import api from '../../../../utilities/api'
import { connect } from 'react-redux'
import { Button } from 'react-bootstrap'
import Input from '../../../../components/input/Input'
import InputTextAreaEditing from '../../../../components/inputTextArea/InputTextAreaEditing'
import InputDropDown from '../../../../components/inputDropDown/InputDropDown'
import InputFile from '../../../../components/InputFile/InputFile'
import InputHatarakikata from '../../createJob/createJobComponents/CreateJobHatarakikata'
import HatarakikataDisplay from '../../../../components/hatarakikata/hatarakikataDisplay/HatarakikataDisplay'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { LANG } from '../../../../constants'
import { bindActionCreators } from 'redux'
import * as authActions from '../../../../store/auth/actions'

const fileTypes = ['image/png', 'image/jpeg', 'image/gif']

const formValid = ({ formErrors, page1 }) => {
  let valid = true
  Object.values(formErrors).forEach(val => {
    val.length > 0 && (valid = false)
  })
  Object.values(page1).forEach(val => {
    val.length === 0 && (valid = false)
  })
  return valid
}

const employmentOptions = [
  {
    item: 'Regular',
    id: 'regular',
    incentive: 2000,
  },
  {
    item: 'Temporary',
    id: 'temporary',
    incentive: 1000,
  },
  {
    item: 'Dispatch',
    id: 'dispatch',
    incentive: 3000,
  },
  {
    item: 'Contract Employee (Less than 35 hours a week)',
    id: 'contract_less_35_hrs_week',
    incentive: 1000,
  },
  {
    item: 'Contract Employee (More than 35 hours a week)',
    id: 'contract_more_35_hrs_week',
    incentive: 1500,
  },
  {
    item: 'Short Time',
    id: 'short_time',
    incentive: 500,
  },
  {
    item: 'Outsourcing',
    id: 'outsourcing',
    incentive: 500,
  },
  {
    item: 'Franchise',
    id: 'franchise',
    incentive: 1000,
  },
]

const employment_type_options = 
[
  {item: 'Regular', id: 'regular',},
  {item: 'Temporary', id: 'temporary',},
  {item: 'Dispatch', id: 'dispatch',},
  {item: 'Contract Employee (Less than 35 hours a week)', id: 'contract_less_35_hrs_week',},
  {item: 'Contract Employee (More than 35 hours a week)', id: 'contract_more_35_hrs_week',},
  {item: 'Short Time', id: 'short_time',},
  {item: 'Outsourcing', id: 'outsourcing',},
  {item: 'Franchise', id: 'franchise',},
]

const dataFormat = {
  title: '',
  description: '',
  employment_type: '',
  incentive_per_share: '',
  hataraki_kata: '',
  recruitment_tag: '',
}

const optionalFormat = {
  sub_caption1: '',
  sub_caption2: '',
  sub_caption3: '',
}

class JobOfferEditor1 extends Component {
  constructor(props) {
    super(props)

    this.state = {
      page1: {
        title: this.props.details.title,
        description: this.props.details.description,
        employment_type: this.props.details.employment_type,
        incentive_per_share: this.props.details.incentive_per_share,
        hataraki_kata: [],
        recruitment_tag: this.props.details.recruitment_tag,
        other_hataraki_kata: this.props.details.other_hataraki_kata, 
        company_id: this.props.details.company_id,
      },
      geolocation: {
        complete_address: this.props.details.geolocation.complete_address,
        prefectures: this.props.details.geolocation.prefectures,
        zip_code: this.props.details.geolocation.zip_code,
        station: this.props.details.geolocation.station,
      },
      images: {
        job_image: this.props.details.job_image,
        sub_image1: this.props.details.galleries.length > 0 && this.props.details.galleries[0] ? this.props.details.galleries[0].file_path : '',
        sub_image2: this.props.details.galleries.length > 0 && this.props.details.galleries[1] ? this.props.details.galleries[1].file_path : '',
        sub_image3: this.props.details.galleries.length > 0 && this.props.details.galleries[2] ? this.props.details.galleries[2].file_path : '',
      },
      optional: {
        sub_caption1: this.props.details.galleries.length > 0 && this.props.details.galleries[0] ? this.props.details.galleries[0].caption : '',
        sub_caption2: this.props.details.galleries.length > 0 && this.props.details.galleries[1] ? this.props.details.galleries[1].caption : '',
        sub_caption3: this.props.details.galleries.length > 0 && this.props.details.galleries[2] ? this.props.details.galleries[2].caption : '',
      },
      formErrors: {
        ...dataFormat, 
        other_hataraki_kata: '',
        complete_address: '',
        zip_code: '',
        station: '',
        job_image: '',
      },
      optionalErrors: {...optionalFormat},
      typingTimeout: 0,
      isSearching: false,
      hatarakikata: this.props.hatarakikata,
      showHatarakikata: false,
      showcaseHatarakikata: this.props.details.hataraki_kata_resource,
      mainOptions: this.props.hatarakikata,
      recOptions: this.props.hatarakikata,
      anyOptions: this.props.hatarakikata,
      userDetails: this.props.details,
      view: this.props.view,
      totalImageSize: 0,
      job_imageSize: 0,
      sub_image1Size: 0,
      sub_image2Size: 0,
      sub_image3Size: 0,
      lowestValue: null,
    }

    this.handleFile = this.handleFile.bind(this)
    this.handleEdit = this.handleEdit.bind(this)
    this.clickHatarakikata = this.clickHatarakikata.bind(this)
  }

  componentDidMount() {
    const recruitment_tag = this.props.hatarakikata.find(h => h.id === this.state.userDetails.recruitment_tag)
    const employment_type = employment_type_options.find(e => e.id === this.state.userDetails.employment_type)
    const hataraki_kata_resource = this.props.details.hataraki_kata_resource.map((value, key) => {
      return (value.hataraki_kata_id)
    })

    this.setState({
      userDetails: {
        ...this.state.userDetails,
        recruitment_tag: recruitment_tag,
        employment_type: employment_type,
      },
      page1: {
        ...this.state.page1,
        hataraki_kata: hataraki_kata_resource,
      },
    })
  }

  handleEdit() {
    this.props.handleEdit()
    this.setState({view: !this.state.view})
  }

  handleInputChange = (name, value) => {
    let formErrors = { ...this.state.formErrors }

    switch (name) {
      case "incentive_per_share": 
      case "employment_type":
        if(this.state.lowestValue !== null) {
          formErrors.incentive_per_share = value.length < 1 ? "This is Required" : value < this.state.lowestValue ? "Value must not be lower than initial value " + this.state.lowestValue  : ""
        } else {
          formErrors.incentive_per_share = ""
        }
      break
      default:
        formErrors[name] = value.length < 1 ? "This is Required" : ""
        break
    }

    if(name === "other_hataraki_kata") {
      if(this.state.page1.other_hataraki_kata.find(item => item === value)) {
        var index = this.state.page1[name].indexOf(this.state.page1[name].find(item => item === value))
        this.state.page1[name].splice(index, 1)
        this.checkHatarakikataAny()
      } else {
        this.state.page1[name].push(value)
        this.checkHatarakikataAny()
      }
      this.handleHatarakikata()
    } else if(name === "sub_caption1" || name === "sub_caption2" || name === "sub_caption3") {
      this.setState({
        formErrors,
        optional: {
          ...this.state.optional,
          [name]: value
        }
      })
    } else if(name === "complete_address" || name === "station") {
      this.setState({
        formErrors,
        geolocation: {
          ...this.state.geolocation,
          [name]: value
        }
      })
    } else if(name === "employment_type") {
      if(value.length > 0) {
        this.setState({
          formErrors,
          page1: {
            ...this.state.page1,
            incentive_per_share: employmentOptions.find(item => item.id === value).incentive,
            [name]: value
          },
          lowestValue: employmentOptions.find(item => item.id === value).incentive
        })
      } else {
        this.setState({
          formErrors,
          page1: {
            ...this.state.page1,
            incentive_per_share: "",
            [name]: value
          },
          lowestValue: null
        })
      }
    } else {
      this.setState({
        formErrors,
        page1: {
          ...this.state.page1,
          [name]: value
        }
      }, () => {
        if(name === "hataraki_kata" || name === "recruitment_tag") {
          this.handleHatarakikata()
          this.handleShowcase()
        }
      })
    }
  }

  onZipCodeInput = (name, value) => {
    if (this.state.typingTimeout) {
      clearTimeout(this.state.typingTimeout)
    }

    if(value.length === 0) {
      this.setState({
        formErrors: {
          ...this.state.formErrors,
          [name]: "This is required."
        }
      })
    } else {
      this.setState({
        formErrors: {
          ...this.state.formErrors,
          [name]: ""
        }
      })
    }

    this.setState({
      geolocation: {
        ...this.state.geolocation,
        zip_code: value,
      },
      isSearching: true,
    }, () => setTimeout(this.onSearchFunction(value), 1000))
  }

  onSearchFunction = (zipcode) => {
    api.post('api/zipcode', {zipcode:zipcode}).then(response => {
      if (response.data.results) {
        const address = `${response.data.results[0].address2}${response.data.results[0].address3}`
        const prefecture = `${response.data.results[0].address1}`
        this.setState({
          geolocation: {
            ...this.state.geolocation,
            complete_address: address,
            prefectures: prefecture,
          }
        })
      }
    }).catch(error => {
      console.log(error)
      this.setState({
        modal: {
          message: LANG[localStorage.JobChoiceLanguage].serverError,
          modal: true,
          modalType: 'error',
          redirect: '/',
        },
        isLoading: false
      })
    })
  }

  handleHatarakikata() {
    this.setState({showHatarakikata: false})

    //mainOptions if rec(OK) & any(OK)
    if(this.state.page1.recruitment_tag.length > 0 && this.state.page1.other_hataraki_kata.length > 0) {
      const hatarakikataOptionsMain = this.props.hatarakikata.filter(el => 
        (Number(this.state.page1.recruitment_tag) === el.id || this.state.page1.other_hataraki_kata.find(h => h === el.id)) === undefined
      )
      this.setState({mainOptions: hatarakikataOptionsMain})
    }

    //mainOptions if rec(OK) & any(null)
    if(this.state.page1.recruitment_tag.length > 0 && (this.state.page1.other_hataraki_kata.length === 0 || !this.state.page1.other_hataraki_kata)) {
      const hatarakikataOptionsMain = this.props.hatarakikata.filter(el => 
        (Number(this.state.page1.recruitment_tag) !== el.id)
      )
      this.setState({mainOptions: hatarakikataOptionsMain})
    }

    //mainOptions if rec(null) & any(OK)
    if((this.state.page1.recruitment_tag.length === 0 || !this.state.page1.recruitment_tag) && this.state.page1.other_hataraki_kata.length > 0) {
      const hatarakikataOptionsMain = this.props.hatarakikata.filter(el => 
        this.state.page1.other_hataraki_kata.find(h => h === el.id) === undefined
      )
      this.setState({mainOptions: hatarakikataOptionsMain})
    }

    //mainOptions if rec(null) & any(null)
    if((this.state.page1.recruitment_tag.length === 0 || !this.state.page1.recruitment_tag) && (this.state.page1.other_hataraki_kata.length === 0 || !this.state.page1.other_hataraki_kata)) {
      this.setState({mainOptions: this.props.hatarakikata})
    }


    //recOptions if main(OK) & any(OK)
    if(this.state.page1.hataraki_kata.length > 0 && this.state.page1.other_hataraki_kata.length > 0) {
      const hatarakikataOptionsRec = this.props.hatarakikata.filter(el => 
        (this.state.page1.hataraki_kata.find(h => h === el.id) || this.state.page1.other_hataraki_kata.find(h => h === el.id)) === undefined
      )
      this.setState({recOptions: hatarakikataOptionsRec})
    }

    //recOptions if main(OK) & any(null)
    if(this.state.page1.hataraki_kata.length > 0 && (this.state.page1.other_hataraki_kata.length === 0 || !this.state.page1.other_hataraki_kata)) {
      const hatarakikataOptionsRec = this.props.hatarakikata.filter(el => 
        (this.state.page1.hataraki_kata.find(h => h === el.id)) === undefined
      )
      this.setState({recOptions: hatarakikataOptionsRec})
    }

    //recOptions if main(null) & any(OK)
    if((this.state.page1.hataraki_kata.length === 0 || !this.state.page1.hataraki_kata) && this.state.page1.other_hataraki_kata.length > 0) {
      const hatarakikataOptionsRec = this.props.hatarakikata.filter(el => 
        (this.state.page1.other_hataraki_kata.find(h => h === el.id)) === undefined
      )
      this.setState({recOptions: hatarakikataOptionsRec})
    }

    //recOptions if main(null) & any(null)
    if((this.state.page1.hataraki_kata.length === 0 || !this.state.page1.hataraki_kata) && (this.state.page1.other_hataraki_kata.length === 0 || !this.state.page1.other_hataraki_kata)) {
      this.setState({recOptions: this.props.hatarakikata})
    }


    //anyOptions if main(OK) & rec(OK)
    if(this.state.page1.hataraki_kata.length > 0 && this.state.page1.recruitment_tag.length > 0) {
      const hatarakikataOptionsAny = this.props.hatarakikata.filter(el => 
        (Number(this.state.page1.recruitment_tag) === el.id || this.state.page1.hataraki_kata.find(h => h === el.id)) === undefined
      )
      this.setState({anyOptions: hatarakikataOptionsAny})
    }

    //anyOptions if main(OK) & rec(null)
    if(this.state.page1.hataraki_kata.length > 0 && (this.state.page1.recruitment_tag.length === 0 || !this.state.page1.recruitment_tag)) {
      const hatarakikataOptionsAny = this.props.hatarakikata.filter(el => 
        (this.state.page1.hataraki_kata.find(h => h === el.id)) === undefined
      )
      this.setState({anyOptions: hatarakikataOptionsAny})
    }

    //anyOptions if main(null) & rec(OK)
    if((this.state.page1.hataraki_kata.length === 0 || !this.state.page1.hataraki_kata) > 0 && this.state.page1.recruitment_tag.length > 0) {
      const hatarakikataOptionsAny = this.props.hatarakikata.filter(el => 
        (Number(this.state.page1.recruitment_tag) !== el.id)
      )
      this.setState({anyOptions: hatarakikataOptionsAny})
    }

    //anyOptions if main(null) & rec(null)
    if((this.state.page1.hataraki_kata.length === 0 || !this.state.page1.hataraki_kata) > 0 && (this.state.page1.recruitment_tag.length === 0 || !this.state.page1.recruitment_tag)) {
      this.setState({anyOptions: this.props.hatarakikata})
    }
  }

  handleShowcase() {
    if(this.state.page1.hataraki_kata && this.state.page1.hataraki_kata.length > 0) {
      const showcaseHatarakikata = this.props.hatarakikata.filter(el => 
        this.state.page1.hataraki_kata.find(h => h === el.id)
      )
      let hatarakikataFormat = showcaseHatarakikata.map((value, key) => {
        return ({hataraki_kata: value})
      })
      this.setState({
        showcaseHatarakikata: hatarakikataFormat,
      })
    } else {
      this.setState({showcaseHatarakikata: this.props.details.hataraki_kata_resource})
    }
  }

  checkHatarakikataAny() {
    if(this.state.page1.other_hataraki_kata.length === 0) {
      this.setState({
        formErrors: {
          ...this.state.formErrors,
          other_hataraki_kata: "Choose at least 1"
        }
      })
    } else {
      this.setState({
        formErrors: {
          ...this.state.formErrors,
          other_hataraki_kata: ""
        }
      })
    }
  }

  handleFile = e => {
    e.preventDefault()
    let reader = new FileReader()
    const file = e.target.files[0]
    const name = e.target.name
    if ( file ) {
      if (this.state.totalImageSize + Number(file.size) > 5000000) {
        if (name === "job_image") {
          this.setState({
            images: {
              ...this.state.images,
              [name]: this.state.userDetails.job_image,
            },
            formErrors: {
              ...this.state.formErrors,
              [name]: "Maximum total size of all images should not exceed 5MB. Adding this will exceed file size limit."
            }
          }, e.target.value = null)
        } else {
          this.setState({
            images: {
              ...this.state.images,
              [name]: this.state.userDetails.galleries[Number(name.charAt(9)) - 1].file_path,
            },
            optionalErrors: {
              ...this.state.optionalErrors,
              ['sub_caption' + name.charAt(9)]: "Maximum total size of all images should not exceed 5MB. Adding this will exceed file size limit."
            }
          }, e.target.value = null)
        }
      } else {
        if (!fileTypes.every(type =>file.type !== type)) {
          if (file.size <= 5000000) {
            reader.onload = (e) => {
              if(name === "job_image") {
                this.setState({
                  images: {
                    ...this.state.images,
                    [name]: e.target.result,
                  },
                  formErrors: {
                    ...this.state.formErrors,
                    [name]: "",
                  },
                })
              } else {
                this.setState({
                  images: {
                    ...this.state.images,
                    [name]: e.target.result,
                  },
                  optionalErrors: {
                    ...this.state.optionalErrors,
                    ['sub_caption' + name.charAt(9)]: "",
                  },
                })
              }
              this.handleImageSize(name, Number(file.size))
            }
            reader.readAsDataURL(e.target.files[0])
          } else {
            if(e.target.name === "job_image") {
              this.setState({
                images: {
                  ...this.state.images,
                  [e.target.name]: "",
                },
                formErrors: {
                  ...this.state.formErrors,
                  [e.target.name]: "File Size Too Large",
                },
              }, e.target.value = null)
            } else {
              this.setState({
                images: {
                  ...this.state.images,
                  [e.target.name]: "",
                },
                optionalErrors: {
                  ...this.state.optionalErrors,
                  ['sub_caption' + String(e.target.name.charAt(9))]: "File Size Too Large",
                },
              }, e.target.value = null)
            }
          }
        } else {
          if(e.target.name === "job_image") {
            this.setState({
              images: {
                ...this.state.images,
                [e.target.name]: "",
              },
              formErrors: {
                ...this.state.formErrors,
                [e.target.name]: "Invalid File Type",
              },
            }, e.target.value = null)
          } else {
            this.setState({
              images: {
                ...this.state.images,
                [e.target.name]: "",
              },
              optionalErrors: {
                ...this.state.optionalErrors,
                ['sub_caption' + String(e.target.name.charAt(9))]: "Invalid File Type",
              },
            }, e.target.value = null)
          }
        }
      }
    }
  }

  handleSubmit = e => {
    e.preventDefault()
    let hataraki_kata = this.state.page1.hataraki_kata.map((value, key) => {
      return ({hataraki_kata_id: value})
    })
    let other_hataraki_kata = this.state.page1.other_hataraki_kata.map((value, key) => {
      return ({hataraki_kata_id: value})
    })
    this.setState({
      page1: {
        ...this.state.page1,
        hataraki_kata: hataraki_kata,
        other_hataraki_kata: other_hataraki_kata,
      }
    }, () => {
      const credentials = {
        ...this.state.page1,
        ...this.state.images,
        ...this.state.optional,
        geolocation: {
          ...this.state.geolocation,
        },
      }
      this.props.pageData(credentials)
    })
  }

  handleImageSize(name, size) {
    this.setState({[name + 'Size']: size}, () => {
      this.setState({
        totalImageSize: this.state.job_imageSize + this.state.sub_image1Size + this.state.sub_image2Size + this.state.sub_image3Size
      })
    })
  }

  clickHatarakikata = e => {
    e.preventDefault()
    this.setState({showHatarakikata: !this.state.showHatarakikata})
  }

  findHatarakikata(option) {
    return this.state.hatarakikata.find(h => h.id === option)
  }

  renderInput = (value) => {
    switch (value.type) {
      case "text_disabled":
        if(!this.state.view) {
          return(
            <Input
              id={value.name}
              placeholder={value.label}
              field={value.name}
              value={value.value}
              onChange={this.handleInputChange}
              error={this.state.formErrors[value.name]}
              className="createJob-disabled"
              value={value.name === "company_id" ? this.state.page1[value.name] : this.state.geolocation[value.name]}
              disabled
            />
          )
        } else {
          return(
            <span className="offer-detail">
              {value.name === "company_id" ? this.state.userDetails.company.company_name : this.state.userDetails.geolocation[value.name]}
            </span>
          )
        }
      case "zip_code":
        if(!this.state.view) {
          return(
            <Input
              field={value.name}
              onChange={this.onZipCodeInput}
              error={this.state.formErrors[value.name]}
              value={this.state.geolocation[value.name]}
              error={this.state.formErrors[value.name]}
            />
          )
        } else {
          return(<span className="offer-detail">{this.state.userDetails.geolocation[value.name]}</span>)
        }
      case "text_area":
        if(!this.state.view) {
          return(
            <InputTextAreaEditing
              id={value.name}
              field={value.name}
              onChange={this.handleInputChange}
              error={this.state.formErrors[value.name]}
              value={this.state.page1[value.name]}
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
              value={this.state.page1[value.name]}
            >
              {(value.options.map((option) => {
                return (
                  <option key={option.id} value={option.id}>
                    {value.name !== "recruitment_tag" ? option.item : localStorage.JobChoiceLanguage === 'JP' ? option.item_jp: option.item_en}
                  </option>)
              }))}
            </InputDropDown>
          )
        } else {
          return(
            <span className="offer-detail">
              {/* {LANG[localStorage.JobChoiceLanguage].EMPLOYMENT_TYPE.find(em => em.value === this.state.userDetails[value.name]).name} */}
              {this.state.userDetails[value.name]}
            </span>
          )
        }
      case "file":
        if(!this.state.view) {
          return(
            <div>
              <InputFile
                id={value.name}
                name={value.name}
                handleChange={this.handleFile}
                error={this.state.formErrors[value.name]}
              />
              <span className="offer-warningSub">If no file chosen, old picture will remain as {value.label}</span>
            </div>
          )
        } else {
          return(
            <div className="offer-imageContainer-main"><img src={this.state.userDetails[value.name]} alt={value.name} className="offer-image"/></div>
          )
        }
      case "file_with_caption":
        if(!this.state.view) {
          return(
            <div>
              <InputFile
                id={value.nameFile}
                name={value.nameFile}
                handleChange={this.handleFile}
                error={this.state.optionalErrors[value.nameCaption]}
              />
              <span className="offer-warningSub">If no file chosen, old picture will remain as {value.label} or if none selected then left as blank</span>
              <Input
                id={value.nameCaption}
                placeholder={value.label}
                field={value.nameCaption}
                onChange={this.handleInputChange}
                value={this.state.optional['sub_caption' + (Number(value.arrayImage)+1)]}
              />
            </div>
          )
        } else {
          if(this.state.userDetails.galleries.length !== 0) {
            if(this.state.userDetails.galleries[value.arrayImage]) {
              return(
                <div className="offer-imageContainer">
                  <div className="offer-image">
                    <img src={this.state.userDetails.galleries[value.arrayImage].file_path} alt={value.name} className="offer-image" /><br />
                  </div>
                  <span>{this.state.userDetails.galleries[value.arrayImage].caption}</span>
                </div>
              )
            } else {
              return(<span className="offer-detail">No sub image selected</span>)
            }
          } else {
            return(<span className="offer-detail">No sub images selected</span>)
          }
        }
      case "number":
        if(!this.state.view) {
          return(
            <>
              <Input
                id={value.name}
                placeholder={value.label}
                field={value.name}
                onChange={this.handleInputChange}
                error={this.state.formErrors[value.name]}
                value={this.state.page1[value.name]}
                inputType="number"
              />
              {value.name === "incentive_per_share" &&
                <span className="createJob-warningSub">Incentives Per Share come from Employment Status. It must not go below initial value.</span>
              }
            </>
          )
        } else {
          return(<span className="offer-detail">{this.state.userDetails[value.name]}</span>)
        }
      case "hatarakikata":
        if(!this.state.view) {
          return(
            <div id={value.name}>
              {this.state.showcaseHatarakikata.length === 0 ? 
                <div className={`createJob-hatarakikata-display ${this.state.formErrors[value.name].length > 0 ? "errorBorder": ""}`}>
                  <span>{LANG[localStorage.JobChoiceLanguage].noHataSelected}</span>
                </div>:
                <div className="container">
                  <div className={`row createJob-hatarakikata-display ${this.state.formErrors[value.name].length > 0 ? "errorBorder": ""}`}>
                    {this.state.showcaseHatarakikata.map((value, key) => {
                      return (
                        <HatarakikataDisplay key={key} resource={value} />
                      )})
                    }
                  </div>
                </div>
              }
              <Button
                className="createJob-hatarakikata-btn"
                onClick={this.clickHatarakikata}
                id="createJob-btnSelect"
              >
                <span>{this.state.showcaseHatarakikata.length === 0 ? LANG[localStorage.JobChoiceLanguage].selectHata : LANG[localStorage.JobChoiceLanguage].reSelectHata }</span>
              </Button>
              {this.state.showHatarakikata === true && 
                <InputHatarakikata 
                  fieldName={value.name}
                  hatarakikata={this.state.mainOptions}
                  show={this.state.showHatarakikata}
                  handleHatarakikata={this.handleInputChange}
                />
              }
              {(this.state.formErrors[value.name] && this.state.formErrors[value.name].length > 0) &&
                <div className="errorMessage">{this.state.formErrors[value.name]}</div>
              }
            </div>
          )
        } else {
          return(
            <div className="container">
              <div className={`row createJob-hatarakikata-display ${this.state.formErrors[value.name].length > 0 ? "errorBorder": ""}`}>
                {this.state.userDetails.hataraki_kata_resource.map((value, key) => {
                  return (
                    <HatarakikataDisplay key={key} resource={value} />
                  )})
                }
              </div>
            </div>
          )
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
                          onChange={e => this.handleInputChange(value.name, option.id)}
                          defaultChecked={this.state.page1.other_hataraki_kata.find(h => h === option.id)}
                        />
                      </label>
                      <label className="offer-labelForMultiple">{localStorage.JobChoiceLanguage === 'JP' ? option.item_jp: option.item_en}</label>
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
                {this.state.userDetails.other_hataraki_kata.map((option, key) => {
                  return(
                    <li key={key}>
                      <label>{localStorage.JobChoiceLanguage === 'JP' ? [this.findHatarakikata(option).item_jp]: [this.findHatarakikata(option).item_en]}</label>
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
              value={value.name === "complete_address" ? this.state.geolocation[value.name] : this.state.page1[value.name]}
            />
          )
        } else {
          return(
            <span className="offer-detail">
              {value.name === "station" || value.name === "complete_address" ? this.state.userDetails.geolocation[value.name] : this.state.userDetails[value.name]}
            </span>
          )
        }
    }
  }

  render() {
    const inputs = [
      {
        name: "title",
        type: "text",
        label: LANG[localStorage.JobChoiceLanguage].jobTitle,
      },
      {
        name: "company_id",
        type: "text_disabled",
        label: LANG[localStorage.JobChoiceLanguage].company,
        value: this.props.company.company_name
      },
      {
        name: "zip_code",
        type: "zip_code",
        label: LANG[localStorage.JobChoiceLanguage].zipCode,
      },
      {
        name: "complete_address",
        type: "text",
        label: LANG[localStorage.JobChoiceLanguage].address,
        value: this.state.geolocation.complete_address
      },
      {
        name: "station",
        type: "text",
        label: LANG[localStorage.JobChoiceLanguage].nearestStation,
      },
      {
        name: "description",
        type: "text_area",
        label: LANG[localStorage.JobChoiceLanguage].jobDescription,
      },
      {
        name: "employment_type",
        type: "dropdown",
        label: LANG[localStorage.JobChoiceLanguage].employmentStatus,
        options: employment_type_options
      },
      {
        name: "incentive_per_share",
        type: "number",
        label: LANG[localStorage.JobChoiceLanguage].incentivePerShare,
      },
      {
        name: "job_image",
        type: "file",
        label: LANG[localStorage.JobChoiceLanguage].thumbnail,
      },
      {
        nameFile: "sub_image1",
        nameCaption: "sub_caption1",
        type: "file_with_caption",
        label: LANG[localStorage.JobChoiceLanguage].mainImage,
        optional: true,
        arrayImage: 0,
      },
      {
        nameFile: "sub_image2",
        nameCaption: "sub_caption2",
        type: "file_with_caption",
        label: LANG[localStorage.JobChoiceLanguage].subImage + '1',
        optional: true,
        arrayImage: 1,
      },
      {
        nameFile: "sub_image3",
        nameCaption: "sub_caption3",
        type: "file_with_caption",
        label: LANG[localStorage.JobChoiceLanguage].subImage + '2',
        optional: true,
        arrayImage: 2,
      },
      {
        name: "hataraki_kata",
        type: "hatarakikata",
        label: LANG[localStorage.JobChoiceLanguage].howToWorkChoice,
      },
      {
        name: "other_hataraki_kata",
        type: "multiple_select",
        label: LANG[localStorage.JobChoiceLanguage].otherTag,
        options: this.state.anyOptions,
      }
    ]

    return (
      <>
        <div className="offer-title">
          <label><span>Job Offer - Recruitment Information</span><span className="createJob-smaller"> (1 / 2)</span></label>
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
            <span>{ LANG[localStorage.JobChoiceLanguage].Next }</span>
          </Button>
          {!this.state.view && 
            <Button
              className="createJob-submitArea-btn"
              id="createJob-submitArea-btn-save"
              onClick={this.handleSubmit}
              disabled={!formValid(this.state) || this.state.images.job_image.length < 1 || this.state.geolocation.complete_address.length < 1}
            >
              <span>{ LANG[localStorage.JobChoiceLanguage].submit }</span>
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

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(authActions, dispatch)
  }
}

export default connect(mapStateToProps)(JobOfferEditor1)
