import React, { Component } from 'react'
import '../UserDashboard.scss'
import Slider from "react-slick"
import { LANG } from '../../../../../constants'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../../../../store/auth/actions'

class UserDashboardMatching extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
          jobs: [],
        }
    }

    componentWillMount() {
        this.props.jobs.map((item, key) =>{
            if(item.matching_ratio > 74) {
                this.state.jobs.push(item)
            }
        })
    }

    render() {
        var settings = {
            infinite: true,
            speed: 1250,
            slidesToShow: 2,
            slidesToScroll: 1,
            arrows: true
        }
    
        if (this.state.jobs.length > 2) {
            settings.slidesToShow = 2
        } else {
            settings.slidesToShow = this.state.jobs.length
        }

      console.log(this.state.jobs.length)

        return (
            <div className="user-dashboard-matching">
                <div className="user-dashboard-matching-title">
                    <span>{ LANG[localStorage.JobChoiceLanguage].highMatchingRate }</span>
                </div>
                <div className="user-dashboard-matching-area">
                  { this.state.jobs.length < 1 ? <div className="no-item"><span>{ LANG[localStorage.JobChoiceLanguage].noHigh }</span></div> :
                  <Slider className='carousel' {...settings}>
                      {(this.state.jobs.map((value, key) => {
                        return (
                          <div key={key+1}>
                              <div className='high-match-item'>
                                  <div className='image-containers'>
                                    <a href={`/job-detail/ ${value.id}`}>
                                      <div className='bg-light hero-carousel-image'>
                                        <img src={value.job_image} alt="job_image"/>
                                      </div>
                                    </a>
                                  </div>
                                  <div className='hero-carousel-content'>
                                    <div className='hero-description'>
                                      <div className='hero-paragraph'>
                                        <span className='carousel-title'><strong>{value.title}</strong></span>
                                        <p className='hero-text dashboard-desc'>
                                            {value.description}
                                        </p>
                                      </div>
                                    </div>
                                    <div className='carousel-stats'>
                                      <div className='carousel-stats-item'>
                                        <span>{ LANG[localStorage.JobChoiceLanguage].plannedHires }</span>
                                        <span>{value.planned_hire}</span>
                                      </div>
                                      <div className='carousel-stats-item'>
                                        <span>{ LANG[localStorage.JobChoiceLanguage].matchingRatio }</span>
                                        <span>{value.matching_ratio}％</span>
                                      </div>
                                    </div>
                                  </div>
                              </div>
                          </div>
                        )}))
                      }
                  </Slider>
                }
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
  
  export default connect(mapStateToProps, mapDispatchToProps)(UserDashboardMatching)
