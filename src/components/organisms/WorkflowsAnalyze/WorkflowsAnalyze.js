import React, { Component } from 'react';
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
import RadioButtons from '../../atoms/RadioButtons';

import store from '../../../store';

    
class WorkflowAdd extends Component {
  constructor(props){
    super(props)
    this.state = {
      pastMeetings: store.getState().pastMeetings.meetings,
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
  handleRadioChange (value) {
    this.setState({radioValue: value});
  }
  render() {
    let costTool
    if(this.state.radioValue === 'meetings') {
      costTool = <Typography variant="h4" gutterBottom>
                    <MeetingsListPast meetings={this.state.pastMeetings}/>
                  </Typography>
    } 
    else if (this.state.radioValue === 'projects'){
      costTool = <Typography variant="h4" gutterBottom>
                    Projects
                  </Typography>
    }
    else if (this.state.radioValue === 'people'){
      costTool = <Typography variant="h4" gutterBottom>
                    People
                  </Typography>
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
          {costTool}
          <Button variant="contained" color="primary" onClick={this.close.bind(this)}>
            close
          </Button>
        </Grid>
      </div>
    )
  }
}

export default connect(null, { setWorkflow })(WorkflowAdd);