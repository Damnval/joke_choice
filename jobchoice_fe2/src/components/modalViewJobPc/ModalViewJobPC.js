import React, { Component } from 'react'
import ReactModal from 'react-modal'
import { Button, ButtonGroup } from 'react-bootstrap'
import './ModalViewJobPC.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { LANG, EM } from '../../constants'
import { connect } from 'react-redux'
import api from '../../utilities/api'
import HatarakikataDisplay from '../hatarakikata/hatarakikataDisplay/HatarakikataDisplay'
import JobQuestionComponent from '../../screens/user/jobDetail/jobQuestionComponent/JobQuestionComponent'
import ReactPlayer from 'react-player'
import NumberFormat from 'react-number-format'

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

class ModalViewJobPC extends Component {
    constructor(props) {
        super(props)
        this.state = {
          show: this.props.show,
          message: this.props.message,
          detail: null,
          jobId: null,
          isLoading: false,
          getData: false,
          currentTab: 0,
          will_apply: false,
          hatarakikata_categories: [],
          category: [],
          shared: false,
          viewMode: null,
          videoPlaybackError: null,
        }
        
        this.handleClose = this.handleClose.bind(this)
        this.handleGetData = this.handleGetData.bind(this)
        this.refs = React.createRef()
    }

    componentDidMount() {
      ReactModal.setAppElement('body')
    }

    handleGetData() {
      api.get('api/job/' + this.state.jobId).then(response => {
        this.setState({
          detail: response.data.results.job,
        })
        api.get('api/hataraki-kata-categories').then(response => {
          this.setState({
            hatarakikata_categories: response.data.results.hataraki_kata_categories,
          })
          api.get('api/job-category').then(response => {
            let job_categories = [...response.data.results.jobs].map(
              (el) => {
                el.job_sub_category.map((el) => {
                  el['isSelected'] = false
                  return el
                })
                return el
              }
            )
            this.setState({ 
              category: job_categories,
              isLoading: false,
            })
          }).catch(error => {
            console.log(error)
            this.setState({ 
              modal: {
                message: LANG[localStorage.JobChoiceLanguage].serverError,
                modal: true,
                modalType: 'error',
                redirect: '/'
              },
              isLoading: false,
            })
          })
        }).catch(error => {
          console.log(error)
          this.setState({ 
            modal: {
              message: LANG[localStorage.JobChoiceLanguage].serverError,
              modal: true,
              modalType: 'error',
              redirect: '/'
            },
            isLoading: false,
          })
        })
      }).catch(error => {
        this.setState({
          modal: {
            message: error,
            modal: true,
            modalType: 'error',
          },
          isLoading: false
        })
      })
    }

    componentWillReceiveProps(newProps){
      if(newProps.show !== this.props.show){
        this.setState({
          show: newProps.show,
          jobId: newProps.jobId,
          viewMode: newProps.viewMode,
          isLoading: true,
        }, () => {
          if(newProps.show === true) {
            this.handleGetData()
            this.props.handleLoading(true)
          }
        })
      }
    }

    handleClose() {
      this.setState({
        show: false,
      }, () => {
        this.props.handleModalView(false)
        this.props.handleLoading(false)
      })
    }

    componentDidUpdate() {
      if (window.requestAnimationFrame) {
        window.requestAnimationFrame(this.sizeDialog)
      } else {
        window.setTimeout(this.sizeDialog, 50)
      }
    }

    sizeDialog = () => {
      if (!this.refs.content) return

      let contentHeight = this.refs.content.getBoundingClientRect().height

      this.setState({
        contentHeight: contentHeight,
      })
    }

    handleVideoPlaybackError() {
      this.setState({
        videoPlaybackError: 'urlChosen'
      })
    }

    tabClick = (id) => {
      this.setState({
        currentTab: id
      })
    }

    toggleApply = e => {
      this.setState({
        will_apply: !this.state.will_apply,
      })
    }

