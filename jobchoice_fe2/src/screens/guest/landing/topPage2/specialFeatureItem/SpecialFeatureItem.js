import React, { Component } from 'react';

class SpecialFeatureItem extends Component {

  render() {
    const {key, value} = this.props
    return (
      <div key={key} className="col-md-4 col-sm-12 col-sm-12">
        <div className="feature-container" onClick={() => this.props.newLink(value.id)}>
          <div className="feature-image">
            <img src={value.images[0].image_path} alt="special feature" />
          </div>
          <div className="feature-content"><span>{localStorage.JobChoiceLanguage === 'US' ? value.title_en : value.title_jp}</span></div>
        </div>
      </div>
    )

  }
  
}

export default SpecialFeatureItem
