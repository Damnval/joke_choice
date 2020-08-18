import React, { Component } from 'react'

class SearchFieldContainer extends Component {
  render() {
    const innerSearchStyles = this.props.innerSearchStyles ? this.props.innerSearchStyles : ""
    const searchFieldStyles = this.props.searchFieldStyles ? this.props.searchFieldStyles : ""
    return (
      <div className="client-job-list-search-container">
        <div className={innerSearchStyles}>
          <div className={searchFieldStyles}>
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }
}

export default SearchFieldContainer