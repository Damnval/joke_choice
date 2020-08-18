import React, { Component } from 'react'
import ReactModal from 'react-modal'
import { Button } from 'react-bootstrap'
import './HatarakikataSubmitModal.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Redirect } from 'react-router-dom'
import { LANG } from '../../../constants'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../../store/auth/actions'

class HatarakikataSubmitModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
          show: this.props.show,
          message: this.props.message,
          redirect: this.props.redirect,
          redirectNow: false,
          data: null
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
                redirect: newProps.redirect,
                data: newProps.data
            })
        }
    }

    handleClose() {
        this.setState({
          show: false
        }, () => {
          this.props.onClose('career_history_modal', false)
        })
        if (this.state.redirect) {
            this.setState({
                redirectNow: true
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

    render() {
        const padding = 60
        let height = (this.state.contentHeight + padding)
        let heightOffset = height / 2
        let offsetPx = heightOffset + 'px'

        const style = {
            content: {
                border: '0',
                borderRadius: '8px',
                bottom: 'auto',
                left: '50%',
                position: 'fixed',
                right: 'auto',
                top: '50%',
                transform: 'translate(-50%,-50%)',
                width: '400px',
                maxWidth: '30rem',
                background: 'white'
            }
        }

        if (this.state.redirectNow === true && this.state.redirect !== (undefined || null)) {
            return <Redirect to={{pathname:this.state.redirect,
                                  state: (this.state.data)? this.state.data: null
                                }}
                    />
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

                    <div className={`modal-header info-header`}></div>
                    <FontAwesomeIcon 
                        icon='question'
                        className='modal-body-logo info-body'>
                    </FontAwesomeIcon>
                    <div className={`modal-body`}>
                        <div className='modal-info-body-type'>{ LANG[localStorage.JobChoiceLanguage].hatarakikataLine1 }</div>
                        <div className="modal-message info">{ LANG[localStorage.JobChoiceLanguage].hatarakikataLine2 }</div>
                        <div className="modal-message info">{ LANG[localStorage.JobChoiceLanguage].hatarakikataLine3 }</div>
                        <div className="modal-message info">{ LANG[localStorage.JobChoiceLanguage].modalHatarakikataLine4 }</div>
                    </div>
                    <div className={`modal-footer modal-footer-hatarakikata`}>
                        <Button
                            bsStyle={`default`}
                            onClick={this.props.onClose}>
                        { LANG[localStorage.JobChoiceLanguage].continue }
                        </Button>
                        <Button
                            bsStyle={`default`}
                            onClick={this.props.handleSubmit}>
                        { LANG[localStorage.JobChoiceLanguage].btnFinish }
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

export default connect(mapStateToProps, mapDispatchToProps)(HatarakikataSubmitModal)
