import React, { Component } from 'react'
import '../CreateJob.scss'
import { LANG } from '../../../../constants'
import ReactModal from 'react-modal'
import { Button } from 'react-bootstrap'
import HatarakikataChoice from '../../../../components/hatarakikata/hatarakikataChoice/HatarakikataChoice'

class CreateJobHatarakikata extends Component {
  constructor(props) {
    super(props)

    this.state = {
      show: this.props.show,
      hatarakikata: this.props.hatarakikata,
      userHatarakikataNum: 0,
      userHatarakikata: [],
      error: "You must choose 4"
    }

    this.handleClose = this.handleClose.bind(this)
    this.refs = React.createRef()
  }

  componentDidMount() {
    ReactModal.setAppElement('body')
  }

  handleClose() {
    this.setState({show: false})
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

  onClickCard = (id) => {
    this.setState({
      error: "You must choose 4"
    }, () => {
      if (!this.state.userHatarakikata.includes(id) && this.state.userHatarakikata.length < 4) {
        this.setState({
          userHatarakikata: [...this.state.userHatarakikata, id],
          userHatarakikataNum: this.state.userHatarakikataNum + 1,
        })
      } else if (!this.state.userHatarakikata.includes(id) && this.state.userHatarakikata.length === 4) {
        this.setState({
          error: "You've reached the maximum number of preferences."
        })
      } else {
        this.setState({
          userHatarakikata: this.state.userHatarakikata.filter(el => el !== id),
          userHatarakikataNum: this.state.userHatarakikataNum - 1,
          error: "You must choose 4"
        })
      }
    })
  }

  hatarakikataOk = () => {
    this.props.handleHatarakikata(this.props.fieldName, this.state.userHatarakikata)
    this.setState({show: false})
  }

  hatarakikataCancel = () => {
    this.props.handleHatarakikata(this.props.fieldName, "")
    this.setState({show: false})
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
        left: '25%',
        position: 'fixed',
        right: 'auto',
        top: '20%',
        width: '60%',
        maxWidth: '50rem',
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
        overlayClassName='background-dynamic'
        shouldCloseOnOverlayClick={false}
      >
        <div className='dialog__content' ref='content'>
          <div className="form-box no-border">
            <div className="createJob-titleArea">
              <div className="createJob-title"><p className="box-title">{ LANG[localStorage.JobChoiceLanguage].addHatarakikata }</p></div>
              <div className="createJob-message">
                <span>{this.state.error}</span>
                <span className="createJob-counterMessage"> ({this.state.userHatarakikataNum} / 4)</span>
              </div>
            </div>
            <div className='hatarakikata-set createJob-hatarakikata-modal'>
              {(this.state.hatarakikata) && (this.state.hatarakikata.map((value, key) => {
                return (
                  <HatarakikataChoice
                    key={key}
                    className={`hatarakikata-image${this.state.userHatarakikata.includes(value.id)?' active':''}`}
                    resource={value}
                    onClickCard={()=>{this.onClickCard(value.id)}}
                  />
                )
              }))}
            </div>
            <div className="createJob-hatarakikata-modal-lower">
              <Button
                className="createJob-hatarakikata-btn"
                id="createJob-btnCancel"
                onClick={()=>{this.hatarakikataCancel()}}
              >
                <span>Cancel</span>
              </Button>
              <Button
                className="createJob-hatarakikata-btn"
                id="createJob-btnOk"
                onClick={()=>{this.hatarakikataOk()}}
                disabled={this.state.userHatarakikataNum !== 4}
              >
                <span>OK</span>
              </Button>
            </div>
          </div>
        </div>
    </ReactModal>
    )
  }
}

export default CreateJobHatarakikata
