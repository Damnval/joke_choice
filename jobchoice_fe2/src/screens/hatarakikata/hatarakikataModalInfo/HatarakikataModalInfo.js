import React, { Component } from 'react'
import ReactModal from 'react-modal'
import './HatarakikataModalInfo.scss'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../../store/auth/actions'
import { LANG } from '../../../constants'

class HatarakikataModalInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
          show: this.props.show,
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
        })
      }
    }

    handleClose() {
      this.setState({
        show: false
      }, () => {
        this.props.onClose('career_history_modal', false)
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
                      <span>{LANG[localStorage.JobChoiceLanguage].whatIsHatarakikata}</span>
                    </div>
                    <div className='modal-body'>
                      <div className="null-data">{LANG[localStorage.JobChoiceLanguage].hatarakikataIsWayOfWork}</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(HatarakikataModalInfo)
