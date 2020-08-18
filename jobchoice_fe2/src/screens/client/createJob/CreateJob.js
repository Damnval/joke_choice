import React, { Component } from 'react'
import './CreateJob.scss'
import { connect } from 'react-redux'
import CreateJobSection1 from './createJobComponents/CreateJobSection1'
import CreateJobSection2 from './createJobComponents/CreateJobSection2'
import CreateJobSection3 from './createJobComponents/CreateJobSection3'
import CreateJobSection4 from './createJobComponents/CreateJobSection4'
import CreateJobSection5 from './createJobComponents/CreateJobSection5'
import CreateJobSection6 from './createJobComponents/CreateJobSection6'
// import CreateJobSection7 from './createJobComponents/CreateJobSection7'
import CreateJobSection8 from './createJobComponents/CreateJobSection8'
import ClientDashboardSidebar from '../clientDashboard/clientDashboardComponents/ClientDashboardSidebar'
import JobOfferViewDetails from '../../../components/jobOfferViewDetails/JobOfferViewDetails'
import api from '../../../utilities/api'
import { Button } from 'react-bootstrap'
import Modal from '../../../components/modal/Modal'
import LoadingIcon from '../../../components/loading/Loading'
import JobChoiceLayout from '../../../layouts/jobChoiceLayout/JobChoiceLayout'
import { LANG } from '../../../constants'
import { omit } from 'lodash'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import moment from 'moment'

class CreateJob extends Component {
  constructor(props) {
    super(props)

    this.state = {
      //  For Hatarakikata Modal - Categories -> Hatarakikata
      hatarakikata_categories: [],
      hatarakikata: [],
      categories: [],
      category: [],
      hatarakikata_category: [],
      create_data: {
        company_id: this.props.user.data.company.id,
        features: 'NOT IMPLEMENTED YET',
        approval_status: 'waiting',
        publication: {
          draft: 1,
        },
      },
      view_data: {
        company_id: this.props.user.data.company.id,
        features: 'NOT IMPLEMENTED YET',
        approval_status: 'waiting',
        publication: {
          draft: 1,
        },
      },
      validity: {
        section1: false,
        section2: false,
        section3: true,
        section4: false,
        section5: true,
        section6: false,
        // section7: false,
        section8: false,
      },
      isValid: false,
      isLoading: false,
      preview: false,
      modal: {
        messageKey: null,
        message: '',
        modal: false,
        modalType: '',
        redirect: null,
      },
      viewToEdit: false,
      allowDraft: false,
      times: {
        start_time: "",
        end_time: "",
      },
      isLoadingImg: false
    }

    this.handleData = this.handleData.bind(this)
    this.handleLoad = this.handleLoad.bind(this)
  }

  componentDidMount() {
    this.setState({
      isLoading: true,
      modal: {
        messageKey: null,
        message: '',
        modal: false,
        modalType: '',
        redirect: null,
      },
    })

    // Get all hataraki katas
    api.get('api/hataraki-kata').then(response => {
      this.setState({ hatarakikata: response.data.results.hataraki_kata })
    // Get all job categories
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
          categories: job_categories,
          category: response.data.results.jobs,
        })
    // Get all hataraki kata categories and their hataraki katas
        api.get('api/hataraki-kata-categories').then(response => {
          let hatarakikata_categories = [...response.data.results.hataraki_kata_categories].map(
            (el) => {
              el.hataraki_kata.map((el) => {
                el['isSelected'] = false
                return el
              })
              return el
            }
          )
          this.setState({
            hatarakikata_categories: hatarakikata_categories,
            hatarakikata_category: response.data.results.hataraki_kata_categories,
            isLoading: false
          })
        }).catch(error => {
          console.log(error)
          this.setState({
            modal: {
              message: LANG[localStorage.JobChoiceLanguage].serverError,
              modal: true,
              modalType: 'error',
              redirect: '/home',
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
            redirect: '/home'
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
          redirect: '/home',
        },
        isLoading: false,
      })
    })
  }

