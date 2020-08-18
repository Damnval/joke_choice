import React, { Component } from 'react'
import ReactModal from 'react-modal'
import { Button } from 'react-bootstrap'
import './ModalSNS.scss'
import api from '../../utilities/api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FacebookProvider } from 'react-facebook'
import TwitterAuthentication from '../twitterAuthentication/TwitterAuthentication'
import {CopyToClipboard} from 'react-copy-to-clipboard'
import { LANG } from '../../constants'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../store/auth/actions'
import { FB_ID } from '../../constants'

class ModalSNS extends Component {
  constructor(props) {
    super(props)
    this.state = {
      show: this.props.show,
      messageKey: this.props.messageKey,
      message: this.props.message,
      data: this.props.data,
      emailShow: false,
      hasCopied: false,
      viewingInMobile: false,
    }

    this.handleClose = this.handleClose.bind(this)
    this.refs = React.createRef()
    this.shareTwitter = this.shareTwitter.bind(this)
  }

  componentDidMount() {
    this.setState({
      viewingInMobile: typeof window.orientation !== "undefined" || navigator.userAgent.indexOf('IEMobile') !== -1
    })
    ReactModal.setAppElement('body')
  }

  componentWillReceiveProps(newProps){
    if(newProps.show !== this.props.show){
      this.setState({
        show: newProps.show,
        messageKey: newProps.messageKey,
        message: newProps.message,
        data: newProps.data
      })
    }
  }

  handleChange = (newInput) => {this.setState(newInput)}

  handleClose() {
    this.props.handleClose('share')
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

   shareFB =  () => {
    const link = this.state.data[1]+'.facebook'
    const modal = this.props.setParent

    window.FB.ui({
      method: 'share',
      href: link,
    }, function(response){
      if (response) {
        const credentials = {
          isPosted: 'true',
          href: link,
        }

        api.post('api/shared-job', credentials).then(response => {
          if (response.data.status === 200) {
            modal({
              modal: {
                message: "Shared successfully",
                modal: true,
                modalType: 'success',
              },
            })
          }
        }).catch(error => {
          modal({
            modal: {
              messageKey: 'serverError',
              message: LANG[localStorage.JobChoiceLanguage].serverError,
              modal: true,
              modalType: 'error',
            },
          })
        })
      } else {
        console.log('Not posted')
      }
    })
  }

  shareTwitter = (credentials) => {
    this.props.setParent({
      twitter: true,
      share: false,
      twitterAuth: credentials
    })
  }

  showEmail = () => {
    this.props.handleShowEmail(true)
  }

  copyToClipboard = () => {
    this.props.setParent({
      isLoading: true
    })
    const credentials = {
      isPosted: 'true',
      href: this.state.data[1]+'.clipboard',
    }
    api.post('api/shared-job', credentials).then(response => {
      if (response.data.status === 200) {
        this.setState({
          hasCopied: !this.state.hasCopied
        }, () => {
          this.props.setParent({
            isLoading: false
          })
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
        isLoading: false
      })
    })
  }

  qrGenerate = () => {
    this.props.setParent({
      qrcode: true,
      share: false
    })
  }

  shareLine = () => {
    const href = this.state.data[1]+'.line'
    const link = 'https://social-plugins.line.me/lineit/share?url=' + href
    const form = window.open(link, '_blank')
    const modal = this.props.setParent

    var timer = setInterval(function() {
      if(form.closed) {
        clearInterval(timer);
        const credentials = {
          isPosted: 'true',
          href: href,
        }
        api.post('api/shared-job', credentials).then().catch(error => {
          modal({
            modal: {
              message: LANG[localStorage.JobChoiceLanguage].serverError,
              modal: true,
              modalType: 'error',
            },
          })
        })

      }
    }, 1000)
  }

  shareSMS = () => {
    const href = this.state.data[1]+'.sms'
    const modal = this.props.setParent
    const credentials = {
      isPosted: 'true',
      href: href,
    }

    api.post('api/shared-job', credentials).then().catch(error => {
      modal({
        modal: {
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
    const sms = navigator.platform === 'iPhone' ? 'sms:&body='+this.state.data[1]+'sms' : 'sms:?body='+this.state.data[1]+'sms'

    return (
      <ReactModal
        isOpen={this.state.show}
        onAfterOpen={this.afterOpenModal}
        onRequestClose={this.handleClose}
        className='dialog sns-modal'
        overlayClassName='background-dynamic' >
        <div className='dialog__content' ref='content'>
          <div className='sns-modal-body'>
            {!this.props.user.bankInfo &&
              <div className='shared-job-date-search-row notice shared-job-notice'>
                { LANG[localStorage.JobChoiceLanguage].shareModalError }
              </div>}
            <span>
              { LANG[localStorage.JobChoiceLanguage].chooseWhereToShare }
            </span>
            <div className='sns-modal-body-logo'>
                {this.state.viewingInMobile === true &&
                  <Button className="sms" href={sms} onClick={this.shareSMS}>
                    <FontAwesomeIcon icon={['fa', 'sms']}  size="1x" />
                  </Button>
                }
                <FacebookProvider appId={FB_ID}>
                  <Button
                    className="facebook"
                    onClick={this.shareFB}>
                    <FontAwesomeIcon icon={['fab', 'facebook']}  size="2x" />
                  </Button>
                </FacebookProvider>
                <TwitterAuthentication
                  setParent={this.handleChange}
                  twitterLogin={this.shareTwitter}
                  type='share'
                />
                <Button id='line' onClick={this.shareLine}>
                  <FontAwesomeIcon icon={['fab', 'line']}  size="2x" />
                </Button>
                <Button
                  className="email-share"
                  onClick={this.showEmail}
                >
                  <FontAwesomeIcon icon="envelope" />
                </Button>
            </div>
            <div className="flex-column-center">
              <Button className="btn-dark qr" onClick={this.qrGenerate}>
                <FontAwesomeIcon icon={['fa', 'qrcode']}  size="2x" />
                <span>{ LANG[localStorage.JobChoiceLanguage].qrCode }</span>
              </Button>
            </div>
            <p className="clipboard-desc">
              { LANG[localStorage.JobChoiceLanguage].orCopyLinkBelow }
            </p>
            <div className="clipboard-link">{this.state.data[1]+'.clipboard'}</div>
            <CopyToClipboard text={this.state.data[1]+'.clipboard'}
              onCopy={this.copyToClipboard}>
              <Button className="btn-secondary" bsSize="sm">{ LANG[localStorage.JobChoiceLanguage].copyToClipBoard }</Button>
            </CopyToClipboard>
          </div>
          <div className='modal-footer'>
            <Button
              onClick={this.handleClose}>
              {LANG[localStorage.JobChoiceLanguage].modalEmailBackBtn}
            </Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalSNS)
