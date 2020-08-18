import React from 'react'
import './JobOfferDetail.scss'
import JobChoiceLayout from '../../../layouts/jobChoiceLayout/JobChoiceLayout'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import api from '../../../utilities/api'
import { connect } from 'react-redux'
import { Button } from 'react-bootstrap'
import Modal from '../../../components/modal/Modal'
import LoadingIcon from '../../../components/loading/Loading'
import ClientDashboardSidebar from '../clientDashboard/clientDashboardComponents/ClientDashboardSidebar'
import {Breadcrumb} from 'react-bootstrap'
import { LANG } from '../../../constants'
import JobOfferViewDetails from '../../../components/jobOfferViewDetails/JobOfferViewDetails'
import JobOfferEditorSection1 from './jobOfferDetailComponents/JobOfferEditorSection1'
import JobOfferEditorSection2 from './jobOfferDetailComponents/JobOfferEditorSection2'
import JobOfferEditorSection3 from './jobOfferDetailComponents/JobOfferEditorSection3'
import JobOfferEditorSection4 from './jobOfferDetailComponents/JobOfferEditorSection4'
import JobOfferEditorSection5 from './jobOfferDetailComponents/JobOfferEditorSection5'
import JobOfferEditorSection6 from './jobOfferDetailComponents/JobOfferEditorSection6'
import JobOfferEditorSection8 from './jobOfferDetailComponents/JobOfferEditorSection8'
import { omit } from 'lodash'

