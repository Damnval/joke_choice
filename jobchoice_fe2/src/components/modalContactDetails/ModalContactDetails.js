import React, { Component } from 'react'
import ReactModal from 'react-modal'
import { Button } from 'react-bootstrap'
import { Redirect } from 'react-router-dom'
import './ModalContactDetails.scss'
import { LANG, EM } from '../../constants'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../store/auth/actions'

class Modal extends Component {
    constructor(props) {
        super(props)
        this.state = {
          show: this.props.show,
          data: this.props.data,
          redirect: this.props.redirect,
          redirectNow: false,
        }
        
        this.handleClose = this.handleClose.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.refs = React.createRef()
    }

    componentDidMount() {
        ReactModal.setAppElement('body')
     }

    componentWillReceiveProps(newProps){
        if(newProps.show !== this.props.show){
            this.setState({
                show: newProps.show,
                data: newProps.data,
                redirect: newProps.redirect,
            }, () => {
                console.log(EM[localStorage.JobChoiceLanguage].CATEGORY_OPTION_1.filter(function (cat) {return cat.value === 'How to use this Site'})[0].name)
            })
        }
    }

    handleClose() {
        this.setState({
          show: false
        })
        this.props.closeModal()

        if (this.state.redirect) {
            this.setState({
                redirectNow: true
            })
        }
    }

    handleSubmit() {
        this.props.handleSubmit()
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
                borderRadius: '4px',
                bottom: 'auto',
                height: heightPx,
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

        const inquiry = this.state.data[0].inquirer
        const type = this.state.data[0].type

        const inquirer = EM[localStorage.JobChoiceLanguage].INQUIRER_OPTION.filter(function(el) {
            return (el.value === inquiry) ? el : null
          })[0]

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
                className='dialog contact_modal'
                style={style}
                overlayClassName='background-dynamic' >
                <div className='dialog__content' ref='content'>

                    <div className='contactModal-header'></div>
                    <div className='contactModal-body'>
                        <div className='contactModal-body-top'>
                            <span id='larger'>{ LANG[localStorage.JobChoiceLanguage].inquiryModalHeaderFirstMessage }</span>
                            <span id='smaller'>{ LANG[localStorage.JobChoiceLanguage].inquiryModalHeaderSecondMessage }</span>
                        </div>
                        <div className='contactModal-body-details'>
                            <div className="contactModal-body-details-individual">
                                <span className="contactModal-details-title">{ LANG[localStorage.JobChoiceLanguage].inquirer }: </span>
                                <div className="contactModal-details-text"><span>{ inquirer ? inquirer.name : '' }</span></div>
                            </div>
                            <div className="contactModal-body-details-individual">
                                <span className="contactModal-details-title">{ LANG[localStorage.JobChoiceLanguage].inquirerName }: </span>
                                <div className="contactModal-details-text"><span>{this.state.data[0].name}</span></div>
                            </div>
                            <div className="contactModal-body-details-individual">
                                <span className="contactModal-details-title">{ LANG[localStorage.JobChoiceLanguage].typeOfInquiry }: </span>
                                <div className="contactModal-details-text">
                                    <span>
                                        {
                                            this.state.data[0].type.length > 0 ?
                                                this.state.data[0].inquirer === "job_seeker/sharer" ?
                                                EM[localStorage.JobChoiceLanguage].CATEGORY_OPTION_1.filter(function (cat) {return cat.value === type})[0].name :
                                                EM[localStorage.JobChoiceLanguage].CATEGORY_OPTION_2.filter(function (cat) {return cat.value === type})[0].name
                                            :   ''
                                        }
                                    </span>
                                </div>
                            </div>
                            <div className="contactModal-body-details-individual">
                                <span className="contactModal-details-title">{ LANG[localStorage.JobChoiceLanguage].emailAddress }: </span>
                                <div className="contactModal-details-text"><span>{this.state.data[0].email}</span></div>
                            </div>
                            <div className="contactModal-body-details-individual">
                                <span className="contactModal-details-title">{ LANG[localStorage.JobChoiceLanguage].contactNo }: </span>
                                {this.state.data[1].length > 0 ?
                                    <div className="contactModal-details-text"><span>{this.state.data[1]}</span></div> :
                                    <div className="contactModal-details-text"><span id="non-provided">{ LANG[localStorage.JobChoiceLanguage].noneProvided }</span></div>
                                }
                            </div>
                            <div className="contactModal-body-details-individual">
                                <span className="contactModal-details-title">{ LANG[localStorage.JobChoiceLanguage].inquiryDetail }: </span>
                                <div id="contact-long-details">{this.state.data[0].details}</div>
                            </div>
                        </div>
                    </div>
                    <div className='contactModal-footer'>
                        <Button
                            className='contact-button contact-cancel'
                            onClick={this.handleClose}>
                        { LANG[localStorage.JobChoiceLanguage].cancel }
                        </Button>
                        <Button
                            className='contact-button contact-continue'
                            onClick={this.handleSubmit}>
                        { LANG[localStorage.JobChoiceLanguage].submit }
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
