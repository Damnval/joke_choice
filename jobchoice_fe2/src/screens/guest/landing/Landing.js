import React, { Component } from 'react'
import JobChoiceLayout from '../../../layouts/jobChoiceLayout/JobChoiceLayout'
import TopPage1 from './topPage1/TopPage1'
import TopPage2 from './topPage2/TopPage2'
import { connect } from 'react-redux'

class Landing extends Component {

  render() {
    
    return (
      <>
        <JobChoiceLayout>
          <TopPage1 />
          <TopPage2 />
        </JobChoiceLayout>
      </>
    )

  }
  
}

const mapStateToProps = state => {
  return state
}

export default connect(mapStateToProps)(Landing)
