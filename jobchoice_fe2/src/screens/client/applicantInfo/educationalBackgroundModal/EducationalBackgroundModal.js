import React, { Component } from 'react'
import ReactModal from 'react-modal'
import './EducationalBackgroundModal.scss'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../../../store/auth/actions'
import { LANG, EM } from '../../../../constants'

class EducationalBackgroundModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
          show: this.props.show,
          data: null,
          details: []
        }
        
        this.handleClose = this.handleClose.bind(this)
        this.refs = React.createRef()
    }

    componentDidMount() {
        ReactModal.setAppElement('body')
        this.setState({
          details: this.props.details
        })
     }

    handleClose() {
      this.setState({
        show: false
      }, () => {
        this.props.onClose('educational_background_modal', false)
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
                width: '300px',
                maxWidth: '30rem',
                background: 'white'
            }
        }
        console.log(this.props.details)
        return (
            <ReactModal
                isOpen={this.state.show}
                onAfterOpen={this.afterOpenModal}
                onRequestClose={this.handleClose}
                className='dialog'
                style={style}
                overlayClassName='background-dynamic' >
                <div className='dialog__content' ref='content'>

                    <div className={`educational-modal-header`}>
                      <span>{LANG[localStorage.JobChoiceLanguage].educationalBackground}</span>
                    </div>
                    <div className='modal-body'>
                      {this.state.details.length > 0 ? this.state.details.map((value, key) => {
                        return (
                          <div className="school-row" key={key}>
                          <div className="applicant-school">{value.school}</div>
                          <div className="applicant-month">{value.year}</div> /
                          <div className="applicant-year">{value.month}</div>
                          </div>
                        )
                      }) :
                        <div className="null-data">{LANG[localStorage.JobChoiceLanguage].noEducationBackSet}</div>
                      }
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

export default connect(mapStateToProps, mapDispatchToProps)(EducationalBackgroundModal)
