import * as types from '../actions'
import { checkServerIdentity } from 'tls';

const initialstate = {}

const userReducer = (state = initialstate, {type, payload}) => {
  switch (type) {
    case types.USER_AUTHENTICATED:
     
      let basic_info_checker = false
      let bank_info_checker = false
      let profile_info_checker = false
      let login_info_checker = false
      if ((payload && payload.data) && payload.data.job_seeker) {
        let user_data = payload.data
        let job_seeker = user_data.job_seeker
        let educational_background = job_seeker.educational_background
        let work_experience = job_seeker.work_experience
        let bank_info = user_data.job_seeker.bank_account
        let geolocation = user_data.job_seeker.geolocation

        if ((user_data.email && user_data.email.trim().length > 0) &&
            (user_data.contact_no && user_data.contact_no.trim().length > 0)) {
          login_info_checker = true
        }

        if ((user_data.first_name && user_data.first_name.trim().length > 0) &&
            (user_data.last_name && user_data.last_name.trim().length > 0) &&
            (user_data.first_name_kana && user_data.first_name_kana.trim().length > 0) &&
            (user_data.last_name_kana && user_data.last_name_kana.trim().length > 0) &&
            (job_seeker.birth_date && job_seeker.birth_date.trim().length > 0) &&
            (job_seeker.gender && job_seeker.gender.trim().length > 0) &&
            (geolocation.zip_code && geolocation.zip_code.trim().length > 0) &&
            (geolocation.station && geolocation.station.trim().length > 0) &&
            (geolocation.complete_address && geolocation.complete_address.trim().length > 0) ) {
            basic_info_checker = true
          }

        if ((bank_info.account_holder && bank_info.account_holder.trim().length > 0) &&
            (bank_info.account_number && bank_info.account_number.trim().length > 0) &&
            (bank_info.bank_code && bank_info.bank_code.trim().length > 0) &&
            (bank_info.bank_name && bank_info.bank_name.trim().length > 0) &&
            (bank_info.branch_code && bank_info.branch_code.trim().length > 0) &&
            (bank_info.branch_name && bank_info.branch_name.trim().length > 0) ) {
            bank_info_checker = true
        }

        if ( educational_background.length > 0 &&
             work_experience.length > 0 &&
             job_seeker.job_seeker_skills.length > 0 &&
             (job_seeker.marital_status && job_seeker.marital_status.trim().length > 0) &&
             (job_seeker.description && job_seeker.description.trim().length > 0)) {
          profile_info_checker = true
        }
      }
      
      return {
        ...payload,
        loginInfo: login_info_checker,
        basicInfo: basic_info_checker,
        bankInfo: bank_info_checker,
        profileInfo: profile_info_checker
      }
    case types.NETWORK_ERROR:
      return {
        error: {
          type: 'network error',
          message: payload.message
        }
      }
    default:
      return state
  }
}

export default userReducer
