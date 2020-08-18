import React, { Component } from 'react'
import "../JobOfferByCategory.scss"
import SampleJobCategoryHero from '../../../../assets/img/SampleJobCategoryHero.jpeg'
import { LANG } from '../../../../constants'
import { bindActionCreators } from 'redux'
import * as authActions from '../../../../store/auth/actions'
import { connect } from 'react-redux'
import {Breadcrumb} from 'react-bootstrap'

class JobOfferByCategoryDesc extends Component {

  render() {

    return (
        <div className="joboffercat-desc-area">
            <Breadcrumb className="breadcrumb-featured">
                <Breadcrumb.Item href="/">{ LANG[localStorage.JobChoiceLanguage].top }</Breadcrumb.Item>/
                <Breadcrumb.Item active>{ LANG[localStorage.JobChoiceLanguage].jobCategory }</Breadcrumb.Item>
            </Breadcrumb>

            <div className="joboffercat-title"> 
                <span>{ LANG[localStorage.JobChoiceLanguage].jobCategory }: { localStorage.JobChoiceLanguage === 'US' ? this.props.feature.title_en : this.props.feature.title_jp }</span>
            </div>

            <div className="joboffercat-hero-image">
                <img src={this.props.feature.images[1].image_path} alt="banner" />
            </div>
            
            <div className="joboffercat-other-section">
                <span className="joboffercat-section-divider">{ localStorage.JobChoiceLanguage === 'US' ? this.props.feature.des_header_en : this.props.feature.des_header_jp }</span>
                <div dangerouslySetInnerHTML={{__html: localStorage.JobChoiceLanguage === 'US' ? this.props.feature.des_body_en: this.props.feature.des_body_jp}} />
            </div>
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
  
  export default connect(mapStateToProps, mapDispatchToProps)(JobOfferByCategoryDesc)
