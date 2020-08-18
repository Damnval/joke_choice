import React, { Component } from 'react'
import JobChoiceLayout from '../../../layouts/jobChoiceLayout/JobChoiceLayout'
import { LANG } from '../../../constants'
import './../Hatarakikata.scss'
import api from '../../../utilities/api'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../../store/auth/actions'
import Loading from '../../../components/loading/Loading'
import { CSSTransition } from 'react-transition-group'
import ReactTimeout from 'react-timeout'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import HatarakikataModalInfo from './../hatarakikataModalInfo/HatarakikataModalInfo'
import HatarakikataCard from './../../../components/hatarakikata/hatarakikataCard/HatarakikataCard'
import Modal from './../../../components/modal/Modal'
import HatarakikataSubmitModal from './../hatarakikataSubmitModal/HatarakikataSubmitModal'
import store from '../../../store/config'
import { storeAuthenticatedUser } from '../../../store/user/actions'
import {Breadcrumb} from 'react-bootstrap'
import HatarakikataMessage from '../hatarakikataMessage/HatarakikataMessage'

class SaveHatarakikata extends Component {
  constructor(props) {
    super(props)

    this.state = {
      modal: {
        message: '',
        messageKey: null,
        modal: false,
        modalType: '',
        redirect: null,
      },
      hatarakikata: [],
      chosenHatarakikata: [],
      hatarakikataCount: 0,
      hatarakikataCountMax: 0,
      intervalID: 0,
      chosenBigCategory: null,
      isLoading: true,
      doneLoadingBigCategory: false,
      timeoutList: [],
      showHatarakikataInfo: false,
      inTransition: true,
      submit: false,
      isSaving: false
    }

    this.removeHatarakikata = this.removeHatarakikata.bind(this)
    this.handleParentClose = this.handleParentClose.bind(this)
  }

  componentDidMount() {
    let hatarakikata = []
    api.get('api/hataraki-kata-categories').then(response => {
      if (response.data.status === 200) {
        let job_seeker = this.props.user.data.job_seeker
        let chosenHatarakikata = []

        chosenHatarakikata = job_seeker.hataraki_kata_resource.map((value, key) => {
          const hataraki_kata = value.hataraki_kata
          return {
            image: hataraki_kata.image,
            item_jp: hataraki_kata.item_jp,
            item_en: hataraki_kata.item_en,
            id: hataraki_kata.id
          }
        })

        hatarakikata = [...response.data.results.hataraki_kata_categories]
        const exitList = hatarakikata.map((value, key) => {
          return {
            transition: `opacity 300ms ease-in-out`,
            opacity: 0
          }
        })
        this.setState({
          hatarakikata: hatarakikata,
          exitList: exitList,
          secondExitList: [...exitList],
          prevLocation: this.props.prevLocation,
          job_seeker: job_seeker,
          chosenHatarakikata: chosenHatarakikata
        }, () => {
          this.setState({ isLoading: false, })
        })
      } else {
        this.setState({
          modal: {
            messageKey: 'somethingWentWrong',
            message: LANG[localStorage.JobChoiceLanguage].somethingWentWrong,
            modal: true,
            modalType: 'error'
          }
        })
      }
    }).catch(error => {
      console.log(error)
      this.setState({
        modal: {
          messageKey: 'serverError',
          message: LANG[localStorage.JobChoiceLanguage].serverError,
          modal: true,
          modalType: 'error',
          redirect: '/',
        }
      })
    })
  }

  chooseBigCategory = (id) => {
    const exitList = [...this.state.exitList]
    let firstTimeoutList = []
    let secondTimeoutList = []
    let count = 0
    const firstList = exitList.slice(id).map((value, key) => {
      count = key
      firstTimeoutList[key] = 100 * key
      return {
        transition: `opacity 300ms ease-in-out`,
        transitionDelay: `${100*key}ms`,
        opacity: 0
      }
    })
    const secondList = exitList.slice(0, id).map((value, key) => {
      count = count + 1
      let id = count + 1
      secondTimeoutList[key] = 100 * id
      return {
        transition: `opacity 300ms ease-in-out`,
        transitionDelay: `${100*id}ms`,
        opacity: 0
      }
    })
    this.setState({
      exitList: [...secondList, ...firstList],
      timeoutList: [...secondTimeoutList, ...firstTimeoutList],
      chosenBigCategory: id
    }, () => {
      this.props.setTimeout(() => (this.setState({doneLoadingBigCategory: true})), 1000)
    })
  }