    toggleShare = e => {
      this.setState({
        shared: !this.state.shared,
      })
    }

    render() {
        const padding = 60
        let height = (this.state.contentHeight + padding)
        let heightOffset = height / 2
        let offsetPx = heightOffset + 'px'

        const style = {
          content: {
            border: '0',
            borderRadius: '4px',
            bottom: 'auto',
            left: '50%',
            position: 'fixed',
            right: 'auto',
            top: '54%',
            transform: 'translate(-50%,-' + offsetPx + ')',
            width: this.state.viewMode === 'PC' ? '80%' : '40%',
            background: 'white'
          }
        }

        const tab = this.state.currentTab
        const employment_period = this.state.detail !== null ? EM[localStorage.JobChoiceLanguage].EMPLOYMENT_PERIOD.find(el => el.value === this.state.detail.employment_period): null
        const employment_status = this.state.detail !== null ? EM[localStorage.JobChoiceLanguage].EMPLOYMENT_TYPE.find(el => el.value === this.state.detail.employment_type): null
        
        let days = this.state.detail ? this.state.detail.days : null

        let moment = require('moment')

        const start_time = this.state.detail !== null ? moment(this.state.detail.start_time, "HH:mm:ss").format("HH:ss") : null
        const end_time = this.state.detail !== null ? moment(this.state.detail.end_time, "HH:mm:ss").format("HH:ss") : null

        return (
            <>
              {!this.state.isLoading && this.state.detail !== null && 
                  <ReactModal
                  isOpen={this.state.show}
                  onAfterOpen={this.afterOpenModal}
                  onRequestClose={this.handleClose}
                  className='dialog'
                  style={style}
                  overlayClassName='background-dynamic'
                >
                  <div className='dialog__content modal-view-background-outer' ref='content'>
                    <div className="job-view-close-modal">
                      <span>{this.state.viewMode === 'PC' ? 'PC' : LANG[localStorage.JobChoiceLanguage].SMART}</span>
                      <Button onClick={this.handleClose}><FontAwesomeIcon icon="window-close"/></Button>
                    </div>
                    <div className="modal-view-background">
                      <div className='container-fluid modal-view-approval-background'>
                      <div className="job-detail-top">
                        <div className={`col-md-12 col-xl-8 offset-xl-2 job-detail-row row-1 ${this.state.viewMode === 'SMART' ? 'row-1-smart' : ''}`}>
                          <div className='job-picture-outer'>
                            <div className='job-picture'>
                              {this.state.detail.job_image ? 
                                (this.state.detail.job_image && <img src={this.state.detail.job_image} alt="job"/>) :
                                LANG[localStorage.JobChoiceLanguage].noneChosen 
                              }
                            </div>
                          </div>
                          <div className={`job-detail-right-info ${this.state.viewMode === 'SMART' ? 'job-detail-right-info-smart' : ''}`}>
                            <div className="job-detail">
                              <div className="job-detail-label"><small>{ LANG[localStorage.JobChoiceLanguage].referenceID }</small></div>
                              <div className='job-detail-info main'>{this.state.detail.reference_id}</div>
                            </div>
                            <div className="job-detail">
                              <div className="job-detail-label"><small>{ LANG[localStorage.JobChoiceLanguage].jobTitle }</small></div>
                              <div className='job-detail-info main'>{this.state.detail.title}</div>
                            </div>
                            <div className="job-detail">
                              <div className="job-detail-label"><small>{ LANG[localStorage.JobChoiceLanguage].company }</small></div>
                              <div className='job-detail-info main'>{this.state.detail.company.company_name}</div>
                            </div>
                            <div className="job-detail">
                              <div className="job-detail-label"><small>{ LANG[localStorage.JobChoiceLanguage].salary }</small></div>
                              <div className='job-detail-info main'>
                                <span>
                                    <NumberFormat
                                      value={this.state.detail.salary}
                                      displayType={'text'}
                                      thousandSeparator={true}
                                    />{this.state.detail.salary !== null ? ' 円' : ''}
                                </span>
                                {this.state.detail.salary_max_range && this.state.detail.salary_max_range.length !== 0 ?
                                  <span>～ 
                                    <NumberFormat
                                      value={this.state.detail.salary_max_range}
                                      displayType={'text'}
                                      thousandSeparator={true}
                                    />{this.state.detail.salary_max_range !== null ? ' 円' : ''}
                                  </span>:
                                  ''
                                }
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="job-detail-lower-main">
                        <div className='col-sm-12 col-md-12 col-xl-8 offset-xl-2 job-detail-row row-2'>
                        <div>
                          {this.state.shared && <span>{ LANG[localStorage.JobChoiceLanguage].aModalWillAppear }</span>}
                          <div className="apply-share modal-view-share-buttons">
                            <ButtonGroup >
                              <Button bsStyle="success" className="apply-btn" onClick={this.toggleApply}>
                                { LANG[localStorage.JobChoiceLanguage].apply }
                              </Button>
                            </ButtonGroup>
                            <ButtonGroup>
                              <Button bsStyle="primary" className="button-group share-btn" onClick={this.toggleShare}>
                                { LANG[localStorage.JobChoiceLanguage].shareJob }
                              </Button>
                            </ButtonGroup>
                          </div>

                          {this.state.will_apply &&
                            <div>
                              <JobQuestionComponent
                                job_questions={this.state.detail.job_questions}
                                job_id = {this.state.detail.id}
                                share_job_details= {this.state.share_job_details}
                                handleJobApply={this.handleJobApply}
                                handleRegistrationValidation={this.handleRegistrationValidation}
                                setParent={this.handleState}
                                disabled={true}
                              />
                            </div>
                          }
                        </div>
                        <div className="tablist-form">
                              <div className={`tab-header job-detail-tab-buttons-area ${this.state.viewMode === 'SMART' && 'job-detail-tab-buttons-area-smart'}`}>
                                <div className={`job-detail-tab-btn-outer ${this.state.viewMode === 'SMART' ? 'job-detail-tab-btn-outer-smart' : ''}`}>
                                  <button className={`btn job-detail-tab-btn ${this.state.viewMode === 'SMART' && 'job-detail-tab-btn-smart'} ${tab === 0 ? 'job-detail-tab-btn-active' : 'job-detail-tab-btn-inactive'}`} onClick={() => this.tabClick(0)}>{LANG[localStorage.JobChoiceLanguage].pricePlanEstimate}</button>
                                </div>
                                <div className={`job-detail-tab-btn-outer ${this.state.viewMode === 'SMART' ? 'job-detail-tab-btn-outer-smart' : ''}`}>
                                  <button className={`btn job-detail-tab-btn ${this.state.viewMode === 'SMART' && 'job-detail-tab-btn-smart'} ${tab === 1 ? 'job-detail-tab-btn-active' : 'job-detail-tab-btn-inactive'}`} onClick={() => this.tabClick(1)}>{ LANG[localStorage.JobChoiceLanguage].recruitmentBasicInfo }</button>
                                </div>
                                <div className={`job-detail-tab-btn-outer ${this.state.viewMode === 'SMART' ? 'job-detail-tab-btn-outer-smart' : ''}`}>
                                  <button className={`btn job-detail-tab-btn ${this.state.viewMode === 'SMART' && 'job-detail-tab-btn-smart'} ${tab === 2 ? 'job-detail-tab-btn-active' : 'job-detail-tab-btn-inactive'}`} onClick={() => this.tabClick(2)}>{ LANG[localStorage.JobChoiceLanguage].strength }</button>
                                </div>
                                <div className={`job-detail-tab-btn-outer ${this.state.viewMode === 'SMART' ? 'job-detail-tab-btn-outer-smart' : ''}`}>
                                  <button className={`btn job-detail-tab-btn ${this.state.viewMode === 'SMART' && 'job-detail-tab-btn-smart'} ${tab === 3 ? 'job-detail-tab-btn-active' : 'job-detail-tab-btn-inactive'}`} onClick={() => this.tabClick(3)}>{ LANG[localStorage.JobChoiceLanguage].recruitDetailsInfo }</button>
                                </div>
                              </div>
                              {this.state.currentTab === 0 && 
                                <div className="job-detail-details-area">
                                  <table className={`table-job-detail ${this.state.viewMode === 'SMART' ? 'table-job-detail-smart' : ''}`}>
                                      <tbody>
                                      <tr>
                                        <th><strong>{ LANG[localStorage.JobChoiceLanguage].jobType }:</strong></th>
                                        <td className="detail-value">{employment_period !== undefined ? employment_period.name : LANG[localStorage.JobChoiceLanguage].valueNotSet }</td>
                                      </tr>
                                      <tr>
                                        <th><strong>{ LANG[localStorage.JobChoiceLanguage].employmentForm }:</strong></th>
                                        <td className="detail-value">{employment_status !== undefined ? employment_status.name : LANG[localStorage.JobChoiceLanguage].valueNotSet}</td>
                                      </tr>
                                      <tr>
                                        <th><strong>{ LANG[localStorage.JobChoiceLanguage].zipCode }:</strong></th>
                                        <td className="detail-value">{this.state.detail.geolocation.zip_code ? this.state.detail.geolocation.zip_code : LANG[localStorage.JobChoiceLanguage].valueNotSet}</td>
                                      </tr>
                                      <tr>
                                        <th><strong>{ LANG[localStorage.JobChoiceLanguage].address }:</strong></th>
                                        <td className="detail-value">{this.state.detail.geolocation.complete_address ? this.state.detail.geolocation.complete_address : LANG[localStorage.JobChoiceLanguage].valueNotSet}</td>
                                      </tr>
                                      <tr>
                                        <th><strong>{ LANG[localStorage.JobChoiceLanguage].locationDetails }:</strong></th>
                                        <td className="detail-value">{this.state.detail.location_details ? this.state.detail.location_details : LANG[localStorage.JobChoiceLanguage].valueNotSet}</td>
                                      </tr>
                                      <tr>
                                        <th><strong>{ LANG[localStorage.JobChoiceLanguage].incentivePerShare }:</strong></th>
                                        <td className="detail-value">{this.state.detail.incentive_per_share > 0  ?  
                                          <>
                                            <NumberFormat
                                              value={this.state.detail.incentive_per_share }
                                              displayType={'text'}
                                              thousandSeparator={true}
                                            />
                                            {this.state.detail.incentive_per_share > 0 ? ' 円' : ''} 
                                          </>
                                          :  LANG[localStorage.JobChoiceLanguage].valueNotSet }
                                        </td> 
                                      </tr>
                                      </tbody>
                                    </table>
                                </div>
                              }

                              {this.state.currentTab === 1 && 
                                <div className="job-detail-details-area">
                                  <table className={`table-job-detail ${this.state.viewMode === 'SMART' ? 'table-job-detail-smart' : ''}`}>
                                    <tbody>
                                      <tr>
                                        <th><strong>{ LANG[localStorage.JobChoiceLanguage].nearestStation } 1:</strong></th>
                                        <td className="detail-value">
                                        {this.state.detail.nearest_station.length > 1 && this.state.detail.nearest_station[0]  ? 
                                          <> 
                                            <span>{this.state.detail.nearest_station[0].station ? this.state.detail.nearest_station[0].station : LANG[localStorage.JobChoiceLanguage].valueNotSet }</span><br/>
                                            {this.state.detail.nearest_station[0].time_duration &&
                                            <span>{ localStorage.JobChoiceLanguage === "US" ? 
                                              meansOptions.find(op => op.value === this.state.detail.nearest_station[0].transportation).en : 
                                              meansOptions.find(op => op.value === this.state.detail.nearest_station[0].transportation).jp
                                            } : 
                                            </span>
                                            }
                                            <span>{ this.state.detail.nearest_station[0].time_duration ? this.state.detail.nearest_station[0].time_duration + ' Minutes'  : LANG[localStorage.JobChoiceLanguage].valueNotSet } </span>
                                          </> : 
                                            <span>{LANG[localStorage.JobChoiceLanguage].valueNotSet}</span>
                                          }
                                        </td>
                                      </tr>
                                      <tr>
                                        <th><strong>{ LANG[localStorage.JobChoiceLanguage].nearestStation } 2:</strong></th>
                                        <td className="detail-value">
                                        {this.state.detail.nearest_station.length > 1 && this.state.detail.nearest_station[1]  ?
                                          <>
                                            <span>{this.state.detail.nearest_station[1].station ? this.state.detail.nearest_station[1].station : LANG[localStorage.JobChoiceLanguage].valueNotSet}</span>
                                            {this.state.detail.nearest_station[1].time_duration &&
                                            <span>
                                              {localStorage.JobChoiceLanguage === "US" ? 
                                                meansOptions.find(op => op.value === this.state.detail.nearest_station[1].transportation).en : 
                                                meansOptions.find(op => op.value === this.state.detail.nearest_station[1].transportation).jp
                                              } : 
                                            </span>
                                            }
                                            <span>{this.state.detail.nearest_station[1].time_duration ? this.state.detail.nearest_station[1].time_duration + ' Minutes' : LANG[localStorage.JobChoiceLanguage].valueNotSet  }</span>
                                          </>:
                                          <span>{LANG[localStorage.JobChoiceLanguage].valueNotSet}</span>
                                        }
                                        </td>
                                      </tr>
                                      <tr>
                                        <th><strong>{ LANG[localStorage.JobChoiceLanguage].jobDescription }:</strong></th>
                                        <td className="detail-value">{this.state.detail.description ? this.state.detail.description : LANG[localStorage.JobChoiceLanguage].valueNotSet }</td>
                                      </tr>
                                      {this.state.detail.galleries.length > 0 && this.state.detail.galleries[0] ?
                                        <tr>
                                          <td className="detail-value" colSpan="2">
                                            <div className={`job-detail-details-gallery-container ${this.state.viewMode === 'SMART' ? 'modal-job-details-gallery-container' : ''}`}>
                                              {this.state.detail.galleries.length > 0 && this.state.detail.galleries[0] ?
                                                <div>
                                                  <img src={this.state.detail.galleries[0].file_path ? this.state.detail.galleries[0].file_path : ''} alt={LANG[localStorage.JobChoiceLanguage].mainImage} className="job-offer-detail-image"/><br/>
                                                  <span>{this.state.detail.galleries[0].caption ? this.state.detail.galleries[0].caption : LANG[localStorage.JobChoiceLanguage].valueNotSet }</span>
                                                </div>:
                                                <span></span>
                                              }
                                            </div>
                                            <div className={`job-detail-details-gallery-container ${this.state.viewMode === 'SMART' ? 'modal-job-details-gallery-container' : ''}`}>
                                              {this.state.detail.galleries.length > 1 && this.state.detail.galleries[1] ?
                                                <div>
                                                  <img src={this.state.detail.galleries[1].file_path} alt={LANG[localStorage.JobChoiceLanguage].mainImage} className="job-offer-detail-image"/><br/>
                                                  <span>{this.state.detail.galleries[1].caption ? this.state.detail.galleries[1].caption : LANG[localStorage.JobChoiceLanguage].valueNotSet }</span>
                                                </div>:
                                                <span></span>
                                              }
                                            </div>
                                            <div className={`job-detail-details-gallery-container ${this.state.viewMode === 'SMART' ? 'modal-job-details-gallery-container' : ''}`}>
                                            {this.state.detail.galleries.length > 2 && this.state.detail.galleries[2] ?
                                              <div>
                                                <img src={this.state.detail.galleries[2].file_path ? this.state.detail.galleries[2].file_path : ''} alt={LANG[localStorage.JobChoiceLanguage].mainImage} className="job-offer-detail-image"/><br/>
                                                <span>{this.state.detail.galleries[2].caption ? this.state.detail.galleries[2].caption : LANG[localStorage.JobChoiceLanguage].valueNotSet }</span>
                                              </div>:
                                              <span></span>
                                            }
                                            </div>
                                          </td>
                                        </tr>:
                                        <span></span>
                                      }
                                      <tr>
                                        <th><strong>{ LANG[localStorage.JobChoiceLanguage].jobVideo }:</strong></th>
                                        <td className="detail-value">
                                        {this.state.detail.url_job_video !== null ?
                                          <div className={`${this.state.detail.url_job_video ? "player-container-border" : '' } ${this.state.viewMode === 'SMART' ? 'modal-job-details-gallery-container' : ''}`}>
                                            {this.state.videoPlaybackError !== null ?
                                              <span className="job-offer-detail-image-sub-caption">{LANG[localStorage.JobChoiceLanguage][this.state.videoPlaybackError]}</span>:
                                              <div class={this.state.detail.url_job_video ? "player-wrapper-job-details" : ''}>
                                                {this.state.detail.url_job_video !== null ? 
                                                <ReactPlayer
                                                  url={this.state.detail.url_job_video}
                                                  className="player-job-details"
                                                  onError={() => this.handleVideoPlaybackError()}
                                                  width='100%'
                                                  height='100%'
                                                /> : LANG[localStorage.JobChoiceLanguage].valueNotSet }
                                              </div>
                                            }
                                          </div>:
                                          <span>{LANG[localStorage.JobChoiceLanguage].valueNotSet}</span>
                                        }
                                        </td>
                                      </tr>
                                      <tr>
                                        <th><strong>{ LANG[localStorage.JobChoiceLanguage].howToWorkChoice }:</strong></th>
                                        <td className="detail-value">
                                        {this.state.detail.hataraki_kata_resource.length === 0 ? 
                                          <div className={`${this.state.detail.hataraki_kata_resource.length !== 0 ? "createJob-hatarakikata-display" : ''}`}>
                                            {LANG[localStorage.JobChoiceLanguage].valueNotSet}
                                          </div>:
                                          <div className="container">
                                            <div className="row createJob-hatarakikata-display">
                                              {this.state.detail.hataraki_kata_resource.map((value, key) => {
                                                  return (
                                                    <HatarakikataDisplay key={key} resource={value} />
                                                  )})
                                              }
                                            </div>
                                          </div>
                                        }
                                        </td>
                                      </tr>
                                      <tr>
                                        <th><strong>{ LANG[localStorage.JobChoiceLanguage].otherTag }:</strong></th>
                                        <td className="detail-value">
                                        <span>
                                          {this.state.detail.other_hataraki_kata.length === 0 ?
                                            <span>{LANG[localStorage.JobChoiceLanguage].valueNotSet} </span> :
                                            <div>
                                              {this.state.detail.other_hataraki_kata.map((option, key) => {
                                                return (<div className="other-tag-container" key={key}>
                                                  {localStorage.JobChoiceLanguage === "US" ? option.hataraki_kata.item_en : option.hataraki_kata.item_jp}
                                                </div>)
                                              })}
                                            </div>
                                          }
                                        </span>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              }

                              {this.state.currentTab === 2 && 
                                <div className="job-detail-details-area">
                                  <table className={`table-job-detail ${this.state.viewMode === 'SMART' ? 'table-job-detail-smart' : ''}`}>
                                      <tbody>
                                      {this.state.detail.job_strengths.length > 0 ?
                                        this.state.detail.job_strengths.map((strength, key) => {
                                          return (
                                            <>
                                              <tr>
                                                <th><strong>{LANG[localStorage.JobChoiceLanguage].header} {key + 1} :</strong></th>
                                                <td className="detail-value">{strength.item}</td>
                                              </tr>
                                              <tr>
                                                <th><strong>{LANG[localStorage.JobChoiceLanguage].createJobMessage} {key + 1} :</strong></th>
                                                <td className="detail-value">{strength.description}</td>
                                              </tr>
                                            </>
                                          )
                                        }) :
                                        <tr>
                                          <span>{LANG[localStorage.JobChoiceLanguage].valueNotSet}</span>
                                        </tr>
                                      }
                                      </tbody>
                                    </table>
                                </div>
                              }

                              {this.state.currentTab === 3 && 
                                <div className="job-detail-details-area">
                                  <table className={`table-job-detail ${this.state.viewMode === 'SMART' ? 'table-job-detail-smart' : ''}`}>
                                      <tbody>
                                      <tr>
                                        <th><strong>{ LANG[localStorage.JobChoiceLanguage].recruitDetailsInfo }:</strong></th>
                                        <td className="detail-value">{this.state.detail.qualifications ? this.state.detail.qualifications : LANG[localStorage.JobChoiceLanguage].valueNotSet }</td>
                                      </tr>
                                      <tr>
                                        <th><strong>{ LANG[localStorage.JobChoiceLanguage].jobCategory }:</strong></th>
                                        <td className="detail-value">
                                          <span>{this.state.detail.job_job_sub_categories.length > 1 ? this.state.category.find(cat => cat.id === this.state.detail.job_job_sub_categories[0].job_sub_category.job_category_id).category : LANG[localStorage.JobChoiceLanguage].valueNotSet }</span><br/>
                                          {this.state.detail.job_job_sub_categories.length > 1 &&
                                            <ul>
                                              {this.state.detail.job_job_sub_categories.map((sub_category, key) => {
                                                return (<li key={key}>{sub_category.job_sub_category.description}</li>)
                                              })}
                                            </ul>
                                          }
                                        </td>
                                      </tr>
                                      <tr>
                                        <th><strong>{ LANG[localStorage.JobChoiceLanguage].plannedHires }:</strong></th>
                                        <td className="detail-value">{this.state.detail.planned_hire > 0 ? this.state.detail.planned_hire : LANG[localStorage.JobChoiceLanguage].valueNotSet}</td>
                                      </tr>
                                      <tr>
                                        <th><strong>{ LANG[localStorage.JobChoiceLanguage].benefits }:</strong></th>
                                        <td className="detail-value">{this.state.detail.benefits ? this.state.detail.benefits : LANG[localStorage.JobChoiceLanguage].valueNotSet }</td>
                                      </tr>
                                      <tr>
                                        <th><strong>{ LANG[localStorage.JobChoiceLanguage].weekWorkDays }:</strong></th>
                                        <td className="detail-value">
                                        {this.state.detail.no_days_week > 0 ?
                                           <span>{LANG[localStorage.JobChoiceLanguage].moreThan}{this.state.detail.no_days_week}{LANG[localStorage.JobChoiceLanguage].Days} </span> 
                                           : LANG[localStorage.JobChoiceLanguage].valueNotSet 
                                        }
                                        {this.state.detail.no_days_week_max_range && this.state.detail.no_days_week_max_range.length !== 0 ?
                                          <span>～{LANG[localStorage.JobChoiceLanguage].withIn}{this.state.detail.no_days_week_max_range > 0 ?  this.state.detail.no_days_week_max_range : LANG[localStorage.JobChoiceLanguage].valueNotSet  }{LANG[localStorage.JobChoiceLanguage].Days}</span> :
                                          ''
                                        }
                                        </td>
                                      </tr>
                                      <tr>
                                        <th><strong>{ LANG[localStorage.JobChoiceLanguage].workDaysAvailable }:</strong></th>
                                        {days.length > 0 ?
                                          <td className="detail-value">
                                             {days.map((value, key)=>{
                                                return (
                                                  <div className="days working-days-container" key={key}>
                                                    <div key={key}>
                                                    { EM[localStorage.JobChoiceLanguage].WEEKDAYS.filter(function(day) {return day.id === value.day ? day : null })[0].item }
                                                    { (key+1 !== days.length) }
                                                  </div>
                                                  </div>
                                                )
                                              })}
                                          </td>
                                          :
                                          <td className="detail-value">{LANG[localStorage.JobChoiceLanguage].valueNotSet}</td>
                                        }
                                      </tr>
                                      <tr>
                                        <th><strong>{ LANG[localStorage.JobChoiceLanguage].workingHours }:</strong></th>
                                        {start_time !== "00:00" && end_time !== "00:00"  ?
                                          <td className="detail-value">{start_time} - {end_time}</td> :
                                          <td className="detail-value">{LANG[localStorage.JobChoiceLanguage].valueNotSet}</td>
                                        }
                                      </tr>
                                      <tr>
                                        <th><strong>{ LANG[localStorage.JobChoiceLanguage].welfare }:</strong></th>
                                        <td className="detail-value">
                                        {this.state.detail.job_welfares.length === 0 ?
                                          <span>{LANG[localStorage.JobChoiceLanguage].valueNotSet}</span>:
                                          <div>
                                            <ul>
                                              {this.state.detail.job_welfares.map((welfare, key) => {
                                                return (
                                                  <li key={key}>
                                                    {localStorage.JobChoiceLanguage === "US" ? welfareOptions.find(wel => wel.id === welfare.name).item_en : welfareOptions.find(wel => wel.id === welfare.name).item_jp}
                                                  </li>
                                                )
                                              })}
                                            </ul>
                                          </div>
                                        }
                                        </td>
                                      </tr>
                                      <tr>
                                        <th><strong>{ LANG[localStorage.JobChoiceLanguage].working_period }:</strong></th>
                                        <td className="detail-value">{this.state.detail.welfare_working_period ? this.state.detail.welfare_working_period : LANG[localStorage.JobChoiceLanguage].valueNotSet}</td>
                                      </tr>
                                      <tr>
                                        <th><strong>{ LANG[localStorage.JobChoiceLanguage].working_period_remarks }:</strong></th>
                                        <td className="detail-value">{this.state.detail.working_condition ? this.state.detail.working_condition : LANG[localStorage.JobChoiceLanguage].valueNotSet }</td>
                                      </tr>
                                      {this.state.detail.job_reasons_to_hire && this.state.detail.job_reasons_to_hire.length > 0 ?
                                      <>
                                        {this.state.detail.job_reasons_to_hire.map((reason, key) => {
                                          return(
                                            <tr key={key}>
                                              <th><strong>{ LANG[localStorage.JobChoiceLanguage].working_period_remarks } {key+1} :</strong></th>
                                              <td className="detail-value">{reason.reason}</td>
                                            </tr>
                                          )
                                        })}
                                      </>:
                                      <tr>
                                        <th><strong>{ LANG[localStorage.JobChoiceLanguage].reason_to_hire } :</strong></th>
                                        <td className="detail-value">{LANG[localStorage.JobChoiceLanguage].valueNotSet}</td>
                                      </tr>
                                      }
                                      </tbody>
                                    </table>
                                </div>
                              }
                            </div>
                        </div>
                      </div>
                      </div>
                    </div>
                  </div>
                </ReactModal>
              }
            </>
        )
    }

}

  const mapStateToProps = state => {
    return state
  }

export default connect(mapStateToProps)(ModalViewJobPC)
