import React, { Component } from 'react'
import TopPageCard from '../../../../components/topPageCard/TopPageCard'

class CoverImageComponent extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      width: 0,
    }
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this)
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }
  
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }
  
  updateWindowDimensions() {
    this.setState({ width: window.innerWidth})
  }

  render() {
    return (
      <>
        <div id="homepage-hero">
            <div className="cover-image login-cover">
              <img className="cover-image-source" src={require('../../../../assets/img/LandingHero.png')} alt="hero1"/>
              <TopPageCard
                image={require('../../../../assets/img/top_page/おしゃれなオフィス・お店で働く.jpg')}
                item_jp="おしゃれなオフィス・お店で働く"
                item_en="Work in a fashionable office / shop I can learn and use language"
                containerStyle="top_page_card top_page_01"
              />
              <TopPageCard
                image={require('../../../../assets/img/top_page/1日4ｈ以内.jpg')}
                item_jp="1日4ｈ以内"
                item_en="Within 4 hours in a day"
                containerStyle="top_page_card top_page_02"
              />
              <TopPageCard
                image={require('../../../../assets/img/top_page/お子様が帰ってくるまでの勤務でOK.jpg')}
                item_jp="お子様が帰ってくるまでの勤務でOK"
                item_en="It is OK by work until child comes back"
                containerStyle="top_page_card top_page_03"
              />
              <TopPageCard
                image={require('../../../../assets/img/top_page/未経験OK、充実した研修制度.jpg')}
                item_jp="未経験OK、充実した研修制度"
                item_en="Inexperienced OK, substantial training system"
                containerStyle="top_page_card top_page_04"
              />
              <TopPageCard
                image={require('../../../../assets/img/top_page/交通費支給.jpg')}
                item_jp="交通費支給"
                item_en="With transportation expenses"
                containerStyle="top_page_card top_page_05"
              />
              <TopPageCard
                image={require('../../../../assets/img/top_page/午前中のみ勤務可.jpg')}
                item_jp="午前中のみ勤務可"
                item_en="Working only in the morning"
                containerStyle="top_page_card top_page_06"
              />
              <TopPageCard
                image={require('../../../../assets/img/top_page/単日（1日）のお仕事.jpg')}
                item_jp="単日（1日）のお仕事"
                item_en="One day work"
                containerStyle="top_page_card top_page_07"
              />
              <TopPageCard
                image={require('../../../../assets/img/top_page/在宅ワーク・内職のお仕事.jpg')}
                item_jp="在宅ワーク・内職のお仕事"
                item_en="Work at home work / job at home"
                containerStyle="top_page_card top_page_11"
              />
              <TopPageCard
                image={require('../../../../assets/img/top_page/扶養内.jpg')}
                item_jp="扶養内"
                item_en="Within the range of dependents"
                containerStyle="top_page_card top_page_12"
              />
              <TopPageCard
                image={require('../../../../assets/img/top_page/家庭都合の休み調整可.jpg')}
                item_jp="家庭都合の休み調整可"
                item_en="Working from the afternoon or the evening"
                containerStyle="top_page_card top_page_13"
              />
              <TopPageCard
                image={require('../../../../assets/img/top_page/主婦（夫）が活躍中.jpg')}
                item_jp="主婦（夫）が活躍中"
                item_en="Housewife (husband) is active"
                containerStyle="top_page_card top_page_14"
              />
              <TopPageCard
                image={require('../../../../assets/img/top_page/経験者優遇.jpg')}
                item_jp="経験者優遇"
                item_en="Give preference to experienced people"
                containerStyle="top_page_card top_page_15"
              />
              <TopPageCard
                image={require('../../../../assets/img/top_page/託児所あり.jpg')}
                item_jp="託児所あり"
                item_en="Nursery"
                containerStyle="top_page_card top_page_16"
              />
              <TopPageCard
                image={require('../../../../assets/img/top_page/駅チカ・駅ナカ（徒歩5分以内）.jpg')}
                item_jp="駅チカ・駅ナカ（徒歩5分以内）"
                item_en="Near station/inside station(takes less than 5 minutes)"
                containerStyle="top_page_card top_page_17"
              />
              <TopPageCard
                image={require('../../../../assets/img/top_page/01.jpg')}
                item_jp="外資企業"
                item_en="Foreign affiliated company"
                containerStyle="top_page_card top_page_18"
              />
              <TopPageCard
                image={require('../../../../assets/img/top_page/13.jpg')}
                item_jp="即日勤務可能"
                item_en="Able to work ASAP"
                containerStyle="top_page_card top_page_19"
              />
              <TopPageCard
                image={require('../../../../assets/img/top_page/16.jpg')}
                item_jp="リゾート地でお仕事"
                item_en="Work at resort"
                containerStyle="top_page_card top_page_20"
              />
              <TopPageCard
                image={require('../../../../assets/img/top_page/44.jpg')}
                item_jp="完全歩合制"
                item_en="Commission system"
                containerStyle="top_page_card top_page_21"
              />
              <TopPageCard
                image={require('../../../../assets/img/top_page/52.jpg')}
                item_jp=""
                item_en=""
                containerStyle="top_page_card top_page_22"
              />
              <TopPageCard
                image={require('../../../../assets/img/top_page/58.jpg')}
                item_jp=""
                item_en=""
                containerStyle="top_page_card top_page_23"
              />
              <TopPageCard
                image={require('../../../../assets/img/top_page/61.jpg')}
                item_jp="各種社会保険完備"
                item_en="Various social insurance complete"
                containerStyle="top_page_card top_page_24"
              />
              <TopPageCard
                image={require('../../../../assets/img/top_page/63.jpg')}
                item_jp="食事付"
                item_en="With meals"
                containerStyle="top_page_card top_page_25"
              />
              <TopPageCard
                image={require('../../../../assets/img/top_page/42.jpg')}
                item_jp="インセンティブあり"
                item_en="There’s incentive"
                containerStyle="top_page_card top_page_26"
              />
              <TopPageCard
                image={require('../../../../assets/img/top_page/60.jpg')}
                item_jp="20～30代活躍中"
                item_en="20-30s is active"
                containerStyle="top_page_card top_page_27"
              />
            {this.props.children}
            </div>
        </div>
      </>
    )

  }
  
}

export default CoverImageComponent
