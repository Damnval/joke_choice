import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Row, Col, ButtonGroup } from 'react-bootstrap'
import './TopPage2.scss'
import Slider from "react-slick";
import api from "../../../../utilities/api"
import LoadingIcon from '../../../../components/loading/Loading'
import { LANG } from '../../../../constants'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../../../store/auth/actions'
import SpecialFeatureItem from './specialFeatureItem/SpecialFeatureItem'
import TopTenCard from './topTenCard/TopTenCard'

class TopPage2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: '',
      isLoading: false,
      featuredList: [],
      openMoreSpecialFeature: false,
      link: null,
      topTen: null, 
    };

    this.newLink = this.newLink.bind(this)
  }

  componentWillMount() {
    this.setState({width: window.innerWidth})
  }

  updateWidth = () => {
    this.setState({width: window.innerWidth})
  }

  componentDidMount() {
    window.addEventListener("resize", this.updateWidth)
    this.setState({
      isLoading: true
    }, () => {
      api.get('api/special-feature').then(response => {
        this.setState({
          featuredList: response.data.results.special_feature,
          isLoading: false
        })
      }).catch(error => {
        console.log(error)
        this.setState({ 
          modal: {
            message: "serverError",
            modal: true,
            modalType: 'error',
            redirect: '/'
          },
          isLoading: false
        })
      })

      api.get('api/shared-job/top-ten').then(response => {
        this.setState({
          topTen: response.data.results.top_ten_shared_jobs.reverse(),
          isLoading: false
        })
      }).catch(error => {
        console.log(error)
        this.setState({ 
          modal: {
            message: "serverError",
            modal: true,
            modalType: 'error',
            redirect: '/'
          },
          isLoading: false
        })
      })
    })
  }

  toggleSeeMore = () => {
    this.setState({
      openMoreSpecialFeature: !this.state.openMoreSpecialFeature
    })
  }

  newLink(id) {
    const link= '/featured/' + id
    this.setState({link: link})
  }

  render() {
    var settings = {
      infinite: true,
      speed: 1250,
      slidesToShow: 3,
      slidesToScroll: 1,
      arrows: true,
      rtl: true
    }

    let featuredList = this.state.featuredList

    let topTen = this.state.topTen

    if (featuredList.length > 6) {
      featuredList = (featuredList.length > 0 && this.state.openMoreSpecialFeature) ? this.state.featuredList : this.state.featuredList.slice(0,6)
    }

    if (window.innerWidth <= 768) {
      settings.slidesToShow = 1
    } else if (window.innerWidth <= 1024) {
      settings.slidesToShow = 2
    } else {
      settings.slidesToShow = 3
    }

    if (topTen && topTen.length < 3) {
      settings.slidesToShow = topTen.length
    }

    if (this.state.link !== null) {
      return <Redirect to={this.state.link} />
    }

    return (
      <>
        <div id="top-page-2-area"></div>
        <div className='container-fluid'>
          <Row className='wrapper-adjustment'>
            <div className='container hero1'>
              <Row className="justify-content-center">
                <p className='top-title'>
                  <strong>{ LANG[localStorage.JobChoiceLanguage].whichOneAreYou }</strong>
                </p>
              </Row>
              <Row className="justify-content-center">
                <ButtonGroup className="btn-group">
                  <Link to='/search' className='btn btn-warning text-light btn-landing'>
                    <strong>{ LANG[localStorage.JobChoiceLanguage].seachForYourself } { LANG[localStorage.JobChoiceLanguage].choice }</strong>
                  </Link>
                </ButtonGroup>
                <ButtonGroup>
                  <Link to='/jobs' className='btn btn-light text-warning btn-landing'>
                    <strong>{ LANG[localStorage.JobChoiceLanguage].earnByShare } { LANG[localStorage.JobChoiceLanguage].share }</strong>
                  </Link>
                </ButtonGroup>
              </Row>
            </div>
          </Row>
          
          <Row>
            <div className='container-fluid hero2-container'>
              <Row className='hero2'>
                  
                  <div className="col-md-6 col-sm-12"> 

                    <a href='https://rpa-holdings.com/のABOUT参照'>
                            <div className='bg-light hero-image'></div>
                    </a>

                  </div>
                  <div className="col-md-6 col-sm-12"> 
                    <div className='wrap-hero-desc'>
                      <div className='top-row'>
                        <span className='top-title'><strong>JOBチョイスとは？</strong></span>
                      </div>
                      <div className='hero-description'>
                        <div className='hero-paragraph'>
                          <p className='hero-title'>働き方チョイスでお仕事検索！</p>
                          <p className='hero-text'>
                          理オコサ共済ぼかっ軍亡ニ代草フん請王ヨ企優発ッ分個ネニ粕療サケヲ上再ょドで家慎ラマタ虐辞サツメ者段56新意読そきばゃ。霊シメ房7謙リ宿容もうじ山河ネイ告中ざンいほ開所審げえ手日ソツエ毎年なけよ郵示よトふ持治ゆの世紙づ転望慣葬へな。後し合読ぞいぱ暮体ホ町民サ属智フヱ存応トょ歴政ほくせ直取も景語申辞アセミ山隠ぎイずぱ質6証いせゅて若一輸丁せ。
                          </p>
                        </div>
                        <div className='hero-paragraph'>
                          <p className='hero-title'>働き方チョイスでお仕事検索！</p>
                          <p className='hero-text'>
                          包あょぱ軸反ネノ灰捜ヒイメ砂53珍ルエトワ氏追ねぐじ毛第ルソ訴晴無そたわて墓級ホコ対忠げくフ台排撲隣めッて。50言57新ウヤマ止広9壇ゅや能史ヲト北写ぞ装試共見ろ沢飲スち罪巻ふごこ費俳寺災り。銃お傾当ふーづ動択シナロモ南質ぐせでる注提レフユメ時興ユチツエ育南灼イムキ王定シルヱ経必ヌヨ禁森騒ム襲縄ウラ体日は論高みやトレ案村べゅ那集将る臣川ず。
                          </p>
                        </div>
                      </div>
                      </div>
                  </div>

              </Row>

              </div>

            {/* <div className='container-fluid hero2-container'>
              <Row className='hero2'>
                <Col>
                  <a href='https://rpa-holdings.com/のABOUT参照'>
                    <div className='bg-light hero-image'></div>
                  </a>
                </Col>
                <Col className='hero-content'>
                  <div className='top-row'>
                    <span className='top-title'><strong>JOBチョイスとは？</strong></span>
                  </div>
                  <div className='hero-description'>
                    <div className='hero-paragraph'>
                      <p className='hero-title'>働き方チョイスでお仕事検索！</p>
                      <p className='hero-text'>
                      理オコサ共済ぼかっ軍亡ニ代草フん請王ヨ企優発ッ分個ネニ粕療サケヲ上再ょドで家慎ラマタ虐辞サツメ者段56新意読そきばゃ。霊シメ房7謙リ宿容もうじ山河ネイ告中ざンいほ開所審げえ手日ソツエ毎年なけよ郵示よトふ持治ゆの世紙づ転望慣葬へな。後し合読ぞいぱ暮体ホ町民サ属智フヱ存応トょ歴政ほくせ直取も景語申辞アセミ山隠ぎイずぱ質6証いせゅて若一輸丁せ。
                      </p>
                    </div>
                    <div className='hero-paragraph'>
                      <p className='hero-title'>働き方チョイスでお仕事検索！</p>
                      <p className='hero-text'>
                      包あょぱ軸反ネノ灰捜ヒイメ砂53珍ルエトワ氏追ねぐじ毛第ルソ訴晴無そたわて墓級ホコ対忠げくフ台排撲隣めッて。50言57新ウヤマ止広9壇ゅや能史ヲト北写ぞ装試共見ろ沢飲スち罪巻ふごこ費俳寺災り。銃お傾当ふーづ動択シナロモ南質ぐせでる注提レフユメ時興ユチツエ育南灼イムキ王定シルヱ経必ヌヨ禁森騒ム襲縄ウラ体日は論高みやトレ案村べゅ那集将る臣川ず。
                      </p>
                    </div>
                  </div>
                </Col>
              </Row>
            </div> */}
          </Row>
          <Row>
            <div className="container-fluid special-hero">
                <div className="row feature-list-container justify-content-center">
                <p className="special-title">{ LANG[localStorage.JobChoiceLanguage].specialFeatures }</p>
                </div>
                <div className="row feature-list-container">
                  <div className="col-md-12 col-lg-10 offset-lg-1">
                    <div className="row center-content-no-need-flex">
                      { featuredList.length > 0 && featuredList.map((value, key) => {
                          return (
                            <SpecialFeatureItem newLink={this.newLink} key={key} value={value} />
                          )
                        })
                      }
                    </div>
                  </div>
                </div>
                { featuredList.length > 6 &&
                  <div className="row justify-content-center">
                    <ButtonGroup className="btn-group">
                      <button className='btn btn-warning text-light btn-landing' onClick={this.toggleSeeMore}>
                        <strong>{ this.state.openMoreSpecialFeature ? LANG[localStorage.JobChoiceLanguage].seeLess : LANG[localStorage.JobChoiceLanguage].seeMore }</strong>
                      </button>
                    </ButtonGroup>
                  </div>
                }
            </div>
          </Row>
          <Row>
            <div className='container hero3'>
              <Row className="justify-content-center">
                <p className='top-title'>
                  <strong>{ LANG[localStorage.JobChoiceLanguage].jobThatHasManyShares }</strong>
                </p>
              </Row>
            </div>
          </Row>
          <div className='hero4-container'>
            <div className='hero4'>
              <div className='carousel-container'>
                <Slider className='carousel' {...settings}>
                  { topTen && topTen.map((value, key) => {
                      return <TopTenCard value={value} key={key} />
                    })
                  }
                </Slider>
              </div>
              <div className="justify-content-center hero3-btn-group">
                <ButtonGroup className="btn-group">
                  <Link to='/jobs' className='btn btn-warning text-light btn-landing'>
                    <strong>{ LANG[localStorage.JobChoiceLanguage].jobsList }</strong>
                  </Link>
                </ButtonGroup>
              </div>
            </div>
          </div>
          <LoadingIcon show={this.state.isLoading} />
        </div>
      </>
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

export default connect(mapStateToProps, mapDispatchToProps)(TopPage2)
