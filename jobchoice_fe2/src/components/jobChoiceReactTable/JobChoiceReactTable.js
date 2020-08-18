import React, { Component } from 'react'
import ReactTable from 'react-table'
import "react-table/react-table.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { LANG } from '../../constants'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../store/auth/actions'
import Pagination from '../pagination/Pagination'
import 'core-js/es6/number'
import 'core-js/es6/array'

class JobOfferComponent extends Component {

    render() {
    const myCustomPreviousText = <><FontAwesomeIcon icon='chevron-left'/><FontAwesomeIcon icon='chevron-left'/></>
    const myCustomNextText = <><FontAwesomeIcon icon='chevron-right'/><FontAwesomeIcon icon='chevron-right'/></>
    const myCustomPageText = LANG[localStorage.JobChoiceLanguage].Page

    return (
      <ReactTable
        data={this.props.data}
        pages={this.props.pages}
        page={this.props.page}
        loading={this.props.loading}
        columns={this.props.columns}
        defaultPageSize={20}
        previousText={myCustomPreviousText}
        nextText={myCustomNextText}
        pageText={myCustomPageText}
        resizable={false}
        className="-bordered, -striped"
        manual
        PaginationComponent={Pagination}
        onFetchData={this.props.onFetchData}
        SubComponent={this.props.SubComponent}
      />
    )
    }
}

const mapStateToProps = state => {
    return state
  }
  
  const mapDispatchToProps = dispatch => {
    return {
      actions: bindActionCreators(authActions, dispatch)
    }
  }
  
  export default connect(mapStateToProps, mapDispatchToProps)(JobOfferComponent)
  