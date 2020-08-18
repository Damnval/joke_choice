import React, { Component } from 'react'
import './ClientTopPage.scss'
import JobChoiceLayout from '../../../layouts/jobChoiceLayout/JobChoiceLayout'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../../store/auth/actions'
import { ClearModal, ErrorModal } from '../../../helpers'
import ClientHero1 from './clientHero1/ClientHero1'
import ClientHero2 from './clientHero2/ClientHero2'
import ClientHero3 from './clientHero3/ClientHero3'
import ClientHero4 from './clientHero4/ClientHero4'
import ClientHero5 from './clientHero5/ClientHero5'
import ClientHero6 from './clientHero6/ClientHero6'
import ClientHero7 from './clientHero7/ClientHero7'
import Modal from '../../../components/modal/Modal'

const clearModal = {...ClearModal()}
const errorModal = {...ErrorModal()}

class ClientTopPage extends Component {

  constructor(props) {
    super(props)

    this.state = {
      modal: {
        messageKey: null,
        message: "",
        modal: false,
        modalType: "",
        redirect: null
      },
    }
    this.handleInDevelopment = this.handleInDevelopment.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }

  handleInDevelopment = () => {
    this.setState({ ...clearModal }, () => {
      this.setState({
        modal: {
          messageKey: 'thisIsStillInDevelopment',
          modal: true,
          modalType: 'error',
        }
      })
    })
  }

  handleClose = () => {
    this.setState({ ...clearModal })
  }

  render() {
    
    return (
      <JobChoiceLayout className="min-height" history={this.props.history}>
        <ClientHero1/>
        <ClientHero2/>
        <ClientHero3 handleInDevelopment={this.handleInDevelopment} />
        <ClientHero4/>
        <ClientHero5 handleInDevelopment={this.handleInDevelopment} />
        <ClientHero6/>
        <ClientHero7 handleInDevelopment={this.handleInDevelopment} />
        <Modal
          show={this.state.modal.modal}
          message={this.state.modal.message}
          messageKey={this.state.modal.messageKey}
          type={this.state.modal.modalType}
          redirect={this.state.modal.redirect}
          handleParentClose={this.handleClose}
        />
      </JobChoiceLayout>
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

export default connect(mapStateToProps, mapDispatchToProps)(ClientTopPage)
