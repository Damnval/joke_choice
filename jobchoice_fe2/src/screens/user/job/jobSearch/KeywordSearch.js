import React from 'react'
import '../Jobs.scss'
import '../../../../utilities/api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import  { withRouter } from 'react-router-dom';

class KeywordSearch extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      keyword: null,
      status: ''
    }
  }

  handleSubmit = e => {
    e.preventDefault()
    if (this.state.keyword) {
      this.props.history.push({pathname:'/jobs', state:{keyword:this.state.keyword}})
    }
  }

  handleChange = e => {
    e.preventDefault();
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit} className='keyword'>
        <input
          type='text'
          className='keyword-search' 
          name='keyword' 
          placeholder={LANG[localStorage.JobChoiceLanguage].search}
          onChange={this.handleChange}
        />
        <button className='btn btn-submit' type='submit'><FontAwesomeIcon icon='search' /></button>
      </form>
    );
  }
}

export default withRouter(KeywordSearch);