  // This function uses the id for the chosen hatarakikata and adds it to the User Hatarakikata List
  // If Hatarakikata exists, a MODAL should open saying that the hatarakikata has already been chosen.
  chooseHatarakikata = (id) => {
    this.setState({
      modal: {
        messageKey: null,
        message: '',
        modal: false,
        modalType: ''
      }
    }, () => {
      const chosenCategory = this.state.hatarakikata[this.state.chosenBigCategory].hataraki_kata
      const chosenHatarakikata = [...this.state.chosenHatarakikata]
      if (chosenHatarakikata.length < 4 &&
        chosenHatarakikata.filter(function(item) { return item.id === chosenCategory[id].id ? item : null })[0] === undefined) {
        chosenHatarakikata.push(chosenCategory[id])
        this.setState({
          chosenHatarakikata: chosenHatarakikata
        }, () => {
          this.saveHatarakikata()
        })
      } else if (chosenHatarakikata.length === 4) {
        this.setState({
          modal: {
            messageKey: 'choose4hata',
            message: LANG[localStorage.JobChoiceLanguage].choose4hata,
            modal: true,
            modalType: 'error'
          }
        })
      }else {
        this.setState({
          modal: {
            messageKey: 'youhaveChosenHata',
            message: LANG[localStorage.JobChoiceLanguage].youhaveChosenHata,
            modal: true,
            modalType: 'error'
          }
        })
      }
    })
  }

  // Function that accepts the list that is being animated and the id that is animating
  // Stops disabling the button if all buttons are done animating
  endofTransition = (list, id) => {
    if (list.length === id+1) {
      this.setState({inTransition: false})
    }
  }

  // Handle closing of modal if closed in parent
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

  // Save new set of hataraki kata when click on a hataraki kata
  saveHatarakikata = () => {
    this.setState({
      modal: {
          messageKey: null,
          message: '',
          modal: false,
          modalType: '',
          redirect: null,
      },
      isLoading: true
    })

    let hataraki_kata = this.state.chosenHatarakikata.map((value, key) => {
      return ({hataraki_kata_id: value.id})
    })

    const credentials = {
      type: 'job_seeker',
      hataraki_kata: hataraki_kata
    }

    api.patch('api/hataraki-kata-resource/' + this.state.job_seeker.id, credentials).then(response => {
      if(response.data.status === 200){
        if(response.data.error) {
          const errorValue = Object.values(JSON.parse(response.data.error))
          this.setState({
            modal: {
              messageKey: null,
              message: errorValue[0][0],
              modal: true,
              modalType: 'error'
            },
            isLoading: false
          })
        } else {
          store.dispatch(storeAuthenticatedUser())
          this.setState({
            isSaving: true,
            isLoading: false
          }, () => {
            this.props.setTimeout(() => (this.setState({isSaving: false})), 1000)
          })
        }
      } else {
        this.setState({
          modal: {
            messageKey: 'somethingWentWrong',
            message: LANG[localStorage.JobChoiceLanguage].somethingWentWrong,
            modal: true,
            modalType: 'error',
          },
          isLoading: false
        })
      }
    }).catch(error => {
      console.log(error)
      this.setState({
        modal: {
          messageKey: 'serverError',
          message: LANG[localStorage.JobChoiceLanguage].serverError,
          modal: true,
          modalType: 'error',
          redirect: '/home',
        },
        isLoading: false,
      })
    })
  }

  // Removes the chosen hatarakikata from the list of chosen.
  removeHatarakikata = (id) => {
    const chosenHatarakikata = [...this.state.chosenHatarakikata]
    chosenHatarakikata.splice(id, 1)
    this.setState({
      chosenHatarakikata: chosenHatarakikata
    }, () => {
      this.saveHatarakikata()
    })
  }

  submitHatarakikata = () => {
    this.props.history.push({ pathname: this.state.prevLocation })
  }

  openBigCategory = () => {
    this.setState({
      doneLoadingBigCategory: false,
      chosenBigCategory: null
    }, () => {
      this.setState({
        inTransition: false
      })
    })
  }

