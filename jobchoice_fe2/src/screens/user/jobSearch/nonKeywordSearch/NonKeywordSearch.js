import React from 'react'
import './../JobSearch.css'
import api from '../../../../utilities/api'
import { Link } from 'react-router-dom'
import Modal from '../../../../components/modal/Modal'
import LoadingIcon from '../../../../components/loading/Loading'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Redirect } from 'react-router-dom'
import { LANG } from '../../../../constants'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../../../store/auth/actions'

class NonKeywordSearch extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      categories: [],
      results: [],
      typingTimeout: 0,
      isLoading: false,
      isSearching: false,
      search: {
        area: null,
        route: null,
        occupation: null,
      },
      modal: {
        messageKey: null,
        message: '',
        modal: false,
        modalType: '',
        redirect: null,
      },
    }
  }

  componentDidMount() {
    this.setState({
      isLoading: true
    })
    api.get('api/job-category').then(response => {
      if (response.status === 200) {
        this.setState({
          categories: response.data.results.jobs,
          isLoading: false
        })
      } else {
        this.setState({ 
          modal: {
            messageKey: 'pleaseTryAgain',
            message: LANG[localStorage.JobChoiceLanguage].pleaseTryAgain,
            modal: true,
            modalType: 'error',
            redirect: '/'
          },
          isLoading: false
        })
      }
    }).catch(error => {
      console.log(error)
      this.setState({
        modal: {
          messageKey: 'serverError',
          message: LANG[localStorage.JobChoiceLanguage].serverError,
          modal: true,
          modalType: 'error',
          redirect: '/',
        },
        isLoading: false
      })
    })
  }

  handleInputChange = event => {
    const type = event.target.name
    const search = this.state.search

    search[type] = event.target.value

    if (this.state.typingTimeout) {
      clearTimeout(this.state.typingTimeout);
     }

    // Delay Search after last input
    this.setState({
      search: search,
      isSearching: true,
    }, () => setTimeout(this.onSearchFunction, 1000))
  }


  // Function on Search
  onSearchFunction = () => {
    api.post('api/job/search', this.state.search).then(response => {
      if (response.status === 200) {
        this.setState({
          results: response.data.results.jobs,
          isSearching: false
        })
      } else {
        this.setState({ 
          modal: {
            messageKey: 'pleaseTryAgain',
            message: LANG[localStorage.JobChoiceLanguage].pleaseTryAgain,
            modal: true,
            modalType: 'error',
            redirect: '/'
          },
          isLoading: false
        })
      }
    }).catch(error => {
      console.log(error)
      this.setState({
        modal: {
          messageKey:'serverError',
          message: LANG[localStorage.JobChoiceLanguage].serverError,
          modal: true,
          modalType: 'error',
          redirect: '/',
        },
        isLoading: false
      })
    })
  }

  renderOccupationList = () => {
    return (
      this.state.categories.map((value, key) => {
        return (
          <option key={key} value={value.id}>{value.category}</option>
        )
      })
    )
  }

  renderResultsList = () => {
    return (
      <table className='table'>
        <thead>
          <tr>
            <th>Title/ Position</th>
            <th>Category</th>
            <th>{ LANG[localStorage.JobChoiceLanguage].description }</th>
            <th>Action</th>
          </tr>
        </thead>
          <tbody>
            {(this.state.results) && (this.state.results.map((value, key) => {
              return (
                <tr key={key}>
                  <td>{value.title}</td>
                  <td>{value.job_category.category}</td>
                  <td>{value.description}</td>
                  <td><Link to={'/job-detail/' + value.id} className='btn btn-info'>Details</Link></td>
                </tr>
              )
            }))}
          </tbody>
      </table>
    )
  }

  render() {
    
    if (!(this.props.user.data.job_seeker)) {
      return (<Redirect to="/home" />)
    }

    return (
      <div className='container'>
        <div className='jobsearch'>
          <div className='row'>
            <div className='col-md-4 col-sm-12 col-sm-12'>
              <div className='jobsearch-hatarakikata'>
                <div className='jobsearch-hatarakikata-title'>
                  <h4>Hataraki kata you've chosen</h4>
                </div>
                <div className='jobsearch-hatarakikata-image'>
                  <div className='container'>
                    <div className='row'>
                      {this.props.user.data.job_seeker.hataraki_kata_resource.map((value, key) => {
                        return (
                          <div key={key} className='col-md-6 col-sm-6 col-xs-6'>
                            <div className='jobsearch-dummy-image'></div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-md-8 col-sm-12 col-sm-12'>
              <div className='jobsearch-inputboxes'>
                <div className='row'>
                  <div className='col-md-4'>
                    <div className='jobsearch-inputboxes-individual'>
                      <span>Area:</span>
                      <input
                        type='text' 
                        name='area' 
                        placeholder='Area'
                        onChange={this.handleInputChange} />
                    </div>
                  </div>
                  <div className='col-md-4'>
                    <div className='jobsearch-inputboxes-individual'>
                      <span>Route/Station:</span>
                      <input
                        type='text' 
                        name='route' 
                        placeholder='Route/Station'
                        onChange={this.handleInputChange} />
                    </div>
                  </div>
                  <div className='col-md-50'>
                    <div className='jobsearch-inputboxes-individual'>
                      <span>{ LANG[localStorage.JobChoiceLanguage].registrationStatus }:</span>
                      <select
                        name='occupation'
                        onChange={this.handleInputChange}>
                        <option value=''>----</option>
                        {this.renderOccupationList()}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='results-container'>
            <h4>Results:</h4>
            <div className='jobsearch-results'>
              {(!this.state.isSearching && this.state.results.length === 0) ?
                <div>No search results.</div> :
                !this.state.isSearching ?
                  this.renderResultsList() :
                  <div></div>
              }
              {(this.state.isSearching) ? 
                <div className="loading-div">
                  <FontAwesomeIcon icon='spinner' spin></FontAwesomeIcon>
                </div> :
                <div></div>
              }
              
            </div>
          </div>
        </div>
        <Modal 
          messageKey={this.state.modal.messageKey}
          show={this.state.modal.modal} 
          message={this.state.modal.message}
          type={this.state.modal.modalType}
          redirect={this.state.modal.redirect} />

        <LoadingIcon show={this.state.isLoading} />
      </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(NonKeywordSearch)
