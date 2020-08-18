import React, { Component } from 'react'
import '../JobOfferDetail.scss'
import { Button } from 'react-bootstrap'
import Input from '../../../../components/input/Input'
import InputFile from '../../../../components/InputFile/InputFile'
import InputDropDown from '../../../../components/inputDropDown/InputDropDown'
import InputTextAreaEditing from '../../../../components/inputTextArea/InputTextAreaEditing'
import InputHatarakikata from '../../createJob/createJobComponents/CreateJobHatarakikataModal'
import HatarakikataDisplay from '../../../../components/hatarakikata/hatarakikataDisplay/HatarakikataDisplay'
import { LANG } from '../../../../constants'
import { connect } from 'react-redux'
import defaultJobImage from '../../../../assets/img/job-avatar.jpg'
import { Image } from "load-image-react"
import { whiteSpaceValidation, imageDateNow } from '../../../../helpers'

const formValid = ({ formErrors, section2 }) => {
  let valid = true

  Object.values(formErrors).forEach(val => {
    val !== null && val.length > 0 && (valid = false)
  })

  Object.values(section2).forEach(val => {
    if(val !== null && val !== undefined && typeof val === 'object'){
      val.length === 0 && (valid = false)
    } else {
      (val === null ||
       ((typeof val === 'string' && val.trim().length === 0) || val.length === 0)
      ) && (valid = false)
    }
  })

  return valid
}

const fileTypes = ['image/png', 'image/jpeg', 'image/gif']

const meansOptions = [
  {
    en: "Walking",
    jp: "徒歩",
    value: "walk",
  },
  {
    en: "Bus",
    jp: "バス",
    value: "bus",
  },
  {
    en: "Train",
    jp: "電車",
    value: "train",
  },
  {
    en: "Car",
    jp: "自動車",
    value: "car",
  },
]

class JobOfferEditorSection2 extends Component {
  constructor(props) {
    super(props)

    this.state = {
      section2: {
        title: '',
        hataraki_kata: [],
        description: '', 
        station1: '',
        transportation1: '',
        time_duration1: '',
      },

      optionalSection2: {
        sub_caption1: '',
        sub_caption2: '',
        sub_caption3: '',
        url_job_video: '',
        station2: '',
        transportation2: '',
        time_duration2: '',
        other_hataraki_kata: [], 
      },

      formErrors: {
        title: '',
        hataraki_kata: '',
        description: '', 
        job_image: '', 
        station1: '',
        transportation1: '',
        time_duration1: '',
        station2: '',
        time_duration2: '',
        sub_caption1: '',
        sub_caption2: '',
        sub_caption3: '',
        url_job_video: '',
      },

      optionalErrors: {
        sub_image1: '',
        sub_image2: '',
        sub_image3: '',
        other_hataraki_kata: '',
      },

      images: {
        job_image: '',
        sub_image1: '',
        sub_image2: '',
        sub_image3: '',
      },

      totalImageSize: 0,
      job_imageSize: 0,
      sub_image1Size: 0,
      sub_image2Size: 0,
      sub_image3Size: 0,
      chosenHatarakikataCategory: 0,
      hatarakikata: null,
      hatarakikata_categories: this.props.hatarakikata_categories,
      showHatarakikata: false,
      showcaseHatarakikata: [],
      mainOptions: this.props.hatarakikata,
      anyOptions: this.props.hatarakikata,
      job_image_name: '',
      sub_image_name1: '',
      sub_image_name2: '',
      sub_image_name3: '',
    }
    
    this.handleFile = this.handleFile.bind(this)
    this.clickHatarakikata = this.clickHatarakikata.bind(this)
    this.handleFormError = this.handleFormError.bind(this)
  }

