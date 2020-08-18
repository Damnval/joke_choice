import React, { Component } from 'react'
import ReactModal from 'react-modal'
import './RegisterHatarakikataModal.scss'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../../../../../store/auth/actions'
import { Button } from 'react-bootstrap'
import { LANG } from '../../../../../../constants'

class RegisterHatarakikataModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
          show: this.props.show,
          data: null,
          redirect: null
        }
        
        this.handleClose = this.handleClose.bind(this)
        this.handleCancel = this.handleCancel.bind(this)
        this.refs = React.createRef()
    }

    componentDidMount() {
        ReactModal.setAppElement('body')
     }

     componentWillReceiveProps(newProps){
      if(newProps.show !== this.props.show){
        this.setState({
          show: newProps.show,
        })
      }
    }

    handleClose() {
      this.props.Redirect('/hatarakikata')
    }

    handleCancel() {
      this.props.Redirect(`/register/form/2/${this.props.token}`)
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

        return (
            <ReactModal
                isOpen={this.state.show}
                onAfterOpen={this.afterOpenModal}
                onRequestClose={this.handleClose}
                className='dialog hatarakikata-registration-modal'
                overlayClassName='background-dynamic' >
                <div className='dialog__content' ref='content'>
                    <div className='modal-body'>
                        <div className='hatarakikata-modal-title'>{LANG[localStorage.JobChoiceLanguage].hataMessageInfo1}</div>
                        <div className="hatarakikata-modal-message">
                          {LANG[localStorage.JobChoiceLanguage].hataMessageInfo2}
                        </div>
                    </div>
                    <div className="hatarakikata-modal-footer">
                      <Button
                          bsStyle='warning'
                          onClick={this.handleClose}>
                        {LANG[localStorage.JobChoiceLanguage].hataMessageInfo3}
                      </Button>
                      <div className="align-self-right">
                        <Button
                            bsStyle='default'
                            onClick={this.handleCancel}>
                          {LANG[localStorage.JobChoiceLanguage].skipIsPossible}
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

export default connect(mapStateToProps, mapDispatchToProps)(RegisterHatarakikataModal)
