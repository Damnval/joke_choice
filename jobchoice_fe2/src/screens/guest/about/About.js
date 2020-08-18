import React, { Component } from 'react'
import JobChoiceLayout from '../../../layouts/jobChoiceLayout/JobChoiceLayout'
import './About.scss'
import { LANG } from '../../../constants'

class About extends Component {
  render() {
    return (
      <JobChoiceLayout>
        <div className="container min-height about-us-page">
          <div className="row about-title">
            <h4>{LANG[localStorage.JobChoiceLanguage].operatingInformation}</h4>
          </div>
          <div className="row border-bottom">
            <div className="col-md-3 about-label">{LANG[localStorage.JobChoiceLanguage].companyName}</div>
            <div className="col-md-9">MEDIAFLAG Okinawa Inc.</div>
          </div>
          <div className="row border-bottom">
            <div className="col-md-3 about-label">URL</div>
            <div className="col-md-9"><a href="http://okinawa.mediaflag.co.jp/">http://okinawa.mediaflag.co.jp/</a></div>
          </div>
          <div className="row border-bottom">
            <div className="col-md-3 about-label">{LANG[localStorage.JobChoiceLanguage].establishment}</div>
            <div className="col-md-9">03/10/2012</div>
          </div>
          <div className="row border-bottom">
            <div className="col-md-3 about-label">{LANG[localStorage.JobChoiceLanguage].capital}</div>
            <div className="col-md-9">1,000万円</div>
          </div>
          <div className="row border-bottom">
            <div className="col-md-3 about-label">{LANG[localStorage.JobChoiceLanguage].representative}</div>
            <div className="col-md-9">{LANG[localStorage.JobChoiceLanguage].tomoyoshiKawakami}</div>
          </div>
          <div className="row border-bottom">
            <div className="col-md-3 about-label">{LANG[localStorage.JobChoiceLanguage].noOfEmployees}</div>
            <div className="col-md-9">{LANG[localStorage.JobChoiceLanguage].employeesDetail}</div>
          </div>
          <div className="row">
            <div className="col-md-3 about-label">{LANG[localStorage.JobChoiceLanguage].businessContent}</div>
            <div className="col-md-9">{LANG[localStorage.JobChoiceLanguage].businessContentDetail1}</div>
          </div>
          <div className="row">
            <div className="offset-md-3 col-md-9">{LANG[localStorage.JobChoiceLanguage].businessContentDetail2}</div>
          </div>
          <div className="row border-bottom">
            <div className="offset-md-3 col-md-9">{LANG[localStorage.JobChoiceLanguage].businessContentDetail3}</div>
          </div>
          <div className="row">
            <div className="col-md-3 about-label">{LANG[localStorage.JobChoiceLanguage].businessPermitNo}</div>
            <div className="col-md-9">{LANG[localStorage.JobChoiceLanguage].businessPermitNo1}</div>
          </div>
          <div className="row border-bottom">
            <div className="offset-md-3 col-md-9">{LANG[localStorage.JobChoiceLanguage].businessPermitNo2}</div>
          </div>
          <div className="row">
            <div className="col-md-3 about-label">{LANG[localStorage.JobChoiceLanguage].location}</div>
            <div className="col-md-9">{LANG[localStorage.JobChoiceLanguage].businessLocation1}</div>
          </div>
          <div className="row border-bottom">
            <div className="offset-md-3 col-md-9">{LANG[localStorage.JobChoiceLanguage].businessLocation2}</div>
          </div>
          <div className="row border-bottom">
            <div className="col-md-3 about-label">{LANG[localStorage.JobChoiceLanguage].shareHolderComposition}</div>
            <div className="col-md-9">{LANG[localStorage.JobChoiceLanguage].shareHolderCompositionDetail}</div>
          </div>
          <div className="row">
            <div className="col-md-3 about-label">{LANG[localStorage.JobChoiceLanguage].relatedCompany}</div>
            <div className="col-md-9"><a href="https://impact-h.co.jp/">{LANG[localStorage.JobChoiceLanguage].relatedCompanyNo1}</a></div>
          </div>
          <div className="row">
            <div className="offset-md-3 col-md-9"><a href="http://www.mediaflag.com.cn/">{LANG[localStorage.JobChoiceLanguage].relatedCompanyNo2}</a></div>
          </div>
          <div className="row">
            <div className="offset-md-3 col-md-9"><a href="http://cabic.jp/">{LANG[localStorage.JobChoiceLanguage].relatedCompanyNo3}</a></div>
          </div>
          <div className="row">
            <div className="offset-md-3 col-md-9"><a href="http://www.o-and-h.com/">{LANG[localStorage.JobChoiceLanguage].relatedCompanyNo4}</a></div>
          </div>
          <div className="row">
            <div className="offset-md-3 col-md-9"><a href="http://www.impacttv.co.jp">{LANG[localStorage.JobChoiceLanguage].relatedCompanyNo5}</a></div>
          </div>
          <div className="row">
            <div className="offset-md-3 col-md-9"><a href="https://career-support.co.jp">{LANG[localStorage.JobChoiceLanguage].relatedCompanyNo6}</a></div>
          </div>
          <div className="row">
            <div className="offset-md-3 col-md-9"><a href="http://www.instore-labo.co.jp/">{LANG[localStorage.JobChoiceLanguage].relatedCompanyNo7}</a></div>
          </div>
          <div className="row">
            <div className="offset-md-3 col-md-9"><a href="https://dwm.co.jp">{LANG[localStorage.JobChoiceLanguage].relatedCompanyNo8}</a></div>
          </div>
          <div className="row">
            <div className="offset-md-3 col-md-9"><a href="http://www.shinwakikaku.co.jp/">{LANG[localStorage.JobChoiceLanguage].relatedCompanyNo9}</a></div>
          </div>
          <div className="row">
            <div className="offset-md-3 col-md-9"><a href="https://fpc.co.jp/">{LANG[localStorage.JobChoiceLanguage].relatedCompanyNo10}</a></div>
          </div>
          <div className="row border-bottom">
            <div className="offset-md-3 col-md-9"><a href="https://www.rjc.co.jp/">{LANG[localStorage.JobChoiceLanguage].relatedCompanyNo11}</a></div>
          </div>
        </div>
      </JobChoiceLayout>
    )
  }

}

export default About;