  componentDidMount() {
    const hataraki_kata_resource = this.props.initialData.hataraki_kata_resource.map((value, key) => {
      return (value.hataraki_kata_id)
    })

    const other_hataraki_kata = this.props.initialData.other_hataraki_kata.map((value, key) => {
      return (value.hataraki_kata_id)
    })

    let category_solo = null

      if(this.props.initialData.other_hataraki_kata.length > 0) {
        category_solo= this.state.hatarakikata_categories.map((category, key) => {
          const is_this_it = category.hataraki_kata.filter(function (cat) {return cat.id === other_hataraki_kata[0]})[0]
          if(is_this_it !== undefined) {
            return (category.id)
          } else {
            return null
          }
        })
      }
      
      const category_id = category_solo !== null ? category_solo.filter(function (cat) {return cat !== null})[0] : 1

    this.setState({
      section2: {
        title: this.props.initialData.title,
        hataraki_kata: hataraki_kata_resource,
        description: this.props.initialData.description, 
        station1: this.props.initialData.nearest_station[0] ? this.props.initialData.nearest_station[0].station : '',
        transportation1: this.props.initialData.nearest_station[0] ? this.props.initialData.nearest_station[0].transportation : '',
        time_duration1: this.props.initialData.nearest_station[0] ? this.props.initialData.nearest_station[0].time_duration : '',
      },

      optionalSection2: {
        sub_caption1: this.props.initialData.galleries.length > 1 && this.props.initialData.galleries[0] ? this.props.initialData.galleries[0].caption : '',
        sub_caption2: this.props.initialData.galleries.length > 1 && this.props.initialData.galleries[1] ? this.props.initialData.galleries[1].caption : '',
        sub_caption3: this.props.initialData.galleries.length > 1 && this.props.initialData.galleries[2] ? this.props.initialData.galleries[2].caption : '',
        url_job_video: this.props.initialData.url_job_video,
        station2: this.props.initialData.nearest_station[1] ? this.props.initialData.nearest_station[1].station : '',
        transportation2: this.props.initialData.nearest_station[1] ? this.props.initialData.nearest_station[1].transportation : '',
        time_duration2: this.props.initialData.nearest_station[1] ? this.props.initialData.nearest_station[1].time_duration : '',
        other_hataraki_kata: other_hataraki_kata, 
      },

      images: {
        job_image: this.props.initialData.job_image === null || this.props.initialData.job_image === "" ? defaultJobImage : imageDateNow(this.props.initialData.job_image),
        sub_image1: this.props.initialData.galleries.length > 0 ? imageDateNow(this.props.initialData.galleries[0].file_path) : defaultJobImage,
        sub_image2: this.props.initialData.galleries.length > 1 ? imageDateNow(this.props.initialData.galleries[1].file_path) : defaultJobImage,
        sub_image3: this.props.initialData.galleries.length > 2 ? imageDateNow(this.props.initialData.galleries[2].file_path) : defaultJobImage,
      },

      chosenHatarakikataCategory: category_id - 1,
    }, () => {
      this.handleShowcase()
      this.props.retrievedData("section2", {...this.state.section2, ...this.state.optionalSection2, ...this.state.images}, formValid(this.state))
      this.props.loadNow('section2')
    })
  }

  changeChosenHatarakikataCategory = (name, value) => {
    this.setState({
      chosenHatarakikataCategory: value
    })
  }

  handleInputChange = (name, value) => {
    let formErrors = { ...this.state.formErrors }

    switch (name) {
      case "station1":
      case "transportation1":
      case "time_duration1":
        this.setState({
          formErrors,
          section2: {
            ...this.state.section2,
            [name]: value,
          }
        }, () => {
          this.props.retrievedData("section2", {...this.state.section2, ...this.state.optionalSection2, ...this.state.images}, formValid(this.state))
        })
        break
      case "sub_caption1":
      case "sub_caption2":
      case "sub_caption3":
      case "url_job_video":
      case "station2":
      case "transportation2":
      case "time_duration2":
        this.setState({
          formErrors,
          optionalSection2: {
            ...this.state.optionalSection2,
            [name]: value,
          }
        }, () => {
          this.props.retrievedData("section2", {...this.state.section2, ...this.state.optionalSection2, ...this.state.images}, formValid(this.state))
        })
        break
      case "other_hataraki_kata":
          if(this.state.optionalSection2.other_hataraki_kata.filter(function (item) {return item === value})[0]) {
            var index = this.state.optionalSection2[name].indexOf(this.state.optionalSection2[name].filter(function (item) {return item === value})[0])
            this.state.optionalSection2[name].splice(index, 1)
            this.checkHatarakikataAny()
          } else {
            this.state.optionalSection2[name].push(value)
            this.checkHatarakikataAny()
          }
          this.props.retrievedData("section2", {...this.state.section2, ...this.state.optionalSection2, ...this.state.images}, formValid(this.state))
          break
      default:
        this.setState({
          formErrors,
          section2: {
            ...this.state.section2,
            [name]: value
          }
        }, () => {
          if(name === "hataraki_kata") {
            this.setState({showHatarakikata: false})
            this.handleShowcase()
          }
          this.props.retrievedData("section2", {...this.state.section2, ...this.state.optionalSection2, ...this.state.images}, formValid(this.state))
        })
        break
    }
  }

