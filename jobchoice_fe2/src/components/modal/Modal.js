import React, { Component } from 'react'
import ReactModal from 'react-modal'
import { Button } from 'react-bootstrap'
import './Modal.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Redirect, Link } from 'react-router-dom'
import { LANG } from '../../constants'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../store/auth/actions'

class Modal extends Component {
    constructor(props) {
        super(props)
        this.state = {
          language: this.props.language,
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
        if(newProps.show !== this.props.show || this.state.language !== localStorage.JobChoiceLanguage){
            this.setState({
                language: localStorage.JobChoiceLanguage,
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
        })

        // Check redirect link first before clearing modal attributes
        if (this.state.redirect) {
            this.setState({
                redirectNow: true
            })
        } else if (this.props.handleParentClose) {
            this.props.handleParentClose()
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
                borderRadius: '4px',
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
                className= {`dialog ${ this.props.registrationType } ${this.props.type === 'success' ? 'registration-modal-success ' : 'registration-modal-error'}`}
                style={style}
                overlayClassName='background-dynamic' >
                <div className='dialog__content' ref='content'>
                    <div className={`modal-header ${this.props.type === 'success' ? 'success-header' : 'error-header'}`}></div>
                    <FontAwesomeIcon 
                        icon={`${this.props.type === 'success' ? 'check' : 'exclamation'}`} 
                        className={`modal-body-logo ${this.props.type === 'success' ? 'success-body' : 'error-body'}`}>
                    </FontAwesomeIcon>
                    <div className={`modal-body ${this.props.type === 'success' ? 'success-body' : 'error-body'}`}>
                        <div className='modal-body-type'>{`${this.props.type === 'success' ? '' : LANG[localStorage.JobChoiceLanguage].error}`}</div>
                        <span className="modal-message">
                            {this.props.messageKey ?  LANG[localStorage.JobChoiceLanguage][this.props.messageKey] : this.props.message}
                            {(this.props.link && this.props.to) && 
                                <div>
                                    <Link to={this.props.to}>{this.props.link}</Link>
                                </div>
                            }
                        </span>
                    </div>
                    <div className={`modal-footer ${this.props.type === 'success' ? 'success-body' : 'error-body'}`}>
                        <Button
                            bsStyle={`default`}
                            onClick={this.handleClose}>
                        { LANG[localStorage.JobChoiceLanguage].continue }
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

export default connect(mapStateToProps, mapDispatchToProps)(Modal)
