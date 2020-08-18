import React, { Component } from 'react'
import "../JobOfferByCategory.scss"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Redirect } from 'react-router-dom'
import SearchComponent from '../../../../components/searchComponents/SearchComponent'
import JobList from '../../../../components/jobComponents/jobList/JobList'
import { LANG } from '../../../../constants'
class JobOfferByCategorySearch extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
          results: '',
          didReceive: false,
          link: null,
          hideSearch: false,
          total: 0
        }

        this.newLink = this.newLink.bind(this)
    }

    componentDidMount() {
        this.setState({
            results: this.props.results,
            didReceive: true,
        })
    }

    newLink(id) {
        const link= '/job-detail/' + id
        this.setState({link: link})
    }

    handleSearchChange = (newInput) => {this.props.handleChange(newInput)}

    toggleSearch = () => {
        this.setState({
            hideSearch: !this.state.hideSearch
        })
    }

    render() {
        if (this.state.link !== null) {
            return <Redirect to={this.state.link} />
        }

        return (
            <div className="joboffercat-search-area">
                <div className="joboffercat-search-title">
                    <span className="joboffercat-section-divider" onClick={this.toggleSearch}>
                        <span>{ LANG[localStorage.JobChoiceLanguage].searchJob }</span>
                        { this.state.hideSearch ?
                         <FontAwesomeIcon icon='angle-down' /> :
                         <FontAwesomeIcon icon='angle-up' />
                        }
                    </span>
                </div>

                { !this.state.hideSearch &&
                    <div className="joboffercat-search-table-area">
                        <SearchComponent
                            results={this.props.results}
                            changeParent={this.handleSearchChange}
                            specialFeatureId={this.props.categoryId}
                        />
                    </div>
                }

                <div className="row">
                  <div className="col-md-10 offset-md-1">
                    <div className="row">
                        <JobList
                            jobs={this.props.results}
                            onClick={this.newLink}
                            has_hataraki_kata={false}
                        />
                    </div>
                    {this.props.results && this.props.results.length > 0 &&
                        <div className="search-results-component">{this.props.total} jobs found.</div>
                    }
                  </div>
                </div>
            </div>
        )
    }
}

export default JobOfferByCategorySearch