  handleShowcase() {
    if(this.state.section2.hataraki_kata && this.state.section2.hataraki_kata.length > 0) {
      const showcaseHatarakikata = this.props.hatarakikata.filter(el => 
        this.state.section2.hataraki_kata.filter(function (h) {return h === el.id})[0]
      )
      let hatarakikataFormat = showcaseHatarakikata.map((value, key) => {
        return ({hataraki_kata: value})
      })
      this.setState({
        showcaseHatarakikata: hatarakikataFormat,
      })
    } else {
      this.setState({showcaseHatarakikata: []})
    }
  }

  checkHatarakikataAny() {
    if(this.state.optionalSection2.other_hataraki_kata.length === 0) {
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

  clickHatarakikata = e => {
    e.preventDefault()
    this.setState({
      showHatarakikata: false
    }, () => {
      this.setState({
        showHatarakikata: true
      })
    })
  }

  handleFile = e => {
    e.preventDefault()
    let reader = new FileReader()
    const file = e.target.files[0]
    const name = e.target.name
    if ( file ) {
      if( this.state.totalImageSize + Number(file.size) > 5000000 ) {
        if(name === "job_image") {
          this.setState({
            images: {
              ...this.state.images,
              [name]: this.props.initialData.job_image === null ? defaultJobImage : this.props.initialData.job_image,
            },
            formErrors: {
              ...this.state.formErrors,
              [name]: "Maximum total size of all images should not exceed 5MB. Adding this will exceed file size limit",
            },
            job_image_name: "",
          }, () => {
            this.props.retrievedData("section2", 
              {
                ...this.state.section2, 
                ...this.state.optionalSection2, 
                ...this.state.images, 
                job_image_name: "",
              }, formValid(this.state))
          })
        } else {
          this.setState({
            images: {
              ...this.state.images,
              [e.target.name]: this.props.initialData.galleries.length > 1 && this.props.initialData.galleries[Number(name.charAt(9)) - 1] ? this.props.initialData.galleries[Number(name.charAt(9)) - 1].file_path : defaultJobImage,
            },
            optionalErrors: {
              ...this.state.optionalErrors,
              ['sub_image' + name.charAt(9)]: "Maximum total size of all images should not exceed 5MB. Adding this will exceed file size limit",
            },
            ['sub_image_name' + name.charAt(9)]: "",
          }, () => {
            this.props.retrievedData("section2", 
            {
              ...this.state.section2, 
              ...this.state.optionalSection2, 
              ...this.state.images, 
              ['sub_image_name' + name.charAt(9)]: ""
            }, formValid(this.state))
          })
        }
      } else {
        if (!fileTypes.every(type =>file.type !== type)) {
          if(file.size <= 5000000) {
            reader.onload = (e) => {
              this.props.handleLoad(true, 0)
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
                  job_image_name: file.name,
                }, () => {
                  this.props.handleLoad(false, 1500)
                  this.props.retrievedData("section2", 
                  {
                    ...this.state.section2, 
                    ...this.state.optionalSection2, 
                    ...this.state.images, 
                    job_image_name: this.state.job_image_name
                  }, formValid(this.state))
                })
              } else {
                this.setState({
                  images: {
                    ...this.state.images,
                    [name]: e.target.result,
                  },
                  optionalErrors: {
                    ...this.state.optionalErrors,
                    ['sub_image' + name.charAt(9)]: "",
                  },
                  ['sub_image_name' + name.charAt(9)]: file.name,
                }, () => {
                  this.props.handleLoad(false, 1500)
                  this.props.retrievedData("section2", 
                  {
                    ...this.state.section2, 
                    ...this.state.optionalSection2, 
                    ...this.state.images, 
                    ['sub_image_name' + name.charAt(9)]: ""
                  }, formValid(this.state))
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
                  [e.target.name]: this.props.initialData.job_image === null ? defaultJobImage : this.props.initialData.job_image,
                },
                formErrors: {
                  ...this.state.formErrors,
                  [e.target.name]: "File Size Too Large",
                },
                job_image_name: "",
              }, () => {
                this.props.retrievedData("section2", 
                  {
                    ...this.state.section2, 
                    ...this.state.optionalSection2, 
                    ...this.state.images, 
                    job_image_name: "",
                  }, formValid(this.state))
              })
            } else {
              this.setState({
                images: {
                  ...this.state.images,
                  [e.target.name]: this.props.initialData.galleries.length > 1 && this.props.initialData.galleries[Number(name.charAt(9)) - 1] ? this.props.initialData.galleries[Number(name.charAt(9)) - 1].file_path : defaultJobImage,
                },
                optionalErrors: {
                  ...this.state.optionalErrors,
                  ['sub_image' + e.target.name.charAt(9)]: "File Size Too Large",
                },
                ['sub_image_name' + name.charAt(9)]: "",
              }, () => {
                this.props.retrievedData("section2", 
                {
                  ...this.state.section2, 
                  ...this.state.optionalSection2, 
                  ...this.state.images, 
                  ['sub_image_name' + name.charAt(9)]: ""
                }, formValid(this.state))
              })
            }
          }
        } else {
          if(e.target.name === "job_image") {
            this.setState({
              images: {
                ...this.state.images,
                [e.target.name]: this.props.initialData.job_image === null ? defaultJobImage : this.props.initialData.job_image,
              },
              formErrors: {
                ...this.state.formErrors,
                [e.target.name]: "Invalid File Type",
              },
              job_image_name: "",
            }, () => {
              this.props.retrievedData("section2", 
                {
                  ...this.state.section2, 
                  ...this.state.optionalSection2, 
                  ...this.state.images, 
                  job_image_name: "",
                }, formValid(this.state))
            })
          } else {
            this.setState({
              images: {
                ...this.state.images,
                [e.target.name]: this.props.initialData.galleries.length > 1 && this.props.initialData.galleries[Number(name.charAt(9)) - 1] ? this.props.initialData.galleries[Number(name.charAt(9)) - 1].file_path : defaultJobImage,
              },
              optionalErrors: {
                ...this.state.optionalErrors,
                ['sub_image' + e.target.name.charAt(9)]: "Invalid File Type",
              },
              ['sub_image_name' + name.charAt(9)]: "",
            }, () => {
              this.props.retrievedData("section2", 
              {
                ...this.state.section2, 
                ...this.state.optionalSection2, 
                ...this.state.images, 
                ['sub_image_name' + name.charAt(9)]: ""
              }, formValid(this.state))
            })
          }
        }
      }
    }
  }

  handleImageSize(name, size) {
    this.setState({[name + 'Size']: size}, () => {
      this.setState({
        totalImageSize: this.state.job_imageSize + this.state.sub_image1Size + this.state.sub_image2Size + this.state.sub_image3Size
      })
    })
  }

  checkLabel(value) {
    if(this.state.optionalSection2.other_hataraki_kata.filter(function (item) {return item === value})[0]) {
      var index = this.state.optionalSection2.other_hataraki_kata.indexOf(this.state.optionalSection2.other_hataraki_kata.filter(function (item) {return item === value})[0])
      this.state.optionalSection2.other_hataraki_kata.splice(index, 1)
      this.checkHatarakikataAny()
    } else {
      this.state.optionalSection2.other_hataraki_kata.push(value)
      this.checkHatarakikataAny()
    }
    this.props.retrievedData("section2", {...this.state.section2, ...this.state.optionalSection2, ...this.state.images}, formValid(this.state))
    const indexer = this.state.hatarakikata_categories[this.state.chosenHatarakikataCategory].hataraki_kata.indexOf(this.state.hatarakikata_categories[this.state.chosenHatarakikataCategory].hataraki_kata.filter(function (hata) {return hata.id === value})[0])
    this.state.hatarakikata_categories[this.state.chosenHatarakikataCategory].hataraki_kata[indexer].isSelected = !this.state.hatarakikata_categories[this.state.chosenHatarakikataCategory].hataraki_kata[indexer].isSelected
  }

  handleFormError(name, value) {
    let formError = ""
    
    switch (name) {
      case "title":
      case "station1":
      case "description":
      case "time_duration1":
        const whiteSpaceValidator = whiteSpaceValidation(value)
        formError = whiteSpaceValidator ? LANG[localStorage.JobChoiceLanguage][whiteSpaceValidator] : ''
        break
      case "job_image":
      case "sub_image1":
      case "sub_image2":
      case "sub_image3":
        switch (name === "job_image" ? this.state.formErrors.job_image : this.state.optionalErrors[name]) {
          case "画像の合計サイズは５MBです。こちらの画像の添付は５MBを超えてしまいます。":
          case "Maximum total size of all images should not exceed 5MB. Adding this will exceed file size limit":
            formError = LANG[localStorage.JobChoiceLanguage].maxFileSizeNotGreater
            break
          case "ファイルのサイズが大き過ぎます。５MB以下でお試しください":
          case "File size too large. Must not exceed 5MB.":
            formError = LANG[localStorage.JobChoiceLanguage].fileSizeTooLarge
            break
          case "無効なファイルタイプです":
          case "Invalid File Type":
            formError = LANG[localStorage.JobChoiceLanguage].invalidFileType
            break
          default:
            break
        }
        break
      default:
        break
    }

    return formError
  }

  render() {
    return (
      <div className="createJob-section-bg">
        <div className="createJob-section-header">
          <span>{LANG[localStorage.JobChoiceLanguage].recruitmentBasicInfo}</span>
        </div>
        <div className="createJob-inputArea">
          <Input
            id="title"
            field="title"
            label={LANG[localStorage.JobChoiceLanguage].jobTitle}
            onChange={this.handleInputChange}
            error={this.handleFormError('title', this.state.section2.title)}
            value={this.state.section2.title}
            maxLength={70}
            className="createJob-input-solo"
            required
          />
        </div>
        <div className="createJob-inputArea createJob-sameline section-break">
          <label htmlFor="job_image">
            {LANG[localStorage.JobChoiceLanguage].thumbnail}
            <span className="optional-badge">
              <small> {LANG[localStorage.JobChoiceLanguage].optional} </small>
            </span>:
          </label>
          <div>
            <Image
              src={this.state.images.job_image}
              alt={LANG[localStorage.JobChoiceLanguage].thumbnail} className="job-offer-detail-image"
              loadOptions={{
                downsamplingRatio: 0.5,
                maxWidth: 200,
                maxHeight: 200,
              }}
            />
            <br/>
            <div className="createJob-file-select">
              <label className="createJob-file-select-button" htmlFor="job_image">{LANG[localStorage.JobChoiceLanguage].chooseFile}</label>
              <span className="createJob-file-select-file">{ this.state.job_image_name !== '' ? this.state.job_image_name : LANG[localStorage.JobChoiceLanguage].noFileChosen }</span>
            </div>
            <InputFile
              id="job_image"
              name="job_image"
              handleChange={this.handleFile}
              error={this.handleFormError('job_image', null)}
              className="createJob-no-show"
            />
            {(this.state.formErrors.job_image && this.state.formErrors.job_image.length > 0) && (
              <><span className="errorMessage editJob-no-padding">{this.handleFormError('job_image', null)}</span><br/></>
            )}
            <span className="job-offer-detail-sub-description">{LANG[localStorage.JobChoiceLanguage].ifNoFileChosen}</span>
          </div>
        </div>
        <div className="createJob-inputArea createJob-sameline section-break">
          <label htmlFor="nearest_station1">
            {LANG[localStorage.JobChoiceLanguage].nearestStation}1
            <span className="required-badge">
              <small> {LANG[localStorage.JobChoiceLanguage].required} </small>
            </span>:
          </label>
          <div id="nearest_station1">
            <Input
              id="station1"
              field="station1"
              onChange={this.handleInputChange}
              error={this.handleFormError('station1', this.state.section2.station1)}
              maxLength={20}
              value={this.state.section2.station1}
            />
            <div className="createJob-inputArea-double">
              <InputDropDown 
              id="transportation1"
              placeholder=" "
              field="transportation1"
              options={meansOptions}
              onChange={this.handleInputChange}
              value={this.state.section2.transportation1}
              >
                {(meansOptions.map((option) => {
                  return (
                    <option key={option.value} value={option.value}>
                      {localStorage.JobChoiceLanguage === "JP" ? option.jp : option.en}
                    </option>)
                }))}
            </InputDropDown>
            <Input
              id="time_duration1"
              field="time_duration1"
              placeholder={LANG[localStorage.JobChoiceLanguage].minutesFromNearestStation}
              onChange={this.handleInputChange}
              error={this.state.formErrors.time_duration1}
              value={this.state.section2.time_duration1}
              maxLength={5}
              pattern="[0-9]*"
            />
            </div>
          </div>
        </div>
        <div className="createJob-inputArea createJob-sameline">
          <label htmlFor="nearest_station2">
            {LANG[localStorage.JobChoiceLanguage].nearestStation}2
            <span className="optional-badge">
              <small> {LANG[localStorage.JobChoiceLanguage].optional} </small>
            </span>:
          </label>
          <div id="nearest_station2">
            <Input
              id="station2"
              field="station2"
              onChange={this.handleInputChange}
              value={this.state.optionalSection2.station2}
              error={this.handleFormError('station2', this.state.optionalSection2.station2)}
              maxLength={20}
            />
            <div className="createJob-inputArea-double">
              <InputDropDown 
              id="transportation2"
              placeholder=" "
              field="transportation2"
              options={meansOptions}
              onChange={this.handleInputChange}
              value={this.state.optionalSection2.transportation2}
              >
                {(meansOptions.map((option) => {
                  return (
                    <option key={option.value} value={option.value}>
                      {localStorage.JobChoiceLanguage === "JP" ? option.jp : option.en}
                    </option>)
                }))}
            </InputDropDown>
            <Input
              id="time_duration2"
              field="time_duration2"
              placeholder={LANG[localStorage.JobChoiceLanguage].minutesFromNearestStation}
              onChange={this.handleInputChange}
              value={this.state.optionalSection2.time_duration2}
              pattern="[0-9]*"
              maxLength={5}
              error={this.handleFormError('time_duration2', this.state.optionalSection2.time_duration2)}
            />
            </div>
          </div>
        </div>
        <div className="createJob-inputArea section-break">
          <InputTextAreaEditing
            id="description"
            field="description"
            label={LANG[localStorage.JobChoiceLanguage].jobDescription}
            onChange={this.handleInputChange}
            error={this.handleFormError('description', this.state.section2.description)}
            value={this.state.section2.description}
            additionalStyle="createJob-input-solo"
            resize={true}
            required
          />
        </div>
        <div className="createJob-inputArea createJob-sameline">
          <label htmlFor="sub1">
            {LANG[localStorage.JobChoiceLanguage].mainImage}
            <span className="optional-badge">
              <small> {LANG[localStorage.JobChoiceLanguage].optional} </small>
            </span>:
          </label>
          <div id="sub1">
            <Image
              src={this.state.images.sub_image1}
              alt={LANG[localStorage.JobChoiceLanguage].thumbnail} className="job-offer-detail-image"
              loadOptions={{
                downsamplingRatio: 0.5,
                maxWidth: 200,
                maxHeight: 200,
              }}
            />
            <br/>
            <div className="createJob-file-select">
              <label className="createJob-file-select-button" htmlFor="sub_image1">{LANG[localStorage.JobChoiceLanguage].chooseFile}</label>
              <span className="createJob-file-select-file">{ this.state.sub_image_name1 !== '' ? this.state.sub_image_name1 : LANG[localStorage.JobChoiceLanguage].noFileChosen }</span>
            </div>
            <InputFile
              id="sub_image1"
              name="sub_image1"
              handleChange={this.handleFile}
              error={this.handleFormError('sub_image1', null)}
              className="createJob-no-show"
            />
            {(this.state.optionalErrors.sub_image1 && this.state.optionalErrors.sub_image1.length > 0) && (
              <><span className="errorMessage editJob-no-padding">{this.handleFormError('sub_image1', null)}</span><br/></>
            )}
            <span className="job-offer-detail-sub-description">{LANG[localStorage.JobChoiceLanguage].ifNoFileChosen}</span>
            <Input
              id="sub_caption1"
              field="sub_caption1"
              placeholder={LANG[localStorage.JobChoiceLanguage].captionForImageAbove}
              value={this.state.optionalSection2.sub_caption1}
              onChange={this.handleInputChange}
              maxLength={20}
              error={this.handleFormError('sub_caption1', this.state.optionalSection2.sub_caption1)}
            />
          </div>
        </div>
        <div className="createJob-inputArea createJob-sameline">
          <label htmlFor="sub2">
            {LANG[localStorage.JobChoiceLanguage].subImage}1
            <span className="optional-badge">
              <small> {LANG[localStorage.JobChoiceLanguage].optional} </small>
            </span>:
          </label>
          <div id="sub2">
            <Image
              src={this.state.images.sub_image2}
              alt={LANG[localStorage.JobChoiceLanguage].thumbnail} className="job-offer-detail-image"
              loadOptions={{
                downsamplingRatio: 0.5,
                maxWidth: 200,
                maxHeight: 200,
              }}
            />
            <br/>
            <div className="createJob-file-select">
              <label className="createJob-file-select-button" htmlFor="sub_image2">{LANG[localStorage.JobChoiceLanguage].chooseFile}</label>
              <span className="createJob-file-select-file">{ this.state.sub_image_name2 !== '' ? this.state.sub_image_name2 : LANG[localStorage.JobChoiceLanguage].noFileChosen }</span>
            </div>
            <InputFile
              id="sub_image2"
              name="sub_image2"
              handleChange={this.handleFile}
              error={this.handleFormError('sub_image2', null)}
              className="createJob-no-show"
            />
            {(this.state.optionalErrors.sub_image2 && this.state.optionalErrors.sub_image2.length > 0) && (
              <><span className="errorMessage editJob-no-padding">{this.handleFormError('sub_image2', null)}</span><br/></>
            )}
            <span className="job-offer-detail-sub-description">{LANG[localStorage.JobChoiceLanguage].ifNoFileChosen}</span>
            <Input
              id="sub_caption2"
              field="sub_caption2"
              placeholder={LANG[localStorage.JobChoiceLanguage].captionForImageAbove}
              value={this.state.optionalSection2.sub_caption2}
              onChange={this.handleInputChange}
              maxLength={20}
              error={this.handleFormError('sub_caption2', this.state.optionalSection2.sub_caption2)}
            />
          </div>
        </div>
        <div className="createJob-inputArea createJob-sameline">
          <label htmlFor="sub3">
            {LANG[localStorage.JobChoiceLanguage].subImage}2
            <span className="optional-badge">
              <small> {LANG[localStorage.JobChoiceLanguage].optional} </small>
            </span>:
          </label>
          <div id="sub3">
            <Image
              src={this.state.images.sub_image3}
              alt={LANG[localStorage.JobChoiceLanguage].thumbnail} className="job-offer-detail-image"
              loadOptions={{
                downsamplingRatio: 0.5,
                maxWidth: 200,
                maxHeight: 200,
              }}
            />
            <br/>
            <div className="createJob-file-select">
              <label className="createJob-file-select-button" htmlFor="sub_image3">{LANG[localStorage.JobChoiceLanguage].chooseFile}</label>
              <span className="createJob-file-select-file">{ this.state.sub_image_name3 !== '' ? this.state.sub_image_name3 : LANG[localStorage.JobChoiceLanguage].noFileChosen }</span>
            </div>
            <InputFile
              id="sub_image3"
              name="sub_image3"
              handleChange={this.handleFile}
              error={this.handleFormError('sub_image3', null)}
              className="createJob-no-show"
            />
            {(this.state.optionalErrors.sub_image3 && this.state.optionalErrors.sub_image3.length > 0) && (
              <><span className="errorMessage editJob-no-padding">{this.handleFormError('sub_image3', null)}</span><br/></>
            )}
            <span className="job-offer-detail-sub-description">{LANG[localStorage.JobChoiceLanguage].ifNoFileChosen}</span>
            <Input
              id="sub_caption3"
              field="sub_caption3"
              placeholder={LANG[localStorage.JobChoiceLanguage].captionForImageAbove}
              value={this.state.optionalSection2.sub_caption3}
              onChange={this.handleInputChange}
              maxLength={20}
              error={this.handleFormError('sub_caption3', this.state.optionalSection2.sub_caption3)}
            />
          </div>
        </div>
        <div className="createJob-inputArea">
          <Input
            id="url_job_video"
            field="url_job_video"
            label={LANG[localStorage.JobChoiceLanguage].jobVideo}
            onChange={this.handleInputChange}
            error={this.handleFormError('url_job_video', this.state.optionalSection2.url_job_video)}
            value={this.state.optionalSection2.url_job_video}
            maxLength={100}
            className="createJob-input-solo"
          />
        </div>
        <div className="createJob-inputArea createJob-sameline">
          <label htmlFor="hataraki_kata_area">
            {LANG[localStorage.JobChoiceLanguage].howToWorkChoice}
            <span className="required-badge">
              <small> {LANG[localStorage.JobChoiceLanguage].required} </small>
            </span>:
          </label>
          <div id="hataraki_kata_area">
            {this.state.showcaseHatarakikata.length === 0 ? 
              <div className={`createJob-hatarakikata-display ${this.state.formErrors.hataraki_kata.length > 0 ? "errorBorder": ""}`}>
                <span>{LANG[localStorage.JobChoiceLanguage].noHataSelected}</span>
              </div>:
              <div className="container">
                <div className={`row createJob-hatarakikata-display ${this.state.formErrors.hataraki_kata.length > 0 ? "errorBorder": ""}`}>
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
              <span>{this.state.showcaseHatarakikata.length === 0 ? LANG[localStorage.JobChoiceLanguage].selectHata : LANG[localStorage.JobChoiceLanguage].reSelectHata}</span>
            </Button>
            {this.state.showHatarakikata === true && 
              <InputHatarakikata 
                fieldName="hataraki_kata"
                hatarakikata_categories={this.state.hatarakikata_categories}
                show={this.state.showHatarakikata}
                handleHatarakikata={this.handleInputChange}
              />
            }
            {(this.state.formErrors.hataraki_kata && this.state.formErrors.hataraki_kata.length > 0) &&
              <div className="errorMessage">{this.handleFormError('hataraki_kata', null)}</div>
            }
          </div>
        </div>
        <div className="createJob-inputArea createJob-sameline">
          <label htmlFor="other_hataraki_kata_area">
            {LANG[localStorage.JobChoiceLanguage].otherTag}
            <span className="optional-badge">
              <small> {LANG[localStorage.JobChoiceLanguage].optional} </small>
            </span>:
          </label>
          <div className="createJob-input-solo-short">
            <InputDropDown 
              id="hatarakikata-categories"
              field="other_hataraki_kata"
              value={this.state.chosenHatarakikataCategory}
              onChange={this.changeChosenHatarakikataCategory}>
                {(this.state.hatarakikata_categories.map((option, key) => {
                  return (
                    <option key={key} value={key}>
                      {
                        localStorage.JobChoiceLanguage === 'US' ? option.item_en : option.item_jp
                      }
                    </option>)
                }))}
            </InputDropDown>
            <div className={`createJob-multipleSelect createJob-input-div-short ${this.state.optionalErrors.other_hataraki_kata.length > 0 ? "errorBorder": ""}`} id="other_hataraki_kata_area">
            {this.state.anyOptions !== null &&
              this.state.hatarakikata_categories[this.state.chosenHatarakikataCategory].hataraki_kata.map(
                (option, key) => {
                  if (this.state.section2.hataraki_kata.filter(function (id) {return id === option.id})[0] === undefined) {
                    return(
                      <span key={option.id}>
                        <label className="createJob-multipleSelect-box">
                          <input
                            name={option.id}
                            type="checkbox"
                            checked={this.state.optionalSection2.other_hataraki_kata.filter(function (other) {return other === option.id})[0]}
                            onChange={e => 
                              {
                                option.isSelected = !option.isSelected
                                this.handleInputChange("other_hataraki_kata", option.id)
                              }
                            }
                          />
                        </label>
                        <label onClick={() => this.checkLabel(option.id)} className="createJob-multipleSelect-box-label">{localStorage.JobChoiceLanguage === 'JP' ? option.item_jp: option.item_en}</label>
                      </span>
                      )
                  }
              })}
            </div>
          </div>
        </div>
        {(this.state.optionalErrors.other_hataraki_kata && this.state.optionalErrors.other_hataraki_kata.length > 0) &&
          <div className="errorMessage">{this.handleFormError('other_hataraki_kata', null)}</div>
        }
      </div>
    )
  }
}

const mapStateToProps = state => {
  return state
}

export default connect(mapStateToProps)(JobOfferEditorSection2)