class JobOfferDetail extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      jobDetails: [],
      isLoading: true,
      isLoadingImg: true,
      hatarakikata: [],
      hatarakikata_categories: [],
      latestImage: Date.now(),
      category: [],
      userData: null,
      isEditing: false,
      modal: {
        messageKey: null,
        message: '',
        modal: false,
        modalType: '',
        redirect: null,
      },
      validity: {
        section1: true,
        section2: true,
        section3: true,
        section4: true,
        section5: true,
        section6: true,
        // section7: true,
        section8: true,
      },
      loadNow: {
        section2: false,
        section3: false,
        section4: false,
        section5: false,
        section6: false,
        // section7: false,
        section8: false,
      },
      isValid: false,
      alreadySubmitted: false,
      times: {
        start_time: '',
        end_time: '',
      }
    }

    this.handleData = this.handleData.bind(this)
    this.handleLoadNow = this.handleLoadNow.bind(this)
    this.handleLoad = this.handleLoad.bind(this)
    this.handleParentClose = this.handleParentClose.bind(this)
  }

  componentDidMount() {
    const id = this.props.match.params.id
    const jobView = {
      model: 'Job', 
      id: id
    }

    api.post('api/analytic', jobView).catch(error => {
      this.setState({
        modal: {
          messageKey: 'serverError',
          modal: true,
          modalType: 'error',
        },
      })
    })
    
    api.get('api/job/' + id).then(response => {
      this.setState({
        jobDetails: response.data.results.job,
      })
      api.get('api/hataraki-kata').then(response => {
        this.setState({
          hatarakikata: response.data.results.hataraki_kata,
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
          })
          api.get('api/hataraki-kata-categories').then(response => {
            this.setState({
              hatarakikata_categories: response.data.results.hataraki_kata_categories,
              isLoading: false,
            }, () => {
              setTimeout(() => this.setState({ isLoadingImg: false }), 1500)
            })
          }).catch(error => {
            console.log(error)
            this.setState({ 
              modal: {
                messageKey: 'serverError',
                message: LANG[localStorage.JobChoiceLanguage].serverError,
                modal: true,
                modalType: 'error',
                redirect: '/home'
              },
              isLoading: false,
            })
          })
        }).catch(error => {
          console.log(error)
          this.setState({ 
            modal: {
              messageKey: 'serverError',
              message: LANG[localStorage.JobChoiceLanguage].serverError,
              modal: true,
              modalType: 'error',
              redirect: '/home'
            },
            isLoading: false,
          })
        })
      }).catch(error => {
        console.log(error)
        this.setState({
          modal: {
            messageKey: 'serverError',
            message: LANG[localStorage.JobChoiceLanguage].serverError,
            modal: false,
            modalType: 'error',
            redirect: '/home',
          },
        })
      })
    }).catch(error => {
      console.log(error)
      this.setState({
        modal: {
          messageKey: 'serverError',
          message: LANG[localStorage.JobChoiceLanguage].serverError,
          modal: false,
          modalType: 'error',
          redirect: '/home',
        },
      })
    })
  }

  handleData(name, data, validity) {
    
    if (name === "section1" && data.incentive_per_share !== null && data.incentive_per_share.length > 0) {
      const new_incentive_per_share = parseFloat(String(data.incentive_per_share).replace(/,/g, ''))
      data.incentive_per_share = new_incentive_per_share
    }

    if (name === "section1" && data.price !== null && data.price.length > 0) {
      const new_price = parseFloat(String(data.price).replace(/,/g, ''))
      data.price = new_price
    }

    if(name === "section2" && data.hataraki_kata.length > 0) {
      let hataraki_kata = data.hataraki_kata.map((value, key) => {
        return ({hataraki_kata_id: value})
      })
      data.hataraki_kata = hataraki_kata
    }

    if(name === "section2" && data.other_hataraki_kata.length > 0) {
      let other_hataraki_kata = data.other_hataraki_kata.map((value, key) => {
        return ({hataraki_kata_id: value})
      })
      data.other_hataraki_kata = other_hataraki_kata
    }
    
    if(name === "section2") {
      if(data.station2.length === 0 && data.transportation2.length === 0 && data.time_duration2.length === 0 ) {
        var nearest_stations = {
          ...data,
          nearest_stations: [
            {
              station: data.station1,
              transportation: data.transportation1,
              time_duration: data.time_duration1,
            },
          ]
        }
      } else {
        var nearest_stations = {
          ...data,
          nearest_stations: [
            {
              station: data.station1,
              transportation: data.transportation1,
              time_duration: data.time_duration1,
            },
            {
              station: data.station2,
              transportation: data.transportation2,
              time_duration: data.time_duration2,
            },
          ]
        }
      }

      var finalData1 = omit(nearest_stations, ['station1', 'station2', 'transportation1', 'transportation2', 'time_duration1', 'time_duration2'])
      data = finalData1
    }

    if(name === "section3") {
      let idDeletable = null
      data.job_strengths.map((value, key) => {
        idDeletable = value.description.length === 0 && value.item.length === 0 ? value.id : null
        
        if(idDeletable !== null) {
          data.job_strengths = data.job_strengths.filter(strength => strength.id !== idDeletable)
        }
      })
    }

    if(name === "section4" && data.job_sub_categories.length > 0) {
      let job_sub_categories = data.job_sub_categories.map((value, key) => {
        return ({job_sub_category_id: value})
      })
      data.job_sub_categories = job_sub_categories
    }

    if(name === "section4" && data.days.length === 0) {
      delete data.days
    }

    if(name === "section4" && data.salary !== null && data.salary.length > 0) {
      const salary = parseFloat(String(data.salary).replace(/,/g, ''))
      data.salary = salary
    }

    if(name === "section4" && data.salary_max_range !== null && data.salary_max_range.length > 0) {
      const salary_max_range = parseFloat(String(data.salary_max_range).replace(/,/g, ''))
      data.salary_max_range = salary_max_range
    }

    if(name === "section4" && data.start_time !== null && data.start_time !== '') {
      data.start_time = data.start_time.getHours() + ":" + data.start_time.getMinutes() + ':' + data.start_time.getSeconds()
      this.setState({
        times: {
          ...this.state.times,
          start_time: data.start_time,
        }
      }, () => {
        this.setState({
          userData: {
            ...this.state.userData,
            ...data,
          },
        })
      })
    }

    if(name === "section4" && data.end_time !== null && data.end_time !== '') {
      data.end_time = data.end_time.getHours() + ":" + data.end_time.getMinutes() + ':' + data.end_time.getSeconds()
      this.setState({
        times: {
          ...this.state.times,
          end_time: data.end_time,
        }
      }, () => {
        
        this.setState({
          userData: {
            ...this.state.userData,
            ...data,
          },
        })
      })
    }

    if(name === "section5" && data.job_questions.length > 0) {
      let job_questions = []
      job_questions = data.job_questions.map((question, key) => {
        if(question.answer_type !== "free_text" && question.answer_type !== null && question.answer_type.length > 0) {
          let answersNew = []
          question.answers.map((answer, key) => {
            if(answer.field !== null && answer.field.length > 0) {
              answersNew.push(answer.field)
            }
          })
          return ({
            question: question.question,
            answer_type: question.answer_type,
            required_answer: question.required_answer,
            answers: answersNew
          })
        } else {
          return ({
            question: question.question,
            answer_type: question.answer_type,
            required_answer: question.required_answer,
          })
        }
      })

      data.job_questions = job_questions
    }

    if(name === "section8") {

      const publication = {
        publication: {
          ...data
        }
      }

      const published_comment = data.published_comment
      data = {...publication, published_comment: published_comment}
      delete data.publication.published_comment
    }

    this.setState({
      userData: {
        ...this.state.userData,
        ...data
      },
      validity: {
        ...this.state.validity,
        [name]: validity,
      },
    }, () => {
      let validityFinal = true
      Object.values(this.state.validity).forEach(val => {
        if(val === false) {
          validityFinal = false
        }
      })
      this.setState({isValid: validityFinal})
      
      if(this.state.userData.nearest_stations) {
        let nearestStation1Empty = true
        let nearestStation2Empty = true
        Object.values(this.state.userData.nearest_stations[0]).forEach(val => {
          if(val !== null && val.length > 0) {
            nearestStation1Empty = false
          }
        })
        if(this.state.userData.nearest_stations[1]) {
          Object.values(this.state.userData.nearest_stations[1]).forEach(val => {
            if(val !== null && val.length > 0) {
              nearestStation2Empty = false
            }
          })
        }

        if(nearestStation1Empty && nearestStation2Empty) {
          delete this.state.userData.nearest_stations
        } else if(!nearestStation1Empty && nearestStation2Empty) {
          const nearest_stations = [
            {
              station: this.state.userData.nearest_stations[0].station,
              transportation: this.state.userData.nearest_stations[0].transportation,
              time_duration: this.state.userData.nearest_stations[0].time_duration,
            }
          ]
          this.setState({
            userData: {
              ...this.state.userData,
              nearest_stations: nearest_stations,
            }
          })
        } else if(nearestStation1Empty && !nearestStation2Empty) {
          const nearest_stations = [
            {
              station: '',
              transportation: '',
              time_duration: '',
            },
            {
              station: this.state.userData.nearest_stations[1].station,
              transportation: this.state.userData.nearest_stations[1].transportation,
              time_duration: this.state.userData.nearest_stations[1].time_duration,
            }
          ]
          this.setState({
            userData: {
              ...this.state.userData,
              nearest_stations: nearest_stations,
            }
          })
        }
      }
    })
  }

  handleShow() {
    this.setState({
      showPage1: !this.state.showPage1,
      showPage2: !this.state.showPage2,
    })
  }

  handleEdit() {
    this.setState({
      isEditing: !this.state.isEditing,
    })
  }

  handleLoadNow(name) {
    switch (name) {
      case "section1":
        this.setState({loadNow: {...this.state.loadNow, section2: true}})
      break
      case "section2":
        this.setState({loadNow: {...this.state.loadNow, section3: true}})
      break
      case "section3":
        this.setState({loadNow: {...this.state.loadNow, section4: true}})
      break
      case "section4":
        this.setState({loadNow: {...this.state.loadNow, section5: true}})
      break
      case "section5":
        this.setState({loadNow: {...this.state.loadNow, section6: true}})
      break
      case "section6":
        this.setState({loadNow: {...this.state.loadNow, section8: true}})
      break
      default:
        break
    }
  }

  setAsPost() {
    this.setState({
      userData: {
        ...this.state.userData,
        publication: {
          ...this.state.userData.publication,
          draft: 0,
        }
      }
    }, () => {
      this.handleSubmit()
    })
  }

  setAsDraft() {
    this.setState({
      userData: {
        ...this.state.userData,
        publication: {
          ...this.state.userData.publication,
          draft: 1,
        }
      }
    }, () => {
      this.handleSubmit()
    })
  }

  handleSubmit() {
    this.setState({
      isLoading: true,
      userData: {
        ...this.state.userData,
        company_id: this.props.user.data.company.id,
        features: 'NOT IMPLEMENTED YET',
        approval_status: this.state.jobDetails.approval_status,
      },
      modal: {
        messageKey: null,
        message: '',
        modal: false,
        modalType: '',
        redirect: null,
      },
    }, () => {
      api.patch('api/job/' + this.props.match.params.id, this.state.userData).then(response => {
        this.setState({ 
          modal: {
            messageKey: this.state.userData.publication.draft === 0 ? 'jobSuccessfullySaved' : 'draftSuccessfullySaved',
            modal: true,
            modalType: 'success',
            redirect: '/home'
          },
          isLoading: false,
          alreadySubmitted: true,
        })
      }).catch(error => {
        console.log(error)
        this.setState({ 
          modal: {
            messageKey: "serverError",
            message: LANG[localStorage.JobChoiceLanguage].serverError,
            modal: true,
            modalType: 'error',
            redirect: '/home'
          },
          isLoading: false,
        })
      })
    })
  }

  handleInDevelopment = () => {
    this.setState({
      modal: {
        messageKey: null,
        message: "",
        modal: false,
        modalType: '',
      }
    }, () => {
      this.setState({
        modal: {
          messageKey: "thisIsStillInDev",
          message: LANG[localStorage.JobChoiceLanguage].thisIsStillInDev,
          modal: true,
          modalType: 'error',
        }
      })
    })
  }

  handleParentClose() {
    this.setState({
      modal: {
        messageKey: null,
        message: "",
        modal: false,
        modalType: '',
      }
    })
  }

  handleLoad = (state, time) => {
    setTimeout(() => this.setState({ isLoadingImg: state }), time)
  }

  render() {
    return (
      <JobChoiceLayout>
        <div className="job-offer-detail-background">
          <ClientDashboardSidebar />
            <div className="job-offer-detail-background-right">
              <Breadcrumb>
                <Breadcrumb.Item href="/home">{ LANG[localStorage.JobChoiceLanguage].dashboard }</Breadcrumb.Item>/
                <Breadcrumb.Item active>{ LANG[localStorage.JobChoiceLanguage].jobDetails }</Breadcrumb.Item>
              </Breadcrumb>
              {(this.state.jobDetails.length !== 0 && !this.state.isEditing && !this.state.isLoading) &&
                <>
                  <JobOfferViewDetails 
                    job={this.state.jobDetails}
                    category={this.state.category}
                    hatarakikata_categories={this.state.hatarakikata_categories}
                  />
                  <div className="job-offer-detail-footer">
                    <Button onClick={()=>this.handleInDevelopment()} id="job-offer-close-button"><span>{LANG[localStorage.JobChoiceLanguage].closeJob} </span><FontAwesomeIcon icon='window-close' /></Button>
                    <Button onClick={()=>this.handleEdit()} id="job-offer-edit-button"><span>{LANG[localStorage.JobChoiceLanguage].editJobDetails} </span><FontAwesomeIcon icon='edit' /></Button>
                  </div>
                </>
              }

              {(this.state.jobDetails.length !== 0 && this.state.isEditing && !this.state.isLoading) &&
                <>
                  <JobOfferEditorSection1
                    company={this.props.user.data.company}
                    retrievedData={this.handleData}
                    initialData={this.state.jobDetails}
                    loadNow={this.handleLoadNow}
                  />
                  {this.state.loadNow.section2 && 
                    <JobOfferEditorSection2
                      hatarakikata={this.state.hatarakikata}
                      hatarakikata_categories={this.state.hatarakikata_categories}
                      retrievedData={this.handleData}
                      initialData={this.state.jobDetails}
                      loadNow={this.handleLoadNow}
                      handleLoad={this.handleLoad}
                    />
                  }
                  {this.state.loadNow.section3 &&
                    <JobOfferEditorSection3
                      retrievedData={this.handleData}
                      initialData={this.state.jobDetails}
                      loadNow={this.handleLoadNow}
                    />
                  }
                  {this.state.loadNow.section4 && !this.state.alreadySubmitted &&
                    <JobOfferEditorSection4 
                      retrievedData={this.handleData}
                      categories={this.state.category}
                      initialData={this.state.jobDetails}
                      loadNow={this.handleLoadNow}
                    />
                  }
                  {this.state.loadNow.section5 &&
                    <JobOfferEditorSection5
                      retrievedData={this.handleData}
                      initialData={this.state.jobDetails}
                      loadNow={this.handleLoadNow}
                    />
                  }
                  {this.state.loadNow.section6 &&
                    <JobOfferEditorSection6
                      retrievedData={this.handleData}
                      initialData={this.state.jobDetails}
                      loadNow={this.handleLoadNow}
                    />
                  }
                  {/* <JobOfferEditorSection7
                    retrievedData={this.handleData}
                    initialData={this.state.jobDetails}
                  /> */}
                  {this.state.loadNow.section8 &&
                    <JobOfferEditorSection8
                      retrievedData={this.handleData}
                      initialData={this.state.jobDetails}
                      loadNow={this.handleLoadNow}
                    />
                  }
                  <div className="job-offer-detail-footer">
                    <Button onClick={()=>this.handleInDevelopment()} id="job-offer-close-button"><span>{LANG[localStorage.JobChoiceLanguage].closeJob} </span><FontAwesomeIcon icon='window-close' /></Button>
                    <Button onClick={()=>this.handleEdit()} id="job-offer-edit-button"><span>{LANG[localStorage.JobChoiceLanguage].cancelEdit}</span></Button>
                    { this.state.jobDetails.publication.draft === 1 &&
                      <Button onClick={() => this.setAsDraft()} className="job-offer-draft-background" id={this.state.isValid ? 'job-draft-button' : 'job-draft-button-disabled'}><span>{LANG[localStorage.JobChoiceLanguage].draft} </span><FontAwesomeIcon icon='pen-square' /></Button>
                    }
                    <Button disabled={!this.state.isValid} onClick={() => this.setAsPost()} id="job-post-button"><span>{LANG[localStorage.JobChoiceLanguage].postJob}</span></Button>
                  </div>
                </>
              }
          </div>

        <Modal show={this.state.modal.modal} 
          messageKey={this.state.modal.messageKey}
          message={this.state.modal.message}
          type={this.state.modal.modalType}
          redirect={this.state.modal.redirect}
          handleParentClose={this.handleParentClose}
        />

        <LoadingIcon show={this.state.isLoading || this.state.isLoadingImg} />
        </div>
      </JobChoiceLayout>
    );
  }
}

const mapStateToProps = state => {
  return state
}

export default connect(mapStateToProps)(JobOfferDetail)
