import React, { Component } from 'react'
import JobChoiceLayout from '../../../layouts/jobChoiceLayout/JobChoiceLayout'
import "./ShareMates.css"
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

class ShareMates extends Component {
  constructor(props) {
    super(props);

    this.state = {
      shareMates: [
                   {id:'Share Mate 1'},
                   {id:'Share Mate 2'}, 
                   {id:'Share Mate 3'}, 
                   {id:'Share Mate 4'},
                   {id:'Share Mate 5'}, 
                   {id:'Share Mate 6'}, 
                   {id:'Share Mate 7'}, 
                   {id:'Share Mate 8'}, 
                   {id:'Share Mate 9'}, 
                   {id:'Share Mate 10'}
                  ],
      shareMate: [],
    };
  }

  shareMateDetails = (id) => {
    alert(id)
  };

  render() {

    if (!(this.props.user.data.job_seeker)) {
      return (<Redirect to="/home" />)
    }
    
    return (
      <div>
        <JobChoiceLayout>
          <div className='box'>
            <div className='box-box'>  
            <h1>Your Share Mates</h1>
              <form>
                <div className="register">
                  <div className='shareMates-set'>
                    {(this.state.shareMates) && (this.state.shareMates.map((value, key) => {
                      return (
                        <div
                          key={key}
                          className={`shareMates ${this.state.shareMate.includes(value.id)?'active':''}`}
                          value={value.id}
                          onClick={()=>{this.shareMateDetails(value.id)}}>
                          <div className="image-box">image</div>
                          {value.id}  
                        </div>
                      )
                    }))}      
                  </div>
                </div>
              </form>
            </div>
          </div>
        </JobChoiceLayout>
      </div>
    )

  }
  
}

const mapStateToProps = state => {
  return state
}

export default connect(mapStateToProps)(ShareMates)
