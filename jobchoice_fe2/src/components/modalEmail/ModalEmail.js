import React, { Component } from 'react'
import ReactModal from 'react-modal'
import { Button } from 'react-bootstrap'
import './ModalEmail.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ReactMultiEmail, isEmail } from 'react-multi-email'
import 'react-multi-email/style.css'
import api from '../../utilities/api'
import { LANG, EM } from '../../constants'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../store/auth/actions'

interface IProps {}
interface IState {
  to: string[];
}
class ModalEmail extends Component<IProps, IState> {
  constructor(props) {
    super(props)
    this.state = {
      show: this.props.show,
      data: this.props.data,
      detail: this.props.detail,
      to: [],
      info: {
        to: [],
        subject: "オススメのお仕事シェアです！",
        body: "Greetings! A new job has presented itself. I'd like to share it to you. Go to the address below: ",
        user_id: null,
        url: null,
        from_user: this.props.user.data.last_name + ' ' + this.props.user.data.first_name,
        from_email: this.props.user.data.email,
      },
      defaultMessage: {
        subject: "オススメのお仕事シェアです！",
        body: "Greetings! A new job has presented itself. I'd like to share it to you. Go to the address below: ",
      },
      formError: {
        to: ""
      }
    }
    
    this.handleClose = this.handleClose.bind(this)
    this.handleBeforeSubmit= this.handleBeforeSubmit.bind(this)
    this.handleSubmit= this.handleSubmit.bind(this)
    this.refs = React.createRef()
  }

  componentDidMount() {
    ReactModal.setAppElement('body')

  }

