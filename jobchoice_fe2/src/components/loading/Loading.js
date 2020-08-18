import React, { Component } from 'react'
import ReactModal from 'react-modal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './Loading.css'

class Loading extends Component {
    constructor(props) {
        super(props)
        this.state = {
          show: this.props.show
        }
    }

    componentWillMount() {
        ReactModal.setAppElement('body')
    }

    componentWillReceiveProps(newProps){
        if(newProps.show !== this.props.show){
            this.setState({
                show: newProps.show
            })
        }
    }

    render() {
        return (
            <ReactModal
                isOpen={this.state.show}
                shouldCloseOnOverlayClick={false}
                shouldCloseOnEsc={false}
                className='div-loading'
                overlayClassName='background-loading' >
                <FontAwesomeIcon icon='spinner' spin></FontAwesomeIcon>
            </ReactModal>
        )
    }

}

export default Loading
