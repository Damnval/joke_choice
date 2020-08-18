import React, { Component } from 'react'
import '../JobOfferDetail.scss'
import { Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { LANG } from '../../../../constants'
import { connect } from 'react-redux'

const formValid = ({ formErrors }) => {
  let valid = true
  let hasData2 = false

  formErrors.job_strengths.map((formError, key) => {
    Object.values(formError).forEach(val => {
      if(val.length > 0) {
        hasData2 = true
      }
    })

    if(hasData2) {
      Object.values(formError).forEach(val => {
        val.length > 0 && (valid = false)
      })
    }
  })

  return valid
}

class JobOfferEditorSection3 extends Component {
  constructor(props) {
    super(props)

    this.state = {
      section3: {
        job_strengths: [
          {
            id: 0,
            item: '',
            description: '',
          }
        ],
      },
      formErrors: {
        job_strengths: [
          {
            id: 0,
            item: '',
            description: '',
          }
        ],
      },
      idCounter: 0,
    }

    this.handleFormError = this.handleFormError.bind(this)
  }

  componentDidMount() {
    if(this.props.initialData.job_strengths.length > 0) {
      var id_new = 0
      const job_strengths = this.props.initialData.job_strengths.map((value, key) => {
        return ({
          id: id_new + key,
          item: value.item,
          description: value.description,
        })
      })

      var idFormError_new = 0
      const formErrors = this.props.initialData.job_strengths.map((value, key) => {
        return ({
          id: idFormError_new + key,
          item: '',
          description: '',
        })
      })

      this.setState({
        section3: {
          ...this.state.section3,
          job_strengths: job_strengths,
        },
        formErrors: {
          ...this.state.section3,
          job_strengths: formErrors,
        },
        idCounter: this.state.section3.job_strengths.length + 1,
      }, () => {
        const newData = {...this.state.section3}
        this.props.retrievedData("section3", newData, true)
        this.props.loadNow('section3')
      })
    } else {
      this.props.loadNow('section3')
    }
  }

  handleInputChange(key, name, e) {
    e.preventDefault()
    const value = e.target.value

    const index = this.state.section3.job_strengths.findIndex(strength => strength.id === key)

    let newSection3= this.state.section3
    newSection3.job_strengths[index][name] = value

    let formErrors = this.state.formErrors
    if(name === 'item') {
      formErrors.job_strengths[index].item = value.length > 50 ? LANG[localStorage.JobChoiceLanguage].header + LANG[localStorage.JobChoiceLanguage].maxCharacters1 + '50' + LANG[localStorage.JobChoiceLanguage].maxCharacters2 : this.state.section3.job_strengths[index].description.length > 0 && value.length === 0 ? LANG[localStorage.JobChoiceLanguage].thisIsRequired : ""
      formErrors.job_strengths[index].description = value.length > 0 && this.state.section3.job_strengths[index].description.length === 0 ? LANG[localStorage.JobChoiceLanguage].thisIsRequired : this.state.section3.job_strengths[index].description.length > 1000 ? LANG[localStorage.JobChoiceLanguage].createJobMessage + LANG[localStorage.JobChoiceLanguage].maxCharacters1 + '1000' + LANG[localStorage.JobChoiceLanguage].maxCharacters2 : ""
    } else {
      formErrors.job_strengths[index].item = value.length > 0 && this.state.section3.job_strengths[index].item.length === 0 ? LANG[localStorage.JobChoiceLanguage].thisIsRequired :this.state.section3.job_strengths[index].item.length > 50 ? LANG[localStorage.JobChoiceLanguage].header + LANG[localStorage.JobChoiceLanguage].maxCharacters1 + '50' + LANG[localStorage.JobChoiceLanguage].maxCharacters2 : ""
      formErrors.job_strengths[index].description = value.length > 1000 ? LANG[localStorage.JobChoiceLanguage].createJobMessage + LANG[localStorage.JobChoiceLanguage].maxCharacters1 + '1000' + LANG[localStorage.JobChoiceLanguage].maxCharacters2 : this.state.section3.job_strengths[index].item.length > 0 && value.length === 0 ? LANG[localStorage.JobChoiceLanguage].thisIsRequired : ""
    }

    this.setState({
      section3: newSection3,
      formErrors: formErrors,
    }, () => {
      const newData = {...this.state.section3}
      this.props.retrievedData("section3", newData, formValid(this.state))
    });
  }

  addStrength() {

    const newArray1 = this.state.section3.job_strengths.slice()
    newArray1.push({
      id: this.state.idCounter + 1,
      item: '',
      description: '',
    })

    const newArray2 = this.state.formErrors.job_strengths.slice()
    newArray2.push({
      id: this.state.idCounter + 1,
      item: '',
      description: '',
    })

    this.setState({
      idCounter: this.state.idCounter + 1,
      section3: {
        ...this.state.section3,
        job_strengths: newArray1
      },
      formErrors: {
        ...this.state.formErrors,
        job_strengths: newArray2
      },
    })
  }

  deleteStrength(id) {
    const section3 = this.state.section3.job_strengths.filter(strength => strength.id !== id)
    const formErrors = this.state.formErrors.job_strengths.filter(strength => strength.id !== id)
    this.setState({
      section3: {
        ...this.state.section3, 
        job_strengths: section3
      },
      formErrors: {
        ...this.state.formErrors, 
        job_strengths: formErrors
      },
    }, () => {
      const newData = {...this.state.section3}
      this.props.retrievedData("section3", newData, formValid(this.state))
    })
  }

  handleFormError(name, key) {
    let formError = ""
    
    switch (name) {
      case "item":
        formError = this.state.section3.job_strengths[key].item.length > 50 ? LANG[localStorage.JobChoiceLanguage].header + LANG[localStorage.JobChoiceLanguage].maxCharacters1 + '50' + LANG[localStorage.JobChoiceLanguage].maxCharacters2 : this.state.section3.job_strengths[key].description.length > 0 && this.state.section3.job_strengths[key].item.length === 0 ? LANG[localStorage.JobChoiceLanguage].thisIsRequired : ""
        break
      default:
        formError = this.state.section3.job_strengths[key].description.length > 1000 ? LANG[localStorage.JobChoiceLanguage].createJobMessage + LANG[localStorage.JobChoiceLanguage].maxCharacters1 + '1000' + LANG[localStorage.JobChoiceLanguage].maxCharacters2 : this.state.section3.job_strengths[key].item.length > 0 && this.state.section3.job_strengths[key].description.length === 0 ? LANG[localStorage.JobChoiceLanguage].thisIsRequired : ""
        break
    }

    return formError
  }

  render() {
    return (
      <div className="createJob-section-bg">
        <div className="createJob-section-header">
          <span>{LANG[localStorage.JobChoiceLanguage].strength}</span>
        </div>
        <div className="createJob-strength-info">
          <div className="createJob-strength-info-left">
            <div>
              <span>アピールポイントの</span><br />
              <span>書き方</span>
            </div>
          </div>
          <div className="createJob-strength-info-right">
            <span>
              <b>求職者の興味を持ってもらえそうな、
              働き方（扶養内・週3日・1日5時間・残業無し・
              お子様の都合でのお休み調整可）、就業環境や福利厚生
              （主婦がたくさん活躍中・社員食堂あり・社割あり・
              冷蔵庫あり・ウォーターサーバーあり）
              などの内容を記載してください。</b>
            </span><br /><br />
            <span>例）見出し：家庭と両立しながら活躍できる！</span><br />
            <span>本文：</span><br />
            <span>「週3日」「1日5時間～選べる」「曜日選べる」「扶養枠内」</span><br />
            <span>お子様がいらっしゃる方もたくさん活躍中なので、行事等があってもみんなでカバーできるから安心。</span><br />
            <span>仕事もプライベートも相談しあえる仲間がいるので活躍しやすい環境です。</span><br />
            <span>例）見出し：働きやすさ抜群！駅チカ・福利厚生充実</span><br />
            <span>本文：</span><br />
            <span>素敵なランチビュッフェやカフェが無料で利用可能！</span><br />
            <span>さらに、お昼寝・マッサージスペースも！働きやすい嬉しいポイントがいっぱいです。</span>
          </div>
        </div>
        {this.state.section3.job_strengths.map((value, key) => {
          return (
            <div key={key} className="createJob-inputArea">
              <div className="input-field createJob-sameline-multiple createJob-add-space">
                <div className="createJob-deletable">
                  <label htmlFor={`heading${key}`}>
                    {LANG[localStorage.JobChoiceLanguage].header}{`${key + 1}`}
                    <span className="optional-badge">
                      <small> {LANG[localStorage.JobChoiceLanguage].optional} </small>
                    </span>:
                  </label>
                </div>
                <div className={`${this.state.section3.job_strengths.length > 1 ? 'createJob-sameline-right-smaller':''}`}>
                  <input
                    id={`heading${key}`}
                    value={value.item}
                    type="text"
                    name={`heading${key}`}
                    noValidate
                    onChange={(e) => this.handleInputChange(value.id, 'item', e)}
                  />
                  {this.state.section3.job_strengths.length > 1 &&
                    <Button onClick={() => this.deleteStrength(value.id)} className="close-button"><FontAwesomeIcon icon="window-close" /></Button>
                  }
                </div>
                {(this.state.formErrors.job_strengths[key]) ? (this.state.formErrors.job_strengths[key].item.length > 0 ?
                    <span className="errorMessage">{this.handleFormError('item', key)}</span> :
                    <div className="errorNone"></div>) :
                  <div></div>
                }
              </div>
              <div className="input-field createJob-sameline-multiple createJob-add-space">
                <label htmlFor={`description${key}`}>
                  {LANG[localStorage.JobChoiceLanguage].createJobMessage}{`${key + 1}`}
                  <span className="optional-badge">
                    <small> {LANG[localStorage.JobChoiceLanguage].optional} </small>
                  </span>:
                </label>
                <textarea
                  className="resize-textarea"
                  name={`description${key}`}
                  value={value.description}
                  noValidate
                  onChange={(e) => this.handleInputChange(value.id, 'description', e)}
                />
                {(this.state.formErrors.job_strengths[key]) ? (this.state.formErrors.job_strengths[key].description.length > 0 ?
                    <span className="errorMessage">{this.handleFormError('description', key)}</span> :
                    <div className="errorNone"></div>) :
                  <div></div>
                }
              </div>
            </div>
          )})
        }
        <div className="createJob-section-footer">
          <Button onClick={() => this.addStrength()}>{LANG[localStorage.JobChoiceLanguage].addTo}</Button>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return state
}

export default connect(mapStateToProps)(JobOfferEditorSection3)
