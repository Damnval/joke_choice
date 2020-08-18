import React, { Component } from 'react'
import CardJob from '../../cardJob/CardJob'

class JobList extends Component {

  handleClick = (e, value) => {
    e.preventDefault()
    this.props.onClick(value)
  }

  render() {

    const { jobs, has_hataraki_kata } = this.props

    return (
      <>
      {(
        jobs.map((value) => {
        return (
          <div 
           key={value.id} 
           className="col-lg-4 col-md-6 col-sm-12 col-xs-12"
           onClick={e => this.handleClick(e, value.id)}
          >
            <CardJob key={value.id} data={value} has_hataraki_kata={has_hataraki_kata}/>
          </div>
          )
        })
      )}
      </>
    )
  }
}

export default JobList
