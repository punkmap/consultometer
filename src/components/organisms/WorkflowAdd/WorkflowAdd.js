import React, { Component } from 'react';
import PropTypes from 'prop-types';
//import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import axios from 'axios';


import { setWorkflow, allMeetings } from '../../../actions';

import AttendeesSelect from '../../molecules/AttendeesSelect'
import MeetingTitle from '../../molecules/MeetingTitle'
import MeetingPurpose from '../../molecules/MeetingPurpose'
import ProjectSelect from '../../molecules/ProjectSelect'
import MeetingDateTime from '../../molecules/MeetingDateTime'
//const history = useHistory();
const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  buttonBar: {
    margin: "1rem"
  },
  
});
class WorkflowAdd extends Component {
  constructor(props){
    super(props)
    this.state = {
      meetings: props.meetings,
      title: '',
      purpose: '',
      dateTime: '',
      project: {name: ''},
      attendees: [],
      timesDateTimeChanged: 0,
      formValidated: false,
      authToken: this.props.authToken,
    }
  }
  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };
  // nextPath(path) {
  //   this.props.history.push(path);
  // }
  updateTitle(title){
    this.setState({title}, () => {
      this.formValidation()
    });
  }
  updatePurpose(purpose){
    this.setState({purpose}, () => {
      this.formValidation()
    });
  }
  updateDate(dateTime, timesDateTimeChanged){
    this.setState({dateTime, timesDateTimeChanged}, () => {
      this.formValidation()
    });
  }
  updateProject(project){
    this.setState({project}, () => {
      this.formValidation()
    });
  }
  updateAttendees(attendees){
    this.setState({attendees}, () => {
      this.formValidation()
    });
  }
  formValidation() {
      const titleValid = this.state.title.length > 0;
      const purposeValid = this.state.purpose.length > 0;
      const dateTimeValid = this.state.timesDateTimeChanged > 0;
      const projectValid = this.state.project.name.length > 0;
      const attendeesValid = this.state.attendees.length > 0;
    if(titleValid && purposeValid && dateTimeValid && projectValid && attendeesValid) {
      this.setState({formValidated: true});
    } else {
      if (this.state.formValidated === true){
        this.setState({formValidated: false});
      }
    }
  }
  cancel() {
    this.props.setWorkflow('mainPage');
  }
  componentDidMount() {
    this._isMounted = true
  }
  componentWillUnmount() {
    this._isMounted = false
  }
  async save() {
    // validate form
    // save meeting 
    //return to main
    const meeting = {
      type: 'meeting',
      title: this.state.title,
      purpose: this.state.purpose,
      dateTime: this.state.dateTime,
      project: this.state.project.name,
      attendees: this.state.attendees,
    };
    
    const headers = {
      'Content-Type': 'application/json',
    }
    const authToken = this.state.authToken;
    axios.post('http://localhost:5000/api/meeting', { meeting, authToken }, {
        headers: headers,
    })
    .then((response) => {
        if (response.status === 200) {
          const newMeeting = {
            id: response.data.body.id, 
            key: response.data.body.id,
            value: {
              _id: response.data.body.id, 
              _rev: response.data.body.rev,
              type: 'meeting',
              title: this.state.title,
              purpose: this.state.purpose,
              dateTime: this.state.dateTime,
              project: this.state.project.name,
              attendees: this.state.attendees,
            }
          }
          const newMeetings = [...this.state.meetings, newMeeting];
          this.props.allMeetings(newMeetings);  
        }
    })
    .catch((error) => {
        console.error(error);
    })
      
    this.props.setWorkflow('mainPage');
  }
  render() {
    const { classes } = this.props;
    return (
      <form className={classes.root}>  
        <Grid 
          container
          direction="column"
          justify="center"
          alignItems="center"
          style={{ minHeight: '100vh' }}>
          <Grid item >
            <MeetingTitle title={this.state.title} updateTitle={this.updateTitle.bind(this)}></MeetingTitle>
            <MeetingPurpose purpose={this.state.purpose} updatePurpose={this.updatePurpose.bind(this)}/>
            <MuiPickersUtilsProvider utils={MomentUtils.bind(this)}>
              <MeetingDateTime dateTime={new Date()} updateDate={this.updateDate.bind(this)}></MeetingDateTime>
            </MuiPickersUtilsProvider>
            <ProjectSelect project={this.state.project} updateProject={this.updateProject.bind(this)}></ProjectSelect>
            <AttendeesSelect 
              authToken={this.state.authToken}
              updateAttendees={this.updateAttendees.bind(this)}
            />
            <Grid item xs={12} className={classes.buttonBar}>
              <Button 
                className={classes.button}
                variant="contained" 
                color="primary" 
                onClick={this.cancel.bind(this)}
              >
                cancel
              </Button>
              <Button 
                variant="contained" 
                color="primary" 
                disabled={!this.state.formValidated}
                onClick={this.save.bind(this)}
              >
                save
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </form>
    )
  }
}
WorkflowAdd.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(connect(null, { setWorkflow, allMeetings })(WorkflowAdd));
