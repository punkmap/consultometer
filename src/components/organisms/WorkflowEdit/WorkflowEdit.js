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
import ProjectSelect from '../../molecules/ProjectSelect'
import MeetingDateTime from '../../molecules/MeetingDateTime'
//const history = useHistory();
const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    // marginLeft: theme.spacing.unit,
    // marginRight: theme.spacing.unit,
    width: 200,
  },
  dense: {
    marginTop: 19,
  },
  menu: {
    width: 200,
  },
});
class WorkflowAdd extends Component {
  constructor(props){
    super(props)
    this.state = {
      _id: this.props.editMeeting._id,
      _rev: this.props.editMeeting._rev,
      title: this.props.editMeeting.title,
      dateTime: new Date(this.props.editMeeting.dateTime),
      project: this.props.editMeeting.project,
      attendees: this.props.editMeeting.attendees,
      meetings: this.props.meetings,
    }
    
  }
  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };
  nextPath(path) {
    this.props.history.push(path);
  }
  updateTitle(title){
    this.setState({title});
  }
  updateDate(dateTime){
    console.log('dateTime: ', dateTime);
    this.setState({dateTime});
  }
  updateProject(project){
    this.setState({project});
  }
  updateAttendees(attendees){
    this.setState({attendees});
  }
  cancel() {
    this.props.setWorkflow('mainPage');
    this.nextPath('/');
  }
  update() {
    // validate form
    // save meeting 
    //return to main
    const meeting = {
      _id: this.state._id,
      _rev: this.state._rev,
      type: 'meeting',
      title: this.state.title,
      dateTime: this.state.dateTime,
      project: this.state.project,
      attendees: this.state.attendees,
    };

    console.log("MEETING: ", meeting);

    const headers = {
      'Content-Type': 'application/json',
      //'Authorization': 'JWT fefege...'TODO: JWT authentication
    }
    
    axios.put('http://api:api@64.225.122.227:5984/consultometer/'+this.state._id, meeting, {
        headers: headers
      })
      .then((response) => {
        console.log('response: ', response);
        const updatedMeeting = {
          id: response.data.id, 
          key: response.data.id,
          value: {
            _id: response.data.id, 
            _rev: response.data.rev,
            type: 'meeting',
            title: this.state.title,
            dateTime: this.state.dateTime,
            project: this.state.project.name,
            attendees: this.state.attendees,
          }
        }
        console.log('this.state.meetings: ', this.state.meetings);
        const meetings = this.state.meetings.filter(function( obj ) {
          return obj.id !== response.data.id;
        });
        meetings.push(updatedMeeting);
        console.log('MEETINGS: ', meetings);
        this.props.allMeetings(meetings);
        // const newMeetings = [...this.state.meetings, newMeeting];
        // console.log("newMeetings: ", newMeetings);
        // this.props.allMeetings(newMeetings);
        
      })
      .catch((error) => {
        console.log('error: ', error);
        
      })
    this.props.setWorkflow('mainPage');
    this.nextPath('/');
  }
  componentDidMount() {
    console.log('WorkflowEdit attendees: ', this.state.attendees);
    // console.log('WorkflowEdit didMount: ', this.props.editMeeting);
    // this.setState({
    //   title: this.props.editMeeting.title,
    //   dateTime: new Date(this.props.editMeeting.dateTime),
    //   project: this.props.editMeeting.project,
    //   attendees: this.props.editMeeting.attendees,
    // }, () => {
    //   console.log("this.state: ", this.state);
    // })
  }
  render() {
    const { classes } = this.props;

    console.log('Workflow Edits: ', this.state.attendees);
    return (
    <Grid container
      direction="column"
      justify="center"
      alignItems="center"
      style={{ minHeight: '100vh' }}>
        <p>edit</p>  
      <MeetingTitle title={this.state.title} updateTitle={this.updateTitle.bind(this)}></MeetingTitle>
      <MuiPickersUtilsProvider utils={MomentUtils.bind(this)}>
        <MeetingDateTime dateTime={this.state.dateTime} updateDate={this.updateDate.bind(this)}></MeetingDateTime>
      </MuiPickersUtilsProvider>
      <ProjectSelect project={{name: this.state.project}} updateProject={this.updateProject.bind(this)}></ProjectSelect>
      <AttendeesSelect attendees={this.state.attendees} updateAttendees={this.updateAttendees.bind(this)}></AttendeesSelect>
      <Grid item xs={12}>
        <Button variant="contained" color="primary" onClick={this.cancel.bind(this)}>
          cancel
        </Button>
        <Button variant="contained" color="primary" onClick={this.update.bind(this)}>
          save
        </Button>
      </Grid>
    </Grid>
    )
  }
}
WorkflowAdd.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(connect(null, { setWorkflow, allMeetings })(WorkflowAdd)));