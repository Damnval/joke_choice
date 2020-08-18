import React, { Component } from "react"
import JobChoiceLayout from '../../../../layouts/jobChoiceLayout/JobChoiceLayout'
import Form1JobSeeker from './jobSeeker/Form1JobSeeker'
import Form1Company from './company/Form1Company'

class Registration extends Component {
  render() {
    return (
      <div>
        <JobChoiceLayout>

          {this.props.match.params.type === 'job_seeker' && (
            <Form1JobSeeker token={this.props.match.params.token} history={this.props.history} step={1} /> 
          )}
          {this.props.match.params.type === 'company' && (
            <Form1Company token={this.props.match.params.token} /> 
          )}

        </JobChoiceLayout>
      </div>
    );
  }
}

export default Registration