  handleData(name, data, validity){

    //=============Section 1=============
    if (name === "section1" && data.incentive_per_share !== null && data.incentive_per_share.length > 0) {
      const new_incentive_per_share = parseFloat(String(data.incentive_per_share).replace(/,/g, ''))
      data.incentive_per_share = new_incentive_per_share
    }

    if (name === "section1" && data.price !== null && data.price.length > 0) {
      const new_price = parseFloat(String(data.price).replace(/,/g, ''))
      data.price = new_price
    }

    //=============Section 2=============
    if(name === "section2" && data.hataraki_kata && data.hataraki_kata !== null && data.hataraki_kata.length > 0) {
      let hataraki_kata = data.hataraki_kata.map((value, key) => {
        return ({hataraki_kata_id: value})
      })
      data.hataraki_kata = hataraki_kata
    }

    if(name === "section2" && data.other_hataraki_kata && data.other_hataraki_kata !== null && data.other_hataraki_kata.length > 0) {
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

      var finalData = omit(nearest_stations, ['station1', 'station2', 'transportation1', 'transportation2', 'time_duration1', 'time_duration2'])
      data = finalData
    }

    //=============Section 3=============
    if(name === "section3") {
      let idDeletable = null
      data.job_strengths.map((value, key) => {
        idDeletable = value.description.length === 0 && value.item.length === 0 ? value.id : null
        
        if(idDeletable !== null) {
          data.job_strengths = data.job_strengths.filter(strength => strength.id !== idDeletable)
        }
      })
    }

    //=============Section 4=============
    if(name === "section4" && data.job_sub_categories && data.job_sub_categories !== null && data.job_sub_categories.length > 0) {
      let job_sub_categories = data.job_sub_categories.map((value, key) => {
        return ({job_sub_category_id: value})
      })
      data.job_sub_categories = job_sub_categories
    }

    if(name === "section4" && data.salary && data.salary !== null && data.salary.length > 0) {
      const salary = parseFloat(String(data.salary).replace(/,/g, ''))
      data.salary = salary
    }

    if(name === "section4" && data.salary_max_range && data.salary_max_range !== null && data.salary_max_range.length > 0) {
      const salary_max_range = parseFloat(String(data.salary_max_range).replace(/,/g, ''))
      data.salary_max_range = salary_max_range
    }

    if(name === "section4" && data.start_time && data.start_time !== '') {
      this.setState({
        times: {
          ...this.state.times,
          start_time: data.start_time,
        }
      }, () => {
        data.start_time = data.start_time.getHours() + ":" + data.start_time.getMinutes() + ':' + data.start_time.getSeconds()
        this.setState({
          create_data: {
            ...this.state.create_data,
            ...data,
          },
          view_data: {
            ...this.state.view_data,
            ...data,
          },
        })
      })
    }

    if(name === "section4" && data.end_time && data.end_time !== '') {
      this.setState({
        times: {
          ...this.state.times,
          end_time: data.end_time,
        }
      }, () => {
        data.end_time = data.end_time.getHours() + ":" + data.end_time.getMinutes() + ':' + data.end_time.getSeconds()
        this.setState({
          create_data: {
            ...this.state.create_data,
            ...data,
          },
          view_data: {
            ...this.state.view_data,
            ...data,
          },
        })
      })
    }

    //=============Section 5=============
    if(name === "section5" && data.job_questions && data.job_questions.length > 0) {
      let job_questions = []
      job_questions = data.job_questions.map((question, key) => {
        if(question.answer_type !== "free_text" && question.answer_type.length > 0) {
          let answersNew = []
          question.answers.map((answer, key) => {
            if(answer.field.length > 0) {
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

    //=============Section 8=============
    if(name === "section8") {

      const publication = {
        publication: {
          ...data,
          draft: this.state.create_data.publication.draft,
        }
      }

      const published_comment = data.published_comment
      data = {...publication, published_comment: published_comment}
      delete data.publication.published_comment
    }

    //=============Setting Data=============
    this.setState({
      create_data: {
        ...this.state.create_data,
        ...data,
      },
      view_data: {
        ...this.state.view_data,
        ...data,
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
      this.setState({ isValid: validityFinal })
      this.checkDraft()
    })
  }
  
  checkDraft() {
    this.setState({allowDraft: true})
  }

  setAsPost() {
    this.setState({
      create_data: {
        ...this.state.create_data,
        publication: {
          ...this.state.create_data.publication,
          draft: 0,
        }
      }
    }, () => {
      this.handleSubmit()
    })
  }

  setAsDraft() {
    this.setState({
      create_data: {
        ...this.state.create_data,
        publication: {
          ...this.state.create_data.publication,
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
      modal: {
        messageKey: null,
        message: '',
        modal: false,
        modalType: '',
        redirect: null,
      },
    })
    api.post('api/job/', this.state.create_data).then(response => {
      this.setState({ 
        modal: {
          messageKey: this.state.create_data.publication.draft === 0 ? 'jobSuccessfullySaved' : 'draftSuccessfullySaved',
          modal: true,
          modalType: 'success',
          redirect: '/home'
        },
        isLoading: false,
      })
    }).catch(error => {
      console.log(error)
      this.setState({ 
        modal: {
          message: LANG[localStorage.JobChoiceLanguage].serverError,
          modal: true,
          modalType: 'error',
        },
        isLoading: false,
      })
    })
  }

  handlePreview() {
    if(!this.state.preview) {
      //days format
    let days_new = []
    if(this.state.create_data.days && this.state.create_data.days.length > 0) {
      days_new = this.state.create_data.days.map((value, key) => {
        return ({day: value})
      })
    }

    //time format
    const end_time_new = this.state.create_data.end_time ? moment(this.state.create_data.end_time, ["h:mm A"]).format("HH:mm") : null
    const start_time_new = this.state.create_data.start_time ? moment(this.state.create_data.start_time, ["h:mm A"]).format("HH:mm") : null

    //galleries format
    let galleries_new = []
    if(this.state.create_data.sub_image1 && this.state.create_data.sub_image1.length > 0) {
      let gallery_dummy = null
      if(this.state.create_data.sub_caption1 && this.state.create_data.sub_caption1.length > 0) {
        gallery_dummy = {
          file_path: this.state.create_data.sub_image1,
          caption: this.state.create_data.sub_caption1
        }
      } else {
        gallery_dummy = {
          file_path: this.state.create_data.sub_image1,
          caption: ""
        }
      }

      galleries_new.push(gallery_dummy)
    }
    if(this.state.create_data.sub_image2 && this.state.create_data.sub_image2.length > 0) {
      let gallery_dummy = null
      if(this.state.create_data.sub_caption2 && this.state.create_data.sub_caption2.length > 0) {
        gallery_dummy = {
          file_path: this.state.create_data.sub_image2,
          caption: this.state.create_data.sub_caption2
        }
      } else {
        gallery_dummy = {
          file_path: this.state.create_data.sub_image2,
          caption: ""
        }
      }

      galleries_new.push(gallery_dummy)
    }
    if(this.state.create_data.sub_image3 && this.state.create_data.sub_image3.length > 0) {
      let gallery_dummy = null
      if(this.state.create_data.sub_caption3 && this.state.create_data.sub_caption3.length > 0) {
        gallery_dummy = {
          file_path: this.state.create_data.sub_image3,
          caption: this.state.create_data.sub_caption3
        }
      } else {
        gallery_dummy = {
          file_path: this.state.create_data.sub_image3,
          caption: ""
        }
      }

      galleries_new.push(gallery_dummy)
    }

    //hatarakikata_main
    let hataraki_kata_dummy = null
    let hataraki_kata_resource_dummy = null
    if(this.state.create_data.hataraki_kata && this.state.create_data.hataraki_kata.length > 0) {
      hataraki_kata_resource_dummy = this.state.create_data.hataraki_kata.map((value, key) => {
        //check individual categories
        this.state.hatarakikata_categories.map((category, key2)=> {
          category.hataraki_kata.map((individual, key3)=> {
            if(individual.id === value.hataraki_kata_id) {
              hataraki_kata_dummy = individual
            }
          })
        })
        //return with hataraki_kata
        return ({
          hataraki_kata_id: value.hataraki_kata_id,
          hataraki_kata: hataraki_kata_dummy,
        })
      })
    }

    //job_job_sub_categories
    let sub_category_dummy = null
    let job_job_sub_categories_dummy = null
    if (this.state.create_data.job_sub_categories && this.state.create_data.job_sub_categories.length > 0) {
      job_job_sub_categories_dummy = this.state.create_data.job_sub_categories.map((value, key) => {
        //check individual categories
        this.state.categories.map((category, key2)=> {
          category.job_sub_category.map((individual, key3)=> {
            if(individual.id === value.job_sub_category_id) {
              sub_category_dummy = individual
            }
          })
        })
        //return with job_sub_category
        return ({
          job_sub_category_id: value.job_sub_category_id,
          job_sub_category: sub_category_dummy,
        })
      })
    }

    //question and answers
    let job_questions_new = []
    if(this.state.create_data.job_questions && this.state.create_data.job_questions.length > 0) {
      job_questions_new = this.state.create_data.job_questions.map((question, key1) => {
        let job_question_answers_dummy = []
        if(question.answers && question.answers.length > 0) {
          job_question_answers_dummy = question.answers.map((answer_value, key2) => {
            return({answer: answer_value})
          })
        }
        return({
          answer_type: question.answer_type,
          question: question.question,
          required_answer: question.required_answer,
          job_question_answers: job_question_answers_dummy,
        })
      })
    }

    //job reasons to hire
    let job_reasons_to_hire_new = []
    if(this.state.create_data.job_reasons_to_hire && this.state.create_data.job_reasons_to_hire.length > 0) {
      job_reasons_to_hire_new = this.state.create_data.job_reasons_to_hire.map((value, key) => {
        return ({reason: value})
      })
    }

    //job welfares
    let job_welfares_new = []
    if(this.state.create_data.job_welfares && this.state.create_data.job_welfares.length > 0) {
      job_welfares_new = this.state.create_data.job_welfares.map((value, key) => {
        return ({name: value})
      })
    }

    //other_hatarakikata
    let other_hatarakikata_individual = null
    let other_hataraki_kata_dummy = null
    if (this.state.create_data.other_hataraki_kata && this.state.create_data.other_hataraki_kata.length > 0) {
      other_hataraki_kata_dummy = this.state.create_data.other_hataraki_kata.map((value, key) => {
        //check individual categories
        this.state.hatarakikata_categories.map((category, key2)=> {
          category.hataraki_kata.map((individual, key3)=> {
            if(individual.id === value.hataraki_kata_id) {
              other_hatarakikata_individual = individual
            }
          })
        })
        //return with hataraki_kata
        return ({
          hataraki_kata_id: value.hataraki_kata_id,
          hataraki_kata: other_hatarakikata_individual,
        })
      })
    }

    this.setState({
      view_data: {
        ...this.state.view_data,
        days: days_new,
        end_time: end_time_new,
        galleries: galleries_new,
        hataraki_kata_resource: hataraki_kata_resource_dummy,
        job_job_sub_categories: job_job_sub_categories_dummy,
        job_questions: job_questions_new,
        job_reasons_to_hire: job_reasons_to_hire_new,
        job_welfares: job_welfares_new,
        nearest_station: this.state.view_data.nearest_stations,
        notes: null,
        other_hataraki_kata: other_hataraki_kata_dummy,
        start_time: start_time_new,
      },
    }, () => {
      this.setState({
        preview: !this.state.preview,
        viewToEdit: this.state.preview,
      })
    })
    } else {
      this.setState({
        preview: !this.state.preview,
        viewToEdit: this.state.preview,
      })
    }
  }

  handleLoad = (state, time) => {
    setTimeout(() => this.setState({ isLoadingImg: state }), time)
  }

  render() {
    return (
      <JobChoiceLayout>
        <div className="createJob-outer">
          <ClientDashboardSidebar />

          {!this.state.isLoading && !this.state.preview &&
            <div className="createJob-background">
              <div className="createJob-title">
                <span>{LANG[localStorage.JobChoiceLanguage].creatJob}</span>
              </div>
              {this.state.hatarakikata.length > 0 &&
                <>
                  <CreateJobSection1
                    company={this.props.user.data.company}
                    retrievedData={this.handleData}
                    viewToEdit={this.state.viewToEdit}
                    viewToEditData={this.state.create_data}
                  />
                  <CreateJobSection2
                    hatarakikata={this.state.hatarakikata}
                    hatarakikata_categories={this.state.hatarakikata_categories}
                    retrievedData={this.handleData}
                    viewToEdit={this.state.viewToEdit}
                    viewToEditData={this.state.create_data}
                    handleLoad={this.handleLoad}
                  />
                  <CreateJobSection3
                    retrievedData={this.handleData}
                    viewToEdit={this.state.viewToEdit}
                    viewToEditData={this.state.create_data}
                  />
                  <CreateJobSection4 
                    retrievedData={this.handleData}
                    categories={this.state.categories}
                    viewToEdit={this.state.viewToEdit}
                    viewToEditData={this.state.create_data}
                    times={this.state.times}
                  />
                  <CreateJobSection5
                    retrievedData={this.handleData}
                    viewToEdit={this.state.viewToEdit}
                    viewToEditData={this.state.create_data}
                  />
                  <CreateJobSection6
                    retrievedData={this.handleData}
                    viewToEdit={this.state.viewToEdit}
                    viewToEditData={this.state.create_data}
                  />
                  {/* <CreateJobSection7 
                    company={this.props.user.data.company}
                  /> */}
                  <CreateJobSection8 
                    retrievedData={this.handleData}
                    viewToEdit={this.state.viewToEdit}
                    viewToEditData={this.state.create_data}
                  />
                </>
              }

              <div className="createJob-footer">
                <Button disabled={!this.state.allowDraft} onClick={() => this.setAsDraft()} id={this.state.isValid ? 'job-draft-button' : 'job-draft-button-disabled'}><span>{LANG[localStorage.JobChoiceLanguage].draft} </span><FontAwesomeIcon icon='pen-square' /></Button>
                <Button disabled={!this.state.isValid} onClick={() => this.setAsPost()} id="job-post-button"><span>{LANG[localStorage.JobChoiceLanguage].postJob}</span></Button>
                <Button onClick={() => this.handlePreview()} id="job-preview-button"><span>{LANG[localStorage.JobChoiceLanguage].preview} </span><FontAwesomeIcon icon='eye' /></Button>
              </div>
            </div>
          }

          

          {!this.state.isLoading && this.state.preview &&
            <div className="createJob-background">
              <JobOfferViewDetails 
                job={this.state.view_data}
                category={this.state.category}
                hatarakikata_categories={this.state.hatarakikata_categories}
              />
              <div className="createJob-footer">
                <Button disabled={!this.state.isValid} onClick={() => this.setAsDraft()} id={this.state.isValid ? 'job-draft-button' : 'job-draft-button-disabled'}><span>{LANG[localStorage.JobChoiceLanguage].draft} </span><FontAwesomeIcon icon='pen-square' /></Button>
                <Button disabled={!this.state.isValid} onClick={() => this.setAsPost()} id="job-post-button"><span>{LANG[localStorage.JobChoiceLanguage].postJob}</span></Button>
                <Button onClick={() => this.handlePreview()} id="job-preview-button"><span>{LANG[localStorage.JobChoiceLanguage].edit} </span><FontAwesomeIcon icon='eye' /></Button>
              </div>
            </div>
          }
          
          <Modal 
            show={this.state.modal.modal}
            messageKey={this.state.modal.messageKey} 
            message={this.state.modal.message}
            type={this.state.modal.modalType}
            redirect={this.state.modal.redirect}
            data={this.state.modal.data}
          />

          <LoadingIcon show={this.state.isLoading || this.state.isLoadingImg} />
        </div>
      </JobChoiceLayout>
    )
  }
}

const mapStateToProps = state => {
  return state
}

export default connect(mapStateToProps)(CreateJob)
