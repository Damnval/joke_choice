import React from 'react'
import './../../client/jobOfferDetail/JobOfferDetail'
import './JobSearch.css'
import JobChoiceLayout from '../../../layouts/jobChoiceLayout/JobChoiceLayout'
import NonKeywordSearch from './nonKeywordSearch/NonKeywordSearch'

class JobSearch extends React.Component {

  render() {
    return (
      <div>
        <JobChoiceLayout>
          <div className="container login-background">
            <div className='container'>
              <NonKeywordSearch />
            </div>
          </div>
        </JobChoiceLayout>
      </div>
    );
  }
}

export default JobSearch;
