import React, { Component } from 'react'
import { LANG } from '../../../../../constants'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../../../../store/auth/actions'
import defaultJobImage from '../../../../../assets/img/job-avatar.jpg'
import Img from 'react-fix-image-orientation'

class TopTenCard extends Component {

  render() {
    const {value, key} = this.props
    return (
      <div className='item' key={key}>
        <a className="image-container bg-light hero-carousel-image" href={'/job-detail/'+value.id}>
          <Img src={value.job_image ? value.job_image : defaultJobImage} alt="job_image"/>
        </a>
        <div className='hero-carousel-content'>
          <div className='hero-description'>
            <div className='hero-paragraph'>
              <span className='hero-carousel-title'><strong>{value.title}</strong></span>
              <p className='carousel-hero-text'>
              {value.description}
              </p>
            </div>
          </div>
          <div className='carousel-stats'>
            <span>{ LANG[localStorage.JobChoiceLanguage].reachNumber }: {value.no_shares}</span>
          </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(TopTenCard)
