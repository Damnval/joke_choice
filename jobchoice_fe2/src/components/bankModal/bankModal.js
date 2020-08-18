import React, { Component } from "react"
import ReactModal from "react-modal"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "./bankModal.scss"
import DataTable from "react-data-table-component"
import ReactTable from 'react-table'
import zenginCode from 'zengin-code'
import { LANG } from '../../constants'
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import * as authActions from "../../store/auth/actions"
import { fileURLToPath } from "url"
import { Radio } from 'react-bootstrap'

class BankModal extends Component {
  // Constructor
  constructor(props) {
    super(props)
    this.state = {
      title: this.props.title,
      bankCode: [],
      // isSelected is index of the selected Bank in bankCode
      isSelected: -1,
      search: ''
    }
    this.handleClose = this.handleClose.bind(this)
  }

  componentWillMount() {
    ReactModal.setAppElement("body")
    // Banks Data From ZenginCode
    let rows = []
    Object.keys(zenginCode).map((val,i) => {
      let banks = {
          name: zenginCode[val].name, 
          code: zenginCode[val].code, 
          kana: zenginCode[val].kana,
          branches: zenginCode[val].branches,
          id: i,
          
      };
      rows.push(banks)
    })
    this.setState({
      bankCode: rows
    })
  }
  
  // Event for closing bank modal
  handleClose() {
    this.setState({
      show: false,
      title: "",
      isSelected: -1,
      search: ""
    }, () => this.props.handleBankModal(false))
  }

  setBank = (e) => {
    if(this.state.bankCode[this.state.isSelected]) {
      this.props.setBankData('bank_data', this.state.bankCode[this.state.isSelected])
      this.props.handleBankModal(false)
      this.setState({
        isSelected: -1,
        search: ""
      })
    } else {
      this.props.handleBankModal(false)
      this.setState({
        isSelected: -1,
        search: ""
      })
    }
  }
 
  render() {
    let banks = this.state.bankCode 
    if (this.state.search) {
			banks = banks.filter(row => {
        return row.name.includes(this.state.search) || String(row.code).includes(this.state.search) || String(row.kana).includes(this.state.search)
      })
    }

    const onRowClick = (state, rowInfo, column, instance) => {
      return {
          onClick: e => {
              this.setState({
                isSelected: parseInt(rowInfo.original.id)
              })
          }
      }
    }

    const dataTableCol = [
        {
          Header: LANG[localStorage.JobChoiceLanguage].headerBankName,
          id: "is-selected name",
          headerClassName: "align-left",
          accessor : d =>
          <div className="bank-input-radio-individual">
            <Radio
                name={d.id}
                value={d.id}
                className="bank-input-radio-click"
                readOnly
                checked={this.state.isSelected === d.id}>
                { d.name }
            </Radio>
          </div>
        },
        {
          Header: LANG[localStorage.JobChoiceLanguage].headerBankCode,
          headerClassName: "align-left",
          id:"code",
          accessor: "code"
        },
        {
          Header: LANG[localStorage.JobChoiceLanguage].headerBankNameKana,
          headerClassName: "align-left",
          id:"kana",
          accessor: "kana"
        }
    ];

    

    return (
      <ReactModal
        isOpen={this.props.show}
        shouldCloseOnOverlayClick={false}
        shouldCloseOnEsc={false}
        className="bank-modal-main"
      >
        <div className="bankModal">
          <div className="bank-header bank-bg" />
          <div className="bank-content">
             <div className="row">
                <div className="col-md-12 display-flex ">
                  <div className="col-md-5">
                    <p className="bank-label">{LANG[localStorage.JobChoiceLanguage].searchBank}</p>
                  </div>
                  <div className="col-md-7">
                    <label className="lbl-search">{LANG[localStorage.JobChoiceLanguage].searchText}</label> 
                    <input className="bank-search" value={this.state.search} onChange={e => this.setState({search: e.target.value})} />
                  </div>
                </div>
             </div>
             
              <ReactTable
                data={banks}
                columns={dataTableCol}  
                defaultPageSize={8}
                previousText={LANG[localStorage.JobChoiceLanguage].Previous}
                nextText={LANG[localStorage.JobChoiceLanguage].Next}
                getTrProps={onRowClick}
              />
            <div>
              
            </div>
          </div>
          <div className="bank-footer bank-bg">
            <div>
              <button className="buttons btn btn-cancel " onClick={this.handleClose}>{ LANG[localStorage.JobChoiceLanguage].cancel }</button>  
              <button className="buttons btn btn-cancel" onClick={this.setBank}>{ LANG[localStorage.JobChoiceLanguage].ok }</button>
            </div>
          </div>
        </div>
      </ReactModal>
    );
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

export default connect(mapStateToProps, mapDispatchToProps)(BankModal)
