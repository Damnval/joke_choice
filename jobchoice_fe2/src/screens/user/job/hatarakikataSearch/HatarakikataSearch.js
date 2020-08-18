import React from 'react'
import './HatarakikataSearch.scss'
import '../../../../utilities/api'
import  { withRouter } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import { LANG } from '../../../../constants'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../../../store/auth/actions'
import HatarakikataChoice from '../../../../components/hatarakikata/hatarakikataChoice/HatarakikataChoice';

class HatarakikataSearch extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      keyword: null,
      status: ''
    }
  }

  handleSubmit = e => {
    e.preventDefault()
    if (this.state.keyword) {
      this.props.history.push({pathname:'/jobs', state:{keyword:this.state.keyword}})
    }
  }

  handleChange = e => {
    e.preventDefault();
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  render() {
    return (
      <div className={`hatarakikata-list-container `+this.props.className+(this.props.data.length === 0?'no-item':'')}>
            {this.props.data &&
              <div className="display-hatarakikata-image-area container">
                <div className="row display-hatarakikata-image-center">
                  {(this.props.data.map((value, key) => {
                    return (
                      <HatarakikataChoice resource={value} key={key} className="hatarakikata-image"/>
                    )}))
                  }
                  {(this.props.data.length === 0) &&
                    <div className="no-hataraki-kata">{ LANG[localStorage.JobChoiceLanguage].noHataSelected }</div>
                  }
                </div>
              </div>
            }
            <div className='hataraki-kata-button-holder'>
              <Button
                className="btn-secondary"
                onClick={() => this.props.Redirect('select')}
              >
              {
                LANG[localStorage.JobChoiceLanguage].changeHata
              }
              </Button>
            </div>
      </div>
    );
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

export default connect(mapStateToProps, mapDispatchToProps)(HatarakikataSearch)
