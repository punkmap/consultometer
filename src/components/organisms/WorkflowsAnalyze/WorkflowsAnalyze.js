import React, { Component } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";


import { setWorkflow } from '../../../actions';
import MeetingsListPast from '../../molecules/MeetingsListPast';
import AttendeeListPast from '../../molecules/AttendeeListPast';
import ProjectListPast from '../../molecules/ProjectListPast';
import RadioButtons from '../../atoms/RadioButtons';

import { config } from '../../../config'
import store from '../../../store';

    
class WorkflowAdd extends Component {
  constructor(props){
    super(props)
    this.state = {
      pastMeetings: store.getState().pastMeetings.meetings,
      pastAttendeeMeetings: null,
      radioOptions: [
        { value: 'meetings', label: 'Meetings' },
        { value: 'projects', label: 'Projects' },
        { value: 'people', label: 'People' }
      ],
      radioValue: 'meetings',
    }
  }
  close() {
    this.props.setWorkflow('mainPage');
  }
  handleRadioChange (radioValue) {
    if (radioValue === 'projects'){
      // this.getProjects().then(()=>{
        this.getProjects().then((response)=>{
          const pastProjectMeetings = response.data.projects;
          this.setState({radioValue, pastProjectMeetings},()=>{
          });
        })
      // })
    }
    else if (radioValue === 'people'){
      this.getPeople().then((response)=>{
        const pastAttendeeMeetings = response.data.attendees
        this.setState({radioValue, pastAttendeeMeetings});
      })
    } else {
      this.setState({radioValue});
    }
  }
  getPeople() {
    return new Promise(async (resolve, reject) => {
      const url = config.API_URL + '/api/attendee-meeting-cost';
      const params = { token: store.getState().loginAction.loginAction.token };
      const response = await axios.get(url, {
        params
      })
      if( response.status === 200 ) {
        resolve(response);
      } else {
        reject(response);
      }
    });  
  }
  getProjects() {
    return new Promise(async (resolve, reject) => {
      const url = config.API_URL + '/api/project-meeting-cost';
      const params = { token: store.getState().loginAction.loginAction.token };
      const response = await axios.get(url, {
        params
      })
      if( response.status === 200 ) {
        resolve(response);
      } else {
        reject(response);
      }
    });  
  }
  render() {
    let costTool
    if(this.state.radioValue === 'meetings') {
      costTool = <MeetingsListPast meetings={this.state.pastMeetings}/>
                 
    } 
    else if (this.state.radioValue === 'projects'){
      costTool = <Typography variant="h4" gutterBottom>
                    <ProjectListPast projects={this.state.pastProjectMeetings}/>
                  </Typography>
    }
    else if (this.state.radioValue === 'people'){
      costTool =  <AttendeeListPast attendees={this.state.pastAttendeeMeetings}/>
    }
    return (
      <div >
        <Grid container
          direction="column"
          justify="center"
          alignItems="center"
          style={{ minHeight: '100vh' }}>
          <RadioButtons 
            radioOptions={this.state.radioOptions}
            handleChange={this.handleRadioChange.bind(this)}
          />
          <Grid item>{costTool}</Grid>
          <Grid item>
            <Button variant="contained" color="primary" onClick={this.close.bind(this)}>
              close
            </Button>
          </Grid>
        </Grid>
      </div>
    )
  }
}

export default connect(null, { setWorkflow })(WorkflowAdd);