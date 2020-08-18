import React from 'react'
import api from '../../../utilities/api'
import LoadingIcon from '../../../components/loading/Loading'
import {Redirect} from 'react-router-dom'

class JobShare extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      redirectNow: false,
      job_id: null,
      job_seeker_id: null
    }

  }
  componentDidMount() {
    const url = {href: window.location.href}
    api.post('api/decrypt-shared-job', url).then(response => {
      if (response.data.status === 200) {
        this.setState({
          redirectNow: true,
          shared_job_id: response.data.results.shared_job_id,
          job_id: response.data.results.job_id,
          job_seeker_id: response.data.results.job_seeker_id
        })
        
        // Set Share Job Data and SNS Apply 
        // This will be triggered after decrypting the share link url 
        let share_job_data = { 'job_seeker_id' : this.state.job_seeker_id,  'shared_job_id' : this.state.shared_job_id, 'job_id':  this.state.job_id}
        localStorage.setItem("share_job_data", JSON.stringify(share_job_data))
        localStorage.setItem('snsApply', true)
      }
    }).catch(error => {
      this.props.history.replace('/')
    })
  }

  render() {
    if (this.state.redirectNow === true && this.state.job_id !== (undefined || null)) {
      return <Redirect to={{pathname:`/job-detail/${this.state.job_id}`,
                            state: {job_seeker_id:this.state.job_seeker_id, shared_job_id:this.state.shared_job_id}
                          }}
              />
  }
    return (
      <LoadingIcon show={true}/>
    )
  }
}

export default JobShare
