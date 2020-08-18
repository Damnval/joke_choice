import React, { Component } from 'react'
import "./JobOfferByCategory.scss"
import api from '../../../utilities/api'
import Modal from '../../../components/modal/Modal'
import LoadingIcon from '../../../components/loading/Loading'
import JobChoiceLayout from '../../../layouts/jobChoiceLayout/JobChoiceLayout'
import JobOfferByCategoryDesc from './jobOfferByCategoryComponents/JobOfferByCategoryDesc'
import JobOfferByCategorySearch from './jobOfferByCategoryComponents/JobOfferByCategorySearch'
import { LANG } from '../../../constants'

class JobOfferByCategory extends Component {

  constructor(props) {
    super(props)

    this.state = {
      results: [],
      isLoading: false,
      isFeatured: false,
      feature: null,
      didReceive: false,
      total: 0,
      modal: {
        message: '',
        messageKey: '',
        modal: false,
        modalType: '',
        redirect: null,
      },
    }
    this.handleParentClose = this.handleParentClose.bind(this)
  }

  componentDidMount() {
    window.scrollTo(0, 0)
    this.setState({
      modal: {
        message: '',
        messageKey: '',
        modal: false,
        modalType: '',
        redirect: null,
      },
      isLoading: true,
      didReceive: false,
    })
    
    const category = this.props.match.params.id

    api.get('api/special-feature').then(response => {
      const features = response.data.results.special_feature
      const feature = features.filter(function (el) {return String(el.id) === category})[0]

      if( feature === undefined ) {
        this.setState({
          isFeatured: false,
          isLoading: false,
          modal: {
            message: '',
            messageKey: 'specialFeatureDoesNotExist',
            modal: true,
            modalType: 'error',
            redirect: '/',
          },
        })
      } else {
        this.setState({
          isFeatured: true,
          isLoading: false,
          feature: feature,
        }, () => this.checkReceive())
      }
    }).catch(error => {
      console.log(error)
      this.setState({
        modal: {
          message: '',
          messageKey: "serverError",
          modal: true,
          modalType: 'error',
          redirect: '/',
        },
        isLoading: false,
      })
    })
  }

  checkReceive = () => {
    this.setState({
      didReceive: true,
    })
  }

  handleParentClose() {
    this.setState({
      modal: {
        messageKey: null,
        message: "",
        modal: false,
        modalType: '',
      }
    })
  }

  handleSearchChange = (newInput) => {this.setState(newInput)}

  render() {

    return (
        <JobChoiceLayout>
          <div style={{outline: 'none'}}></div>
          <div className="container-fluid joboffercat-background">
            <div className="row">
              <div className="col-md-12">               
                  {this.state.isFeatured &&
                    <JobOfferByCategoryDesc
                      categoryId={this.props.match.params.id}
                      feature={this.state.feature}
                    />
                  }              
                  {this.state.didReceive && 
                    <JobOfferByCategorySearch
                      results={this.state.results}
                      categoryId={this.props.match.params.id}
                      handleChange={this.handleSearchChange}
                      total={this.state.total}
                    />
                  }
              </div>
            </div>  
          </div>
          
          <Modal 
            show={this.state.modal.modal} 
            message={LANG[localStorage.JobChoiceLanguage][this.state.modal.message]}
            messageKey={this.state.modal.messageKey}
            type={this.state.modal.modalType}
            redirect={this.state.modal.redirect} 
            handleParentClose={this.handleParentClose}
            />
          
          <LoadingIcon show={this.state.isLoading} />
        
        </JobChoiceLayout>
    )
  }
}

export default JobOfferByCategory