  componentWillReceiveProps(newProps){
    if(newProps.show !== this.state.show){
        this.setState({
            show: newProps.show,
            data: newProps.data,
            detail: newProps.detail,
            to: [],
            defaultMessage: {
              subject: "オススメのお仕事シェアです！",
              body: "みんなで届けるシェア型求人「JOBチョイス」から、オススメのお仕事をシェア！\n"+
              `求人タイトル：【【${newProps.detail.title}】】\n`+
              `給与：【【${newProps.detail.salary}円】】\n`+
              `勤務地：【【${newProps.detail.geolocation.complete_address}】】\n`+
              `職種：【【${EM[localStorage.JobChoiceLanguage].EMPLOYMENT_TYPE.find(el => el.value === newProps.detail.employment_type).name}】】}\n`+
              "気になった方は下記から確認！\n"+
              `【【 ${this.props.data[1]}.email 】】\n`+
              "更にシェアであなたにもシェアマネーゲットのチャンス★",
            },
            info: {
              ...this.state.info,
              body: "みんなで届けるシェア型求人「JOBチョイス」から、オススメのお仕事をシェア！\n"+
              `求人タイトル：【【${newProps.detail.title}】】\n`+
              `給与：【【${newProps.detail.salary}円】】\n`+
              `勤務地：【【${newProps.detail.geolocation.complete_address}】】\n`+
              `職種：【【${EM[localStorage.JobChoiceLanguage].EMPLOYMENT_TYPE.find(el => el.value === newProps.detail.employment_type).name}】】}\n`+
              "気になった方は下記から確認！\n"+
              `【【 ${this.props.data[1]}.email 】】\n`+
              "更にシェアであなたにもシェアマネーゲットのチャンス★",
            }
        })
    }
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

  handleChange = e => {
    e.preventDefault()

    if(this.state.to.length < 1) {
      this.setState({
        formError: {
          to: "Emails should not be empty"
        }
      })
    }

    this.setState({ 
      info: { 
        ...this.state.info,
        [e.target.name]: e.target.value
      } 
    })
  }

  handleChangeTo = e => {
    e.preventDefault()

    if(this.state.to.length < 1) {
      this.setState({
        formError: {
          to: "Emails should not be empty"
        }
      })
    }

    this.setState({ 
      [e.target.name]: e.target.value 
    })
  }

  handleClose() {
    this.setState({
      show: false,
      info: {
        to: [],
        subject: "JobChoice - Available Job",
        body: "Greetings! A new job has presented itself. I'd like to share it to you. Go to the address below: ",
        user_id: null,
        url: null,
      },
    })

    this.props.closed(false)
  }

  handleBeforeSubmit = () => {
    this.setState({
      formError: {
        to: ""
      }
    })

    if(this.state.info.subject.length < 1) {
      this.setState({
        info: {
          ...this.state.info,
          subject: this.state.defaultMessage.subject
        }
      })
    }

    if(this.state.info.body.length < 1) {
      this.setState({
        info: {
          ...this.state.info,
          body: this.state.defaultMessage.body
        }
      })
    }

    this.handleUrl()
  }

  handleUrl() {
    this.setState({
      info: {
        ...this.state.info,
        user_id: this.props.data[0],
        url: this.props.data[1]+'.email',
        to: this.state.to
      }
    }, () => {
      this.handleSubmit()
    })
  }

  handleSubmit() {
    const parenter = this.props.setParent
    const credentials = {
      isPosted: 'true',
      href: this.props.data[1]+'.email',
    }

    parenter({
      isLoading: true,
    })

    api.post('api/share/email', this.state.info).then(response => {
      if (response.data.status === 200) {
        api.post('api/shared-job', credentials).then(response => {
          if (response.data.status === 200) {
            this.setState({
              show: false
            })
            this.props.closed(false)
            parenter({
              modal: {
                messageKey: 'sharedViaEmailSuccess',
                message: LANG[localStorage.JobChoiceLanguage].sharedViaEmailSuccess,
                modal: true,
                modalType: 'success',
              },
              isLoading: false,
            })
          }
        }).catch(error => {
          console.log(error)
          parenter({
            modal: {
              messageKey: 'serverError',
              message: LANG[localStorage.JobChoiceLanguage].serverError,
              modal: true,
              modalType: 'error',
            },
            isLoading: false,
          })
        })
      }
    }).catch(error => {
      console.log(error)
      parenter({
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
    let heightPx = height + 'px'
    let heightOffset = height / 2
    let offsetPx = heightOffset + 'px'

    const style = {
      content: {
        border: '0',
        borderRadius: '4px',
        bottom: 'auto',
        height: heightPx,
        left: '50%',
        position: 'fixed',
        right: 'auto',
        top: '50%',
        transform: 'translate(-50%,-' + offsetPx + ')',
        width: '50%',
        maxWidth: '70rem',
        background: 'white'
      }
    }

    const { to } = this.state.info;

      return (
        <ReactModal
          isOpen={this.state.show}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.handleClose}
          className='dialog'
          style={style}
          overlayClassName='background-dynamic' >
          <div className='dialog__content' ref='content'>

            <div className="modalEmail-header"></div>
            <div className='modalEmail-body'>
              <div className="modalEmail-input-top">
                <span>{LANG[localStorage.JobChoiceLanguage].modalEmailShareEmail}</span>
                <FontAwesomeIcon icon="envelope" />
              </div>
              <div className="modalEmail-input-indiviudal">
                <label htmlFor="receiver">{LANG[localStorage.JobChoiceLanguage].modalEmailTo}: </label>
                <ReactMultiEmail
                  className="modalEmail-input-individiual-email"
                  to={this.state.to}
                  onChange={(_to: string[]) => {
                    this.setState({ 
                      to: _to 
                    });
                  }}
                  validateEmail={email => {
                    return isEmail(email); // return boolean
                  }}
                  getLabel={(
                    email: string,
                    index: number,
                    removeEmail: (index: number) => void,
                  ) => {
                    return (
                      <div data-tag key={index}>
                        {email}
                        <span data-tag-handle onClick={() => removeEmail(index)}>
                          ×
                        </span>
                      </div>
                    );
                  }}
                />
              </div>
              {this.state.to.length === 0 ?
                <div className="error-messager">{LANG[localStorage.JobChoiceLanguage].modalEmailRequireEmail}</div> :
                <div className="error-noner"></div>
              }
              <div className="modalEmail-input-indiviudal">
                <label htmlFor="subject">{LANG[localStorage.JobChoiceLanguage].modalEmailSubject}: </label>
                <input
                  type="text"
                  name="subject"
                  defaultValue={this.state.defaultMessage.subject}
                  onChange={this.handleChange}
                  maxLength="50"
                />
              </div>
              {this.state.info.subject.length === 0 ?
                <div className="error-messager">{LANG[localStorage.JobChoiceLanguage].modalEmailRequireSubject}</div> :
                <div className="error-noner"></div>
              }
              <div className="modalEmail-from-text">
                <label>{LANG[localStorage.JobChoiceLanguage].sharedBy}: </label><span>{this.props.user.data.last_name} {this.props.user.data.first_name}</span><br/>
                <span>{this.props.user.data.email}</span>
              </div>
              <div className="modalEmail-input-indiviudal-text">
                <textarea
                  name="body"
                  defaultValue={this.state.defaultMessage.body}
                  onChange={this.handleChange}
                />
                <span>{this.props.data[1]}</span>
              </div>
              {this.state.info.body.length === 0 ?
                <div className="error-messager">{LANG[localStorage.JobChoiceLanguage].modalEmailRequireBody}</div> :
                <div className="error-noner"></div>
              }
            </div>
            <div className='modalEmail-footer'>
              <Button
                className="modalEmail-back"
                onClick={this.handleClose}
                bsStyle="danger"
              >
                <span>{LANG[localStorage.JobChoiceLanguage].modalEmailBackBtn}</span>
              </Button>
              <Button
                disabled={
                  this.state.to.length === 0 || 
                  this.state.info.body.length === 0 || 
                  this.state.info.subject.length === 0}
                className="modalEmail-send"
                bsStyle="default"
                onClick={this.handleBeforeSubmit}
              >
                <span>{LANG[localStorage.JobChoiceLanguage].modalEmailSendBtn}</span>
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalEmail)
