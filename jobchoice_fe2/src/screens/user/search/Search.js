import React from 'react'
import './Search.scss'
import { Redirect } from 'react-router-dom'
import JobChoiceLayout from '../../../layouts/jobChoiceLayout/JobChoiceLayout'
import LoadingIcon from '../../../components/loading/Loading'
import Modal from '../../../components/modal/Modal'
import { connect } from 'react-redux'
import JobList from '../../../components/jobComponents/jobList/JobList'
import SearchComponent from '../../../components/searchComponents/SearchComponent'
import { LANG } from '../../../constants'
import { bindActionCreators } from 'redux'
import * as authActions from '../../../store/auth/actions'
import {Breadcrumb} from 'react-bootstrap'
import JobPagination from '../../../components/jobPagination/JobPagination'

class Search extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      link: null,
      results: [],
      pages: [],
      total: 0,
      current_page: 0,
      last_page: 0,
      isLoading: true,
      modal: {
        messageKey: null,
        message: '',
        modal: false,
        modalType: '',
        redirect: null,
      },
    }
    this.handleChange = this.handleChange.bind(this)
    this.newLink = this.newLink.bind(this)
  }

  newLink(id) {
    let link = 'job-detail/' + id
    if (this.props.user !== undefined && this.props.user.company) {
      link = '/job-offer/' + id
    }
    this.setState({link: link})
  }

  handleChange = (newInput) => {this.setState(newInput)}

  handleClose = (value) => {
    this.setState({
      [value]: false,
      modal: {
        message: '',
        messageKey: null,
        modal: false,
        modalType: '',
        redirect: null,
      },
    })
  }

  render() {
  
    if (this.state.link !== null) {
      return <Redirect to={this.state.link} />
    }

    return (
      <JobChoiceLayout className="min-height">
        <Breadcrumb className="breadcrumb-search">
          <Breadcrumb.Item href="/">{ LANG[localStorage.JobChoiceLanguage].home }</Breadcrumb.Item>/
          <Breadcrumb.Item active>{ LANG[localStorage.JobChoiceLanguage].search }</Breadcrumb.Item>
        </Breadcrumb>
        <div className='container-fluid min-height'>
          <div className='row'>
          {
            <SearchComponent
              results={this.results}
              changeParent={this.handleChange}
            />
          }
          </div>
          <div>
            
              <div className="container-fluid search-results">
                <div className="row">
                  <div className="col-lg-12 col-xl-8 offset-xl-2">
                    {!this.state.isLoading && 
                    ((this.state.results.length) > 0 &&
                    <>
                    <div className="row">
                      <div className="col-sm-12">
                      <h3>{ LANG[localStorage.JobChoiceLanguage].searchResult }</h3>
                      </div>
                    </div>
                    <div className="row">
                      <JobList
                        jobs={this.state.results}
                        onClick={this.newLink}
                      />
                    </div>
                    <JobPagination
                      current_page={this.state.current_page}
                      last_page={this.state.last_page}
                      total={this.state.total}
                    />
                    <div className="search-results-component">
                      { LANG[localStorage.JobChoiceLanguage].jobsFound } {this.state.total} { LANG[localStorage.JobChoiceLanguage].found }
                    </div>
                    </>
                    )}
                  </div>
                </div>
              </div>
            
          </div>
        </div>
        <LoadingIcon show={this.state.isLoading} />
        <Modal
          messageKey={this.state.modal.messageKey}
          show={this.state.modal.modal}
          message={this.state.modal.message}
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

export default connect(mapStateToProps, mapDispatchToProps)(Search)

