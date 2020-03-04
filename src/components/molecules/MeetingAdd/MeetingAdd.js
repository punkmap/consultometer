import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import { setWorkflow } from '../../../actions';

class MeetingAdd extends Component {
  constructor(props){
    super(props)
    this.state = {
      
    }
  }
  addMeeting() {
    this.props.setWorkflow('addMeeting');
  }
  render() {
    return (
      <Button variant="contained" color="primary" onClick={this.addMeeting.bind(this)}>
        Add
      </Button>
    )
  }
}


export default connect(null, { setWorkflow })(MeetingAdd);