import React from 'react'
import { LANG } from '../../../../constants'
import { imageDateNow } from '../../../../helpers'
import { Button } from 'react-bootstrap'
import InfoRow from '../../../../components/infoComponents/infoRow/InfoRow'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Img from 'react-fix-image-orientation'
class SharerInfoJobSeeker extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sharerDetails: null,
      isLoading: true,
      isSaving: false,

      modal: {
        message: '',
        modal: false,
        messageKey: null,
        modalType: '',
        redirect: null,
      },
    }
  }

  returnToList() {
    this.props.returnToList(false)
  }

  render() {
    const shared_job = this.props.sharerDetails

    const first_name = shared_job.first_name ? shared_job.first_name : ""
    const last_name = shared_job.last_name ? shared_job.last_name : ""
    const full_name = first_name || last_name ? `${last_name} ${first_name}` : LANG[localStorage.JobChoiceLanguage].valueNotSet

    const first_name_kana = shared_job.first_name_kana ? shared_job.first_name_kana : ""
    const last_name_kana = shared_job.last_name_kana ? shared_job.last_name_kana : ""
    const full_name_kana = first_name_kana || last_name_kana ? `${last_name_kana} ${first_name_kana}` : LANG[localStorage.JobChoiceLanguage].valueNotSet

    return (
      <div className='container-fluid offer-detail-background'>
      {shared_job &&
      <>
        <div className="row">
          <div>
            <Button className="job-seeker-sharer-return-btn" onClick={() => this.returnToList()}>
              <FontAwesomeIcon icon='chevron-left'/>
            </Button>
          </div>
        </div>
        <div className="row">
          <div className="col-md-8 offset-md-2 col-xl-8 offset-xl-2">
            <div className="row applicant-info-1">
              <div className="col-lg-4 col-xl-3 offset-xl-1 flex justify-content-center">
                <div className='applicant-picture'>
                  <Img src={imageDateNow(shared_job.job_seeker.profile_picture)} alt="logo"/>
                </div>
              </div>
              <div className="col-lg-8 col-xl-7">
                <span className='applicant-title'>
                { LANG[localStorage.JobChoiceLanguage].sharerInfo }
                </span>
              </div>
            </div>
            
            <div className="row info-container">
              <div className="col-xl-10 offset-xl-1">
                <InfoRow label={'ID'} data={shared_job.id}/>
                {/* <InfoRow
                  label={LANG[localStorage.JobChoiceLanguage].name}
                  data={full_name}
                />
                <InfoRow
                  label={LANG[localStorage.JobChoiceLanguage].completeKanaName}
                  data={full_name_kana}
                /> */}
                <InfoRow
                  label={LANG[localStorage.JobChoiceLanguage].nickName}
                  data={shared_job.job_seeker.nickname ? shared_job.job_seeker.nickname : LANG[localStorage.JobChoiceLanguage].valueNotSet}
                />
                <InfoRow label={LANG[localStorage.JobChoiceLanguage].jobChoiceRegistrationDate} data={shared_job.email_verified_at !== null ? shared_job.email_verified_at : shared_job.sms_verified_at}/>           
              </div>
            </div>
          </div>
        </div>
        </>
      }
      </div>
    );
  }
}

export default SharerInfoJobSeeker
