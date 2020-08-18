import React, { Component } from 'react'
import '../CreateJob.scss'
import { LANG } from '../../../../constants'
import ReactModal from 'react-modal'
import { CSSTransition } from 'react-transition-group'
import ReactTimeout from 'react-timeout'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import HatarakikataCard from './../../../../components/hatarakikata/hatarakikataCard/HatarakikataCard'

ReactModal.setAppElement('body')
class CreateJobHatarakikataModal extends Component {
  constructor(props) {
    super(props)

    this.state = {
      show: this.props.show,
      hatarakikata_categories: this.props.hatarakikata_categories,
      userHatarakikataNum: 0,
      chosenHatarakikata: [],
      exitList: [],
      chosenCategory: [],
      chosenBigCategory: null,
      doneLoadingBigCategory: false,
      inTransition: true,
      isLoading: true,
      error: "You must choose 4"
    }

    this.handleClose = this.handleClose.bind(this)
    this.chooseHatarakikata = this.chooseHatarakikata.bind(this)
    this.removeHatarakikata = this.removeHatarakikata.bind(this)
    this.endofTransition = this.endofTransition.bind(this)
    this.refs = React.createRef()
  }

  componentDidMount() {
    // Code for Hatarakikata Content
    const exitList = this.state.hatarakikata_categories.map((value, key) => {
      return {
        transition: `opacity 300ms ease-in-out`,
        opacity: 0
      }
    })
    this.setState({
      exitList: exitList,
      secondExitList: [...exitList]
    }, () => {
      this.setState({ isLoading: false, })
    })
  }

  handleClose() {
    this.setState({show: false})
  }

  hatarakikataOk = () => {
    const hataraki_kata = this.state.chosenHatarakikata.map((value, key) => {
      return value.id
    })
    this.props.handleHatarakikata(this.props.fieldName, hataraki_kata)
    this.setState({show: false})
  }

  chooseBigCategory = (id) => {
    const exitList = [...this.state.exitList]
    let count = 0
    const firstList = exitList.slice(id).map((value, key) => {
      count = key
      return {
        transition: `opacity 300ms ease-in-out`,
        transitionDelay: `${100*key}ms`,
        opacity: 0
      }
    })
    const secondList = exitList.slice(0, id).map((value, key) => {
      count = count + 1
      let id = count + 1
      return {
        transition: `opacity 300ms ease-in-out`,
        transitionDelay: `${100*id}ms`,
        opacity: 0
      }
    })
    this.setState({
      exitList: [...secondList, ...firstList],
      chosenBigCategory: id,
      chosenCategory: this.state.hatarakikata_categories[id].hataraki_kata
    }, () => {
      this.props.setTimeout(() => (this.setState({doneLoadingBigCategory: true, isLoading: true})), 1000)
    })
  }

  // Function that accepts the list that is being animated and the id that is animating
  // Stops disabling the button if all buttons are done animating
  openBigCategory = () => {
    // Code for Hatarakikata Content
    const exitList = this.state.hatarakikata_categories.map((value, key) => {
      return {
        transition: `opacity 300ms ease-in-out`,
        opacity: 0
      }
    })
    this.setState({
      doneLoadingBigCategory: false,
      chosenBigCategory: null,
      chosenCategory: [],
      exitList: exitList
    }, () => {
      this.setState({
        inTransition: false,
        isLoading: false
      })
    })
  }

  // Removes the chosen hatarakikata from the list of chosen.
  removeHatarakikata = (id) => {
    const chosenHatarakikata = [...this.state.chosenHatarakikata]
    chosenHatarakikata.splice(id, 1)
    this.setState({
      chosenHatarakikata: chosenHatarakikata
    })
  }

  endofTransition = (list, id) => {
    if (list.length === id+1) {
      this.setState({inTransition: false})
    }
  }

