import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { setWorkflow, pastMeetings } from '../../../actions';
import axios from 'axios';
import store from '../../../store';
import { config } from '../../../config'

const styles = theme => ({
  button: {
    padding: '1rem',
  } 
});
class MeetingsAnalyze extends Component {
  constructor(props){
    super(props)
    this.state = {
      
    }
  }

  getPastMeetings(token) {
    return new Promise(async (resolve, reject) => {
      const url = config.API_URL + '/api/meetings-past';
      const params = { token };
      const response = await axios.get(url, {
        params
      })
      if( response.status === 200 ) {
        resolve(response.data.body.rows);
      } else {
        reject(response);
      }
    });  
  }
  analyzeMeetings() {
    //check to see if past meetings have been retrieved
    if(store.getState().pastMeetings.meetings.length === 0){
      //if not retrieve them send them out as san action
      //flip to the analyzeMeetings page
      this.getPastMeetings(store.getState().loginAction.loginAction.token).then((meetings) => {
        this.props.pastMeetings(meetings);
        this.props.setWorkflow('analyzeMeetings');
      });
    } else {
      //flip to the analyzeMeetings page
      this.props.setWorkflow('analyzeMeetings');
    }
  }
  render() {
    return (
      <Button variant="contained" color="primary" onClick={this.analyzeMeetings.bind(this)}>
        Analyze
      </Button>
    )
  }
}

export default withStyles(styles)(connect(null, { setWorkflow, pastMeetings })(MeetingsAnalyze));