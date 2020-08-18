import React from 'react'

class DaysCheckBoxList extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      work_days: [
        {name: 'sunday',
         value: false
        },
        {name: 'monday',
         value: false
        },
        {name: 'tuesday',
         value: false
        }, 
        {name: 'wednesday',
         value: false
        },
        {name: 'thursday',
         value: false
        }, 
        {name: 'friday',
         value: false
        },
        {name: 'saturday',
         value: false
        }
       ],
    }

  }

  render() {
    return (
      <div className='days-container'>
        {this.state.work_days.map((value, key) => {
            return(this.renderCheckBox(key, value, 'workDays'))
          })
        }
      </div>
    )
  }
}

export default DaysCheckBoxList
