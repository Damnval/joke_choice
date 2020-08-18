import React, { Component } from 'react'
import ReactModal from 'react-modal'
import { Button } from 'react-bootstrap'
import './ModalTwitter.scss'
import api from '../../utilities/api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import InputTextArea from '../inputTextArea/InputTextArea'
import { LANG } from '../../constants'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../store/auth/actions'

class ModalTwitter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      show: this.props.show,
      message: this.props.message,
      data: this.props.data,
      share_text: '',
      twitterAuth: this.props.twitterAuth
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
        twitterAuth: newProps.twitterAuth
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
    this.props.handleClose('twitter')
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

  twitterPost = async () => {
    const credentials = {
      status: `${this.state.data[1]}.twitter ${this.state.share_text}`,
      oauth_token: this.state.twitterAuth.oauth_token,
      oauth_token_secret: this.state.twitterAuth.oauth_token_secret
    }
    this.props.setParent({isLoading: true})
    await api.post('api/auth/twitter/post', credentials).then(response => {
      if (response) {
        this.verifyPost()
      }
    }).catch(error => {
      console.log('error')
    })
  }

  verifyPost = () => {
    const credentials = {
      isPosted: 'true',
      href: this.state.data[1]+'.twitter',
      provider: 'twitter'
    }
    api.post('api/shared-job', credentials).then(response => {
      if (response.data.status === 200) {
        this.props.setParent({
          twitter: false,
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
        maxWidth: '30rem',
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
        <div className='dialog__content' ref='content'>
          <div className='twitter-header'>
          <FontAwesomeIcon icon={['fab', 'twitter']}  size="2x" />
          <Button onClick={this.handleClose}>
            <FontAwesomeIcon className="close-btn" icon={['fa', 'times']}  size="1x" />
          </Button>
          </div>
          <div className='twitter-body'>
            <span>Share with your followers</span>
            <div className="twitter-link">{this.state.data[1]+'.twitter'}</div>
            <InputTextArea
              field="share_text"
              noValidate
              onChange={this.handleChange}
            />
            <div className="send-div">
            <Button
              className="twitter-button"
              bsStyle='info'
              onClick={this.twitterPost}>
              Tweet
            </Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalTwitter)