  // This function uses the id for the chosen hatarakikata and adds it to the User Hatarakikata List
  // If Hatarakikata exists, a MODAL should open saying that the hatarakikata has already been chosen.
  chooseHatarakikata = (id) => {
    this.setState({
      modal: {
        message: '',
        modal: false,
        modalType: ''
      }
    }, () => {
      const chosenCategory = [...this.state.chosenCategory]
      const chosenHatarakikata = [...this.state.chosenHatarakikata]
      
      if (chosenHatarakikata.length < 4 &&
        chosenHatarakikata.find((val) => val.id === chosenCategory[id].id) === undefined) {
        if (!chosenCategory[id].isSelected)  {
          chosenHatarakikata.push(chosenCategory[id])
          this.setState({
            chosenHatarakikata: chosenHatarakikata
          })
        }
      } else if (chosenHatarakikata.length === 4) {
        this.setState({
          modal: {
            message: LANG[localStorage.JobChoiceLanguage].choose4hata,
            modal: true,
            modalType: 'error'
          }
        })
      }else {
        this.setState({
          modal: {
            message: LANG[localStorage.JobChoiceLanguage].youhaveChosenHata,
            modal: true,
            modalType: 'error'
          }
        })
      }
    })
  }

  removeHatarakikata = (id) => {
    const chosenHatarakikata = [...this.state.chosenHatarakikata]
    chosenHatarakikata.splice(id, 1)
    this.setState({
      chosenHatarakikata: chosenHatarakikata
    })
  }


