import React, { Component } from 'react'
import './CardJobCategory.scss'
import { LANG } from '../../../constants'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../../store/auth/actions'

class CardJobCategory extends Component {

    render() {

        return (
            <div className="joboffercat-jobs">
                <div className="container">
                    <div className="row">
                        <div className="col-md-4 col-sm-12 col-xs-12">
                            <div className="joboffercat-jobs-image">
                                {this.props.data.job_image}
                            </div>
                        </div>
                        <div className="col-md-8 col-sm-12 col-xs-12">
                            <div className="joboffercat-jobs-desc">

                                <div className="joboffercat-jobs-desc-top">
                                    <span className="joboffercat-jobs-desc-top-left">{ LANG[localStorage.JobChoiceLanguage].plannedHires }: <b>{this.props.data.planned_hire}</b></span>
                                    <span className="joboffercat-jobs-desc-top-right">{ LANG[localStorage.JobChoiceLanguage].salary }: <b>{this.props.data.salary}<span className="smaller">円</span></b></span>
                                </div>

                                <div className="joboffercat-jobs-desc-title">
                                    <span>{this.props.data.title}</span>
                                </div>

                                <div className="joboffercat-jobs-desc-desc">
                                    {this.props.data.description}
                                </div>

                                <div className="joboffercat-jobs-desc-hatarakikata">
                                    <div className="container">
                                        <div className="row">

                                            {this.props.data.hataraki_kata_resource.map((value) => {
                                                return (
                                                <div key={value.id} className="col-md-3 col-sm-6 col-xs-12 joboffercat-jobs-desc-hatarakikata-spacer">
                                                    <div className="joboffercat-jobs-desc-hatarakikata-individual">{value.hataraki_kata.item}</div>
                                                </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(CardJobCategory)
