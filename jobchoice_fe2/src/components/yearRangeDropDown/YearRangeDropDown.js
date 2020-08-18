import React, { Component } from 'react'

class YearRangeDropDown extends Component {

  handleChange = e => {
    e.preventDefault()
    this.props.onChange(this.props.field, e.target.value)
  }

  render() {
    const {year, ...rest} = this.props
    const moment = require('moment')
    const yearNow = moment().year()
    const yearsToFuture = rest.yearsToFuture ? rest.yearsToFuture : 1

    let numArray = Array.from(Array(yearNow-year), (x, index) => index + yearsToFuture + year)
    return (
        <select
          {...this.props}
          name={rest.field}
          onChange={this.handleChange}
          value={rest.value}
        >
          <option value=''> </option>
          {
            numArray.map((value, key) => {
              return (<option key={value} value={value}>{value}</option>)
            })
          }
        </select>
    )
  }
}

export default YearRangeDropDown