  render() {
    const padding = 60
    let height = (this.state.contentHeight + padding)
    let heightPx = height + 'px'
    let heightOffset = height / 2
    let offsetPx = heightOffset + 'px'
    const chosenHatarakikata = this.state.chosenHatarakikata
    const hatarakikata_categories = this.state.hatarakikata_categories

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
    
    const style = {
      content: {
        border: '0',
        borderRadius: '4px',
        bottom: 'auto',
        height: heightPx,
        left: '10%',
        position: 'fixed',
        right: 'auto',
        top: '10%',
        width: '80%',
        maxWidth: '100rem',
        minWidth: '40rem',
        background: 'white'
      }
    }

    const Fade = (value, key) => (
      <CSSTransition
        key={key}
        timeout={!this.state.isLoading && this.state.chosenBigCategory === null ? 100*key : 100}
        in={!this.state.isLoading && this.state.chosenBigCategory === null}
        onEnter={() => this.setState({inTransition: true})}
        onEntered={() => this.endofTransition(this.state.hatarakikata_categories, key)}
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
              <span>
              {
                localStorage.JobChoiceLanguage === 'US' ? value.item_en : value.item_jp
              }
              </span>
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
        onEntered={() => this.endofTransition(this.state.chosenCategory, key)}
        mountOnEnter
        unMountOnExit>
        {state => (
          <button
            style={{
              ...this.state.secondExitList[key],
              ...transitionStyles[state]
            }}
            className={`hatarakikata-panel panel-${key} btn btn-default ${value.isSelected ? "disabled-card": ""}`}
            onClick={() => this.chooseHatarakikata(key)}
            disabled={this.state.inTransition}
          >
            <img className="select-hatarakikata-image" src={value.image} alt="job_image"/>
            <div className="hatarakikata-description">
              <span>
              {
                localStorage.JobChoiceLanguage === 'US' ? value.item_en : value.item_jp
              }
              </span>
            </div>
          </button>
        )}
      </CSSTransition>
    )
    

    return (
      <ReactModal
        isOpen={this.state.show}
        onAfterOpen={this.afterOpenModal}
        onRequestClose={this.handleClose}
        className='dialog'
        style={style}
        overlayClassName='background-dynamic'
        shouldCloseOnOverlayClick={false}
      >
        <div className='dialog__content' ref='content'>
          <div className="form-box no-border">
            <div className="createJob-titleArea">
              <div className="createJob-title"><p className="box-title">{ LANG[localStorage.JobChoiceLanguage].addHatarakikata }</p></div>
            </div>
            <div className="container">
            <div className="page-row row">
              <div className="col-xs-12 col-lg-7 col-sm-12 flex justify-content-center direction-column">
                <div className={`hatarakikata-panel-container${this.state.doneLoadingBigCategory ? ' done-loading-big-category' : ''}`}>
                  {!this.state.doneLoadingBigCategory && this.state.hatarakikata_categories.map((value, key) => {
                    return Fade(value, key)
                  })}
                  <CSSTransition
                    timeout={10}
                    in={this.state.show}>
                    {state => (
                      <div style={{
                        ...defaultStyle,
                        ...transitionStyles[state]
                      }} className={`hatarakikata-panel panel-9`}>
                        {this.state.chosenBigCategory === null ? 
                          <span>{ LANG[localStorage.JobChoiceLanguage].hatarakikataChoice }</span> :
                          <>
                            <img src={hatarakikata_categories[this.state.chosenBigCategory].image} alt="job_image"/>
                            <div className="hatarakikata-description">
                              <span>{ localStorage.JobChoiceLanguage === 'US' ?
                                hatarakikata_categories[this.state.chosenBigCategory].item_en :
                                hatarakikata_categories[this.state.chosenBigCategory].item_jp
                              }</span>
                            </div>
                          </>
                        }
                      </div>
                    )}
                  </CSSTransition>
                  {this.state.chosenCategory.map(
                      (value, key) => {
                    return Hatarakikata(value, key)
                  })}
                </div>
                <CSSTransition
                  timeout={400}
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
              </div>
            <div className="col-xs-12 col-lg-5 flex justify-content-center">
              <div className="chosen-hatarakikata-panel-container">
                <div className="chosen-hatarakikata-panel-title">{ LANG[localStorage.JobChoiceLanguage].yourChosenHataMsg }</div>
                <div className="chosen-hatarakikata-panel">
                  <div className="chosen-hatarakikata">{chosenHatarakikata[0] && 
                    <HatarakikataCard
                      resource = {{ item_en: chosenHatarakikata[0].item_en,
                                    item_jp: chosenHatarakikata[0].item_jp,
                                    image: chosenHatarakikata[0].image }}
                      removeHatarakikata = { this.removeHatarakikata }
                      id = {0}
                    />
                  }</div>
                  <div className="chosen-hatarakikata">{chosenHatarakikata[1] &&
                    <HatarakikataCard
                    resource = {{ item_en: chosenHatarakikata[1].item_en,
                                  item_jp: chosenHatarakikata[1].item_jp,
                                  image: chosenHatarakikata[1].image }}
                    removeHatarakikata = { this.removeHatarakikata }
                    id = {1}
                  />
                  }</div>
                  <div className="chosen-hatarakikata">{chosenHatarakikata[2] &&
                    <HatarakikataCard
                    resource = {{ item_en: chosenHatarakikata[2].item_en,
                                  item_jp: chosenHatarakikata[2].item_jp,
                                  image: chosenHatarakikata[2].image }}
                    removeHatarakikata = { this.removeHatarakikata }
                    id = {2}
                  />
                  }</div>
                  <div className="chosen-hatarakikata">{chosenHatarakikata[3] &&
                    <HatarakikataCard
                      resource = {{ item_en: chosenHatarakikata[3].item_en,
                                    item_jp: chosenHatarakikata[3].item_jp,
                                    image: chosenHatarakikata[3].image }}
                      removeHatarakikata = { this.removeHatarakikata }
                      id = {3}
                    />
                  }</div>
                </div>
                <div className="submit-hatarakikata-container-modal">
                  <button
                    className='btn btn-secondary'
                    onClick={() => this.handleClose()}>
                    { LANG[localStorage.JobChoiceLanguage].cancel }
                  </button>
                  <button
                    className={`btn ${(chosenHatarakikata.length > 0 && chosenHatarakikata.length < 4)? 'btn-secondary': 'btn-success'}`}
                    onClick={() => this.hatarakikataOk()}
                    disabled={chosenHatarakikata.length > 0 && chosenHatarakikata.length < 4}>
                    { LANG[localStorage.JobChoiceLanguage].saveHataPreference }
                  </button>
                </div>
              </div>
            </div>
          </div>
          </div>
          </div>
        </div>
    </ReactModal>
    )
  }
}

export default ReactTimeout(CreateJobHatarakikataModal)
