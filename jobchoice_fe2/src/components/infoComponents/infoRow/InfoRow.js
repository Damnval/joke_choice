import React from 'react'

class InfoRow extends React.Component {

  render() {
    const disclosed = this.props.disclosed === undefined ? true : this.props.disclosed
    return (
      <div className="row data-row">
        <div className="col-xl-4">
          <div className="label">{this.props.label}</div>
        </div>
        <div className="col-xl-8">
          {this.props.data && <div className={`data ${disclosed ? '' : 'undisclosed'}`}>{this.props.data}</div>}
          {this.props.info && this.props.info}
        </div>
      </div>
    )
  }
}

export default InfoRow

