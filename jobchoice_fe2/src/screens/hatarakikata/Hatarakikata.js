import React, { Component } from 'react'
import { connect } from 'react-redux'
import { LANG } from '../../constants'
import { bindActionCreators } from 'redux'
import * as authActions from '../../store/auth/actions'
import NotFound from '../404NotFound/404NotFound'
import SaveHatarakikata from './saveHatarakikata/SaveHatarakikata'
import SelectHatarakikata from './selectHatarakikata/SelectHatarakikata'
import RegisterHatarakikata from './registerHatarakikata/RegisterHatarakikata'

class Hatarakikata extends Component {
  constructor(props) {
    super(props)

    this.state = {
      mode: '',
      prevLocation: ''
    }
  }

  componentDidMount() {
    this.setState({
      mode: this.props.location.state ? this.props.location.state.mode : 'save',
      prevLocation: this.props.location.state ? this.props.location.state.prevLocation : '/home'
    })
  }

  render() {
    const mode = this.props.location.state ? this.props.location.state.mode : 'save'
    if (!(this.props.user.data && this.props.user.data.job_seeker) && !this.props.location.state) {
      return <NotFound />
    }
    
    if (mode === 'save') {
      return (
        <SaveHatarakikata
          props={this.props}
          prevLocation={this.state.prevLocation}
          data={this.props.location.state ? this.props.location.state.data : null}/>
      )
    } else if (mode === 'select') {
      return <SelectHatarakikata
                props={this.props}
                prevLocation={this.state.prevLocation}
                history={this.props.history}
                hatarakikata={this.props.location.state.hataraki_kata}/>
    } else if (mode === 'registration') {
      return <RegisterHatarakikata
                props={this.props}
                prevLocation={this.state.prevLocation}
                state={this.props.location.state}
                data={this.props.location.state}
                history={this.props.history}/>
    } else {
      return ''
    }

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

export default connect(mapStateToProps, mapDispatchToProps)(Hatarakikata)
