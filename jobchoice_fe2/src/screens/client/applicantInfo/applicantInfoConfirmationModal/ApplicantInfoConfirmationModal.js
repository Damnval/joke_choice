import React, { Component } from 'react'
import ReactModal from 'react-modal'
import { Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { LANG } from '../../../../constants'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../../../store/auth/actions'

class ApplicantInfoConfirmationModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
          show: this.props.show,
          message: this.props.message,
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
            })
        }
    }

    handleClose() {
        this.setState({
          show: false
        })
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
        let heightPx = height + 'px'
        let heightOffset = height / 2
        let offsetPx = heightOffset + 'px'

        const style = {
            content: {
                border: '0',
                borderRadius: '6px',
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
                className='confirmation-modal'
                overlayClassName='background-dynamic' >
                <div className='dialog__content' ref='content'>

                    <div className="modal-header confirmation-header"></div>
                    <FontAwesomeIcon 
                        icon='question-circle' 
                        className='confirmation-modal-icon'>
                    </FontAwesomeIcon>
                    <div className='modal-body'>
                        <span className="confirmation-modal-message">
                          { 
                            this.state.message === "areYouSureReject" ?
                            LANG[localStorage.JobChoiceLanguage][this.state.message] :
                            LANG[localStorage.JobChoiceLanguage].discloseMsg1 + this.props.disclosureFee + LANG[localStorage.JobChoiceLanguage].discloseMsg2
                          }
                        </span>
                    </div>
                    <div className='modal-footer-confirmation'>
                        <Button
                            className="btn-modal-footer"
                            bsStyle={`success`}
                            onClick={this.props.handleSuccess}>
                        { this.state.message === "areYouSureReject" ?
                            LANG[localStorage.JobChoiceLanguage].rejectButtonApplicantInfo :
                            LANG[localStorage.JobChoiceLanguage].disclosureBtn}
                        </Button>
                        <Button
                            className="btn-modal-footer"
                            bsStyle={'danger'}
                            onClick={this.handleClose}>
                        { LANG[localStorage.JobChoiceLanguage].cancel }
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

export default connect(mapStateToProps, mapDispatchToProps)(ApplicantInfoConfirmationModal)
