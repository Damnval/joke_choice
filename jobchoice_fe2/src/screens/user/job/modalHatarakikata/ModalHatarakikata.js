import React, { Component } from 'react'
import ReactModal from 'react-modal'
import { Button } from 'react-bootstrap'
import './ModalHatarakikata.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { LANG } from '../../../../constants'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../../../store/auth/actions'

class ModalHatarakikata extends Component {
  constructor(props) {
    super(props)
    this.state = {
      show: this.props.show,
      message: this.props.message,
      data: this.props.data,
      warning: false
    }

    this.handleClose = this.handleClose.bind(this)
    this.refs = React.createRef()
  }

  componentDidMount() {
    ReactModal.setAppElement('body')
  }

  componentWillReceiveProps(newProps){
    if(newProps.show !== this.props.show){
      this.setState({
        show: newProps.show,
        message: newProps.message,
        data: newProps.data,
        hataraki_kata: newProps.hataraki_kata
      })
      console.log(newProps.hataraki_kata)
    }
  }

  sizeDialog = () => {
    if (!this.refs.content) return

    let contentHeight = this.refs.content.getBoundingClientRect().height

    this.setState({
      contentHeight: contentHeight,
    })
  }

  handleClose() {
    this.props.handleClose('hatarakikataEdit')
  }

  componentDidUpdate() {
    if (window.requestAnimationFrame) {
      window.requestAnimationFrame(this.sizeDialog)
    } else {
      window.setTimeout(this.sizeDialog, 50)
    }
  }

  handleChange = (name, value) => {
    this.setState({ 
      [name]: value,
    })
  }

  toggleCheckbox = (e, field) => {
    e.preventDefault()
    const obj = [...this.props[field]]
    const name = e.target.name
    obj[name].value = !obj[name].value
    if (obj.filter(el => el.value).length <= 4) {
      this.setState({warning: false})
      this.props.changeParent({
        [field]: obj
      })
    } else {
      obj[name].value = !obj[name].value
      this.setState({warning: true})
    }
  }

  renderCheckBox = (key, obj, field) => {
    const {item_en, item_jp, value} = obj
    return (
      <span key={item_en}>
        <label className="checkbox-box">
          <input
            name={key}
            type="checkbox"
            checked={value}
            onChange={e => this.toggleCheckbox(e, field)}
          />
        </label>
        <label className="search-checkbox-label">{this.capitalize(localStorage.JobChoiceLanguage === 'JP' ? item_jp: item_en)}</label>
      </span>
    )
  }

  capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
  }

  render() {
    return (
      <ReactModal
        isOpen={this.state.show}
        onAfterOpen={this.afterOpenModal}
        onRequestClose={this.handleClose}
        className='dialog hatarakikata-content'
        overlayClassName='background-dynamic' >
        <div className='dialog__content' ref='content'>
          <div className='hatarakikata-header'>
          <h4>{LANG[localStorage.JobChoiceLanguage].hatarakikataChoice}</h4>
          <Button onClick={this.handleClose}>
            <FontAwesomeIcon className="close-btn" icon={['fa', 'times']}  size="1x" />
          </Button>
          </div>
          <div className='twitter-body'>
            <div>{LANG[localStorage.JobChoiceLanguage].select4Hata}</div>
            <div className='employment-status-container hataraki-kata-container'>
              {this.props.hataraki_kata && this.props.hataraki_kata.map((value, key) => {
                return(this.renderCheckBox(key, value, 'hataraki_kata'))
              })}
            </div>
          </div>
        </div>
      </ReactModal>
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalHatarakikata)
