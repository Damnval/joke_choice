import React, { Component } from 'react'
import './CardJob.scss'
import { LANG } from '../../constants'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../store/auth/actions'
import HatarakikataDisplay from '../hatarakikata/hatarakikataDisplay/HatarakikataDisplay'
import NumberFormat from 'react-number-format'
import ClampLines from 'react-clamp-lines'
import defaultJobImage from '../../assets/img/job-avatar.jpg'
import Img from 'react-fix-image-orientation'
import { handleSearchTranslation } from '../../helpers'
class CardJob extends Component {

    render() {
        const user = JSON.parse(localStorage.getItem('state'))
        const has_hataraki_kata = this.props.has_hataraki_kata === undefined

        return (
          <div className={`job-card${has_hataraki_kata ? '': ' no-hataraki-kata'}`}>
            <div className="job-card-title">
              <div className="title-left">{ LANG[localStorage.JobChoiceLanguage].plannedHires }: 
              <strong>
                <NumberFormat value={this.props.data.planned_hire} displayType={'text'} thousandSeparator={true}/>
              </strong>
              </div>
              { ( user && (user.user.data && user.user.data.job_seeker) ) ? <div className="title-right">
                { LANG[localStorage.JobChoiceLanguage].matchingRatio } :
                  <b>{ this.props.data.matching_ratio > 0 ? this.props.data.matching_ratio + '%' : '0%' }</b></div> : ''
              }
            </div>
            <div className="job-card-salary">
              <div></div>
              <div className="job-card-salary-flag">
                <div className="ribbon-tip"></div>
                <span>
                { LANG[localStorage.JobChoiceLanguage].incentives }: 
                  <strong>
                    <NumberFormat value={this.props.data.incentive_per_share} displayType={'text'} thousandSeparator={true}/>
                    <span className="smaller">円</span>
                  </strong>
                </span>
              </div>
            </div>
            <div className="job-card-job-title">
              <span>{this.props.data.title}</span>
            </div>
            <div className="job-card-image">
              <Img src={this.props.data.job_image ? this.props.data.job_image : defaultJobImage} alt="job"/>
            </div>
            <div className="job-card-desciption">
              <ClampLines
                text={this.props.data.description}
                id="job_description"
                lines={2}
                ellipsis="..."
              />
            </div>
            <div className="job-card-other-info">
              {this.props.data.geolocation ? 
                <p>
                  <strong>{LANG[localStorage.JobChoiceLanguage].location}:</strong>
                  &nbsp;&nbsp;{this.props.data.geolocation.complete_address}
                </p> : ''
              }

              {this.props.data.nearest_station ?
                <p>
                  <strong>{LANG[localStorage.JobChoiceLanguage].nearestStation}:</strong>
                  &nbsp;&nbsp;{this.props.data.nearest_station.map((value, key) => {
                     return (
                      <span key={key}>{value.station}</span>
                     )
                  })}
                </p>            
                : ''
              }

              {this.props.data.employment_type ? 
                <p>
                  <strong>{LANG[localStorage.JobChoiceLanguage].jobType}:</strong>
                  &nbsp;&nbsp;{handleSearchTranslation("EMPLOYMENT_TYPE", this.props.data.employment_type)}
                </p>  
                : ''
              }              

              {this.props.data.job_job_sub_categories ? 
                <p>
                  <strong>{LANG[localStorage.JobChoiceLanguage].jobCategory}:</strong>
                  &nbsp;&nbsp;{this.props.data.job_job_sub_categories.map((value, key) => {
                     return (
                      <span key={key}>{value.job_sub_category.job_category.category}</span>
                     )
                  })}
                </p>
                : ''
              }
              
            </div>
            <div className="job-card-hatarakikata">
              <div className="row">
                {has_hataraki_kata && this.props.data.hataraki_kata_resource.map((value) => {
                return (
                  <div key={value.id} className="col-md-6 col-sm-6 col-6">
                    <HatarakikataDisplay resource={value} />
                  </div>
                )
                })}
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

export default connect(mapStateToProps, mapDispatchToProps)(CardJob)
