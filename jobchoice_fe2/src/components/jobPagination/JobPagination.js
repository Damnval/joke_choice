import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../store/auth/actions'
import { pageGenerator } from '../../helpers'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { LANG } from '../../constants'
import PropTypes from 'prop-types'

class JobPagination extends Component {


  render() {

    return (
      <div className="row flex-row-space-between jobs-list-bottom-results">
        <div className="pagination-area justify-content-center">
            { this.props.current_page > 1 &&
              <button
                className='btn pagination-number left'
                onClick={() => this.getData(this.props.current_page-1)}
              >
                <FontAwesomeIcon icon='chevron-left'/>
              </button>
            }
            { this.props.total > 0 && pageGenerator(this.props.last_page).map((val, key) => {
              return (
                <button key={key}
                  className={`btn pagination-number ${this.props.current_page === val ? 'active' : ''}`}
                  onClick={() => this.getData(val)}
                >{val}</button>
              )})
            }
            { this.props.last_page !== this.props.current_page &&
              <button
                className='btn pagination-number left'
                onClick={() => this.getData(this.props.current_page+1)}
              >
                <FontAwesomeIcon icon='chevron-right'/>
              </button>
            }
          </div>
      </div> 
    )
  }
}

JobPagination.propTypes = { 
  current_page: PropTypes.number.isRequired, 
  total: PropTypes.number.isRequired, 
  last_page: PropTypes.number.isRequired, 
} 

const mapStateToProps = state => {
    return state
  }
  
const mapDispatchToProps = dispatch => {
  return {
      actions: bindActionCreators(authActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(JobPagination)
