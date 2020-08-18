import React, { Component } from 'react'
import ReactModal from "react-modal"
import "./bankBranchModal.scss"
import ReactTable from 'react-table'
import { LANG } from '../../constants'
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import * as authActions from "../../store/auth/actions"
import { Radio } from 'react-bootstrap'

class BankBranchModal extends Component {

    // Constructor
    constructor(props) {
        super(props);
        this.state = {
            title: this.props.title,
            bankBranch: [],
            isSelected: -1,
            search : ''
        }
        this.handleClose = this.handleClose.bind(this)
        this.setBankBranch = this.setBankBranch.bind(this)
    }

    // Load Data
    componentWillMount() {
        ReactModal.setAppElement("body")
    }

    // Handle Closing Modal
    handleClose() {
        this.setState({
            show: false,
            title: "",
            isSelected: -1,
            search: ""
        }, () => {
            this.props.handleBankBranchModal(false)
        })
    }

    // Set Bank Branch
    setBankBranch = (e) => {
        if(this.props.bankBranches[this.state.isSelected]) {
            this.props.setBankBranchData('branch_data',this.props.bankBranches[this.state.isSelected])
            this.props.handleBankBranchModal(false)
            this.setState({
                isSelected: -1,
                search: ""
            })
        } else {
            this.props.handleBankBranchModal(false)
            this.setState({
                isSelected: -1,
                search: ""
            })
        }
    }


    render() { 
        
        // const { data } = this.state
        let data = []
        {
            if(this.props.bankBranches) {
                Object.keys(this.props.bankBranches).map((val,i) => {
                    let branches = {
                        name: this.props.bankBranches[val].name, 
                        code: this.props.bankBranches[val].code, 
                        kana: this.props.bankBranches[val].kana,
                        id: this.props.bankBranches[val].code,
                    };
                    data.push(branches)
                })
            }
        }

        if (this.state.search) {
			data = data.filter(row => {
            return row.name.includes(this.state.search) || String(row.code).includes(this.state.search) || String(row.kana).includes(this.state.search)
            })
        }

        const onRowClick = (state, rowInfo, column, instance) => {
            return {
                onClick: e => {
                    this.setState({
                        isSelected: rowInfo.original.id,
                    })
                }
            }
        }
    
        const dataTableCol = [
            {
                Header: LANG[localStorage.JobChoiceLanguage].headerBranchName,
                id: "radio-selected",
                headerClassName: "align-left",
                accessor: d => 
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
                Header: LANG[localStorage.JobChoiceLanguage].headerBranchCode,
                headerClassName: "align-left",
                accessor: "code"
            },
            {
                Header: LANG[localStorage.JobChoiceLanguage].headerBranchName2,
                headerClassName: "align-left",
                accessor: "kana"
            }
        ];
        
        return ( 
            <ReactModal
                isOpen={this.props.show}
                shouldCloseOnOverlayClick={false}
                shouldCloseOnEsc={false}
                className="bank-modal-main">
                <div className="bankModal">
                <div className="bank-header bank-bg" />
                <div className="bank-content">
                    <div className="row">
                        <div className="col-md-12 display-flex ">
                        <div className="col-md-5">
                            <p className="bank-label">{LANG[localStorage.JobChoiceLanguage].searchBranch}</p>
                        </div>
                        <div className="col-md-7">
                            <label className="lbl-search">{LANG[localStorage.JobChoiceLanguage].searchText}</label> 
                            <input className="bank-search" value={this.state.search} onChange={e => this.setState({search: e.target.value})} />
                        </div>
                        </div>
                    </div>
                    {data && 
                    <ReactTable
                        data={data}
                        columns={dataTableCol}
                        defaultPageSize={8}
                        previousText={LANG[localStorage.JobChoiceLanguage].Previous}
                        nextText={LANG[localStorage.JobChoiceLanguage].Next}
                        getTrProps={onRowClick}
                    />
                    }
                </div>
                <div className="bank-footer bank-bg">
                    <div>
                    <button className="buttons btn btn-cancel " onClick={this.handleClose}>{this.handleClose}{ LANG[localStorage.JobChoiceLanguage].cancel }</button>  
                    <button className="buttons btn btn-cancel" onClick={this.setBankBranch}>{ LANG[localStorage.JobChoiceLanguage].ok }</button>  
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
  
  export default connect(mapStateToProps, mapDispatchToProps)(BankBranchModal)