  render() {

    const hatarakikata = this.state.hatarakikata
    const defaultStyle = {
      transition: `opacity 200ms ease-in-out`,
      opacity: 0,
    }

    const transitionStyles = {
      entering: { opacity: 0 },
      entered:  { opacity: 1 },
      exiting:  { opacity: 0 },
      exited:  { opacity: 0 },
    }

    const chosenHatarakikata = this.state.chosenHatarakikata

    const Fade = (value, key) => (
      <CSSTransition
        key={key}
        timeout={!this.state.isLoading && this.state.chosenBigCategory === null ? 100*(key+1) : 100}
        in={!this.state.isLoading && this.state.chosenBigCategory === null}
        onEntered={() => this.endofTransition(this.state.hatarakikata, key)}
        onExiting={() => this.setState({inTransition: true})}
        unMountOnExit>
        {state => (
          <button
            style={{ ...this.state.exitList[key],
                     ...transitionStyles[state] }}
            className={`hatarakikata-panel panel-${key} btn btn-default`}
            onClick={() => this.chooseBigCategory(key)}
            disabled={this.state.inTransition}
          >
            <img src={value.image} alt="job_image"/>
            <div className="hatarakikata-description">
              <span>{localStorage.JobChoiceLanguage === 'JP' ? value.item_jp: value.item_en}</span>
            </div>
          </button>
        )}
      </CSSTransition>
    )

    const Hatarakikata = (value, key) => (
      <CSSTransition
        key={key+8}
        timeout={this.state.doneLoadingBigCategory ? 100*key : 100}
        in={this.state.doneLoadingBigCategory}
        onEntered={() => this.endofTransition(this.state.hatarakikata[this.state.chosenBigCategory].hataraki_kata, key)}
        mountOnEnter
        unMountOnExit>
        {state => (
          <button
            style={{
              ...this.state.secondExitList[key],
              ...transitionStyles[state]
            }}
            className={`hatarakikata-panel panel-${key} btn btn-default`}
            onClick={() => this.chooseHatarakikata(key)}
            disabled={this.state.inTransition}
          >
            <img className="select-hatarakikata-image" src={value.image} alt="job_image"/>
            <div className="hatarakikata-description">
              <span>{localStorage.JobChoiceLanguage === 'JP' ? value.item_jp: value.item_en}</span>
            </div>
          </button>
        )}
      </CSSTransition>
    )

    return (

      <JobChoiceLayout>
        <div className="jobchoice-body">
          <Breadcrumb className="breadcrumb-account-profile">
            <Breadcrumb.Item href="/home">{ LANG[localStorage.JobChoiceLanguage].dashboard }</Breadcrumb.Item>/
            {this.state.prevLocation === '/account-profile' &&
              <><Breadcrumb.Item href="/account-profile">{ LANG[localStorage.JobChoiceLanguage].profile }</Breadcrumb.Item>/</>}
            {this.state.prevLocation === '/jobs' &&
              <><Breadcrumb.Item href="/jobs">{ LANG[localStorage.JobChoiceLanguage].jobs }</Breadcrumb.Item>/</>}
            <Breadcrumb.Item active>{ LANG[localStorage.JobChoiceLanguage].editHatarakikata }</Breadcrumb.Item>
          </Breadcrumb>
          <div className="container">
            <div className="first-page-row row hatarakikata-page-header">
              <div className="col-md-7">
                <span>{ LANG[localStorage.JobChoiceLanguage].hataMessageInfo1 }</span>
                <button className="btn btn-default btn-hatarakikata-info" onClick={() => this.setState({showHatarakikataInfo: true})}>
                  <FontAwesomeIcon icon={['fa', 'question-circle']}/>
                </button>
              </div>
            </div>
            <div className="page-row row">
              <div className="col-xs-12 col-lg-7 col-sm-12 flex justify-content-center direction-column">
                <div className={`hatarakikata-panel-container mx-auto${this.state.doneLoadingBigCategory ? ' done-loading-big-category' : ''}`}>
                  {!this.state.doneLoadingBigCategory && this.state.hatarakikata.map((value, key) => {
                    return Fade(value, key)
                  })}
                  <CSSTransition
                    timeout={10}
                    in={!this.state.isLoading}>
                    {state => (
                      <div style={{
                        ...defaultStyle,
                        ...transitionStyles[state]
                      }} className={`hatarakikata-panel panel-9`}>
                        {this.state.chosenBigCategory === null ?
                          <span>{ LANG[localStorage.JobChoiceLanguage].hatarakikataChoice }</span> :
                          <>
                            <img src={hatarakikata[this.state.chosenBigCategory].image} alt="job_image"/>
                            <div className="hatarakikata-description">
                              <span>{ localStorage.JobChoiceLanguage === 'US' ?
                                hatarakikata[this.state.chosenBigCategory].item_en :
                                hatarakikata[this.state.chosenBigCategory].item_jp
                              }</span>
                            </div>
                          </>
                        }
                      </div>
                    )}
                  </CSSTransition>
                  {this.state.chosenBigCategory !== null && this.state.hatarakikata[this.state.chosenBigCategory].hataraki_kata.map((value, key) => {
                    return Hatarakikata(value, key)
                  })}
                </div>
                <CSSTransition
                  timeout={100}
                  in={this.state.doneLoadingBigCategory}
                  mountOnEnter
                  unMountOnExit>
                  {state => (
                    <div
                      style={{
                        ...defaultStyle,
                        ...transitionStyles[state]}}
                      className="chosen-big-category-button-container">
                      <button
                        className="btn btn-info"
                        onClick={() => this.openBigCategory()}>
                        <FontAwesomeIcon icon={['fa', 'chevron-left']}  size="1x" />
                        <span>{ LANG[localStorage.JobChoiceLanguage].backToCategoriesList }</span>
                      </button>
                    </div>
                  )}
                </CSSTransition>
                <HatarakikataMessage />
              </div>
            <div className="col-xs-12 col-lg-5 flex justify-content-center">
              <div className="chosen-hatarakikata-panel-container">
                <div className="chosen-hatarakikata-panel-title">{ LANG[localStorage.JobChoiceLanguage].yourChosenHataMsg }</div>
                <div className="chosen-hatarakikata-panel">
                  <div className="chosen-hatarakikata" id="hatarakikata-chosen-1">{chosenHatarakikata[0] && 
                    <HatarakikataCard
                      resource = {{ item_en: chosenHatarakikata[0].item_en,
                                    item_jp: chosenHatarakikata[0].item_jp,
                                    image: chosenHatarakikata[0].image }}
                      removeHatarakikata = { this.removeHatarakikata }
                      id = {0}
                    />
                  }</div>
                  <div className="chosen-hatarakikata" id="hatarakikata-chosen-2">{chosenHatarakikata[1] &&
                    <HatarakikataCard
                    resource = {{ item_en: chosenHatarakikata[1].item_en,
                                  item_jp: chosenHatarakikata[1].item_jp,
                                  image: chosenHatarakikata[1].image }}
                    removeHatarakikata = { this.removeHatarakikata }
                    id = {1}
                  />
                  }</div>
                  <div className="chosen-hatarakikata" id="hatarakikata-chosen-3">{chosenHatarakikata[2] &&
                    <HatarakikataCard
                    resource = {{ item_en: chosenHatarakikata[2].item_en,
                                  item_jp: chosenHatarakikata[2].item_jp,
                                  image: chosenHatarakikata[2].image }}
                    removeHatarakikata = { this.removeHatarakikata }
                    id = {2}
                  />
                  }</div>
                  <div className="chosen-hatarakikata" id="hatarakikata-chosen-4">{chosenHatarakikata[3] &&
                    <HatarakikataCard
                      resource = {{ item_en: chosenHatarakikata[3].item_en,
                                    item_jp: chosenHatarakikata[3].item_jp,
                                    image: chosenHatarakikata[3].image }}
                      removeHatarakikata = { this.removeHatarakikata }
                      id = {3}
                    />
                  }</div>
                </div>
                {this.state.isSaving ?
                  <div className="save-container-hatarakikata">{ LANG[localStorage.JobChoiceLanguage].saved }</div>
                  :
                  <div id="space-below"></div>
                }
              </div>
            </div>
          </div>
          </div>
        </div>
        <Loading show={this.state.isLoading} />

        <Modal
          show={this.state.modal.modal}
          message={this.state.modal.message}
          messageKey={this.state.modal.messageKey}
          type={this.state.modal.modalType}
          redirect={this.state.modal.redirect}
          handleParentClose={this.handleParentClose}
        />

        <HatarakikataSubmitModal
          show={this.state.submit}
          onClose={() => this.setState({submit: false})}
          handleSubmit={this.submitHatarakikata}
        />

        <HatarakikataModalInfo
          show={this.state.showHatarakikataInfo}
          onClose={() => this.setState({showHatarakikataInfo: false})}
        />
      </JobChoiceLayout>
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

export default connect(mapStateToProps, mapDispatchToProps)(ReactTimeout(SaveHatarakikata))
