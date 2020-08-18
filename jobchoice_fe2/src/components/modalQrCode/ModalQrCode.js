import React, { Component } from 'react'
import ReactModal from 'react-modal'
import { Button } from 'react-bootstrap'
import QRCode from 'qrcode.react'
import './ModalQrCode.scss'
import api from '../../utilities/api'
import logoHeader from '../../assets/img/Logo-Header.png'
import { LANG, EM } from '../../constants'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../store/auth/actions'

class ModalQrCode extends Component {
  constructor(props) {
    super(props)
    this.state = {
      messageKey: this.props.messageKey,
      show: this.props.show,
      message: this.props.message,
      data: this.props.data,
      detail: null
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
        messageKey: newProps.messageKey,
        message: newProps.message,
        data: newProps.data,
        detail: newProps.detail
      })
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
    this.props.handleClose('qrcode')
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

  getImage = async () => {
    var htmlToImage = require('html-to-image')
    var node = document.getElementById('qr-job-details')
    var download = require("downloadjs")
    this.props.setParent({isLoading: true})
    
    await htmlToImage.toPng(node)
    .then(function (dataUrl) {
      download(dataUrl, 'jobchoice_qr_share.png')
    }).finally(() => {
      this.verifyPost()
    })
  }

  verifyPost = () => {
    const credentials = {
      isPosted: 'true',
      href: this.state.data[1]+'.qr',
    }

    api.post('api/shared-job', credentials).then(response => {
      if (response.data.status === 200) {
        this.props.setParent({
          qrcode: false,
          isLoading: false,
          modal: {
            message: "Shared successfully",
            modal: true,
            modalType: 'success',
          },
        })
      }
    }).catch(error => {
      this.props.setParent({
        modal: {
          messageKey: 'serverError',
          message: LANG[localStorage.JobChoiceLanguage].serverError,
          modal: true,
          modalType: 'error',
        },
      })
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
        borderRadius: '12px',
        bottom: 'auto',
        left: '50%',
        position: 'fixed',
        right: 'auto',
        top: '50%',
        transform: 'translate(-50%,-' + offsetPx + ')',
        width: '40%',
        maxWidth: '20rem',
        background: 'white'
      }
    }

    return (
      <ReactModal
        isOpen={this.state.show}
        onAfterOpen={this.afterOpenModal}
        onRequestClose={this.handleClose}
        className='dialog'
        style={style}
        overlayClassName='background-dynamic' >
        <div id="qr-job-details" className='dialog__content' ref='content'>
          <div className='qr-header'>
            <img src={logoHeader} width={120} alt="logo"/>
          </div>
          <div className='qr-modal-body'>
            <QRCode value={this.state.data[1]+'.qr'} />
            {this.state.detail && 
              <div className="qr-modal-body-details">
                <div>{LANG[localStorage.JobChoiceLanguage].jobTitle}: <span>{this.state.detail.title}</span></div>
                <div>{LANG[localStorage.JobChoiceLanguage].salary}: <span>{this.state.detail.salary}</span></div>
                <div>{LANG[localStorage.JobChoiceLanguage].address}: <span>{this.state.detail.geolocation.complete_address}</span></div>
                <div>{LANG[localStorage.JobChoiceLanguage].jobType}: <span>{EM[localStorage.JobChoiceLanguage].EMPLOYMENT_PERIOD.find(em => em.value === this.state.detail.employment_period).name}</span></div>
              </div>
            }
          </div>
          <div className='qr-footer'>
            <Button onClick={this.getImage} bsStyle="success">{LANG[localStorage.JobChoiceLanguage].download}</Button>
            <Button bsStyle='danger' onClick={this.handleClose}>{LANG[localStorage.JobChoiceLanguage].close}</Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalQrCode)