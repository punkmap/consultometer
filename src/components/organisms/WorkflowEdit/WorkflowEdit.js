import React, { Component } from 'react';
import PropTypes from 'prop-types';
//import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import Grid from '@material-ui/core/Grid';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import { updateMeeting } from '../../../util'


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
  }
});
class WorkflowAdd extends Component {
  constructor(props){
    super(props)
    this.state = {
      _id: this.props.editMeeting._id,
      _rev: this.props.editMeeting._rev,
      title: this.props.editMeeting.title,
      purpose: this.props.editMeeting.purpose,
      dateTime: new Date(this.props.editMeeting.dateTime),
      durationMS: this.props.editMeeting.durationMS,
      durationHMS: this.props.editMeeting.durationHMS,
      project: this.props.editMeeting.project,
      attendees: this.props.editMeeting.attendees,
      meetings: this.props.meetings,
      readOnly: this.props.readOnly,
      isEditing: this.props.isEditing,
      authToken: this.props.authToken,
    }
    this._isMounted = false;
  }
  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };
  // nextPath(path) {
  //   this.props.history.push(path);
  // }
  updateTitle(title){
    this.setState({title});
  }
  updatePurpose(purpose){
    this.setState({purpose});
  }
  updateDate(dateTime){
    this.setState({dateTime});
  }
  updateProject(project){
    this.setState({project});
  }
  updateAttendees(attendees){
    this.setState({attendees});
  }
  edit() {
    this.setState({readOnly: !this.state.readOnly})
  }
  cancel() {
    this.props.setWorkflow('mainPage');
    
  }
  componentDidMount() {
    let dateTime = Date.parse(this.props.editMeeting.dateTime);
    dateTime += 3600000
  }
  async update() {
    // validate form
    // save meeting 
    //return to main
    const meeting = {
      _id: this.state._id,
      _rev: this.state._rev,
      type: 'meeting',
      title: this.state.title,
      purpose: this.state.purpose,
      dateTime: this.state.dateTime,
      durationMS: this.state.durationMS,
      durationHMS: this.state.durationHMS,
      project: this.state.project,
      attendees: this.state.attendees,
    };
    const response = await updateMeeting(meeting, this.state.authToken);
    const updatedMeeting = {
      id: response.data.body.id, 
      key: response.data.body.id,
      value: {
        _id: response.data.body.id, 
        _rev: response.data.body.rev,
        type: 'meeting',
        title: this.state.title,
        purpose: this.state.purpose,
        dateTime: this.state.dateTime,
        durationMS: this.state.durationMS,
        durationHMS: this.state.durationHMS,
        project: this.state.project,
        attendees: this.state.attendees,
      }
    }
    let meetings = [...this.state.meetings]
    const meetingIndex = this.state.meetings.findIndex(meeting => meeting.id === response.data.body.id);
    meetings[meetingIndex] = updatedMeeting;
    this.props.allMeetings(meetings);
    this.props.setWorkflow('mainPage');
  }
  render() {
    const { classes } = this.props;
    let editButton; 
    if (this.props.readOnly) {
      editButton = <IconButton 
        aria-label="delete" 
        className={classes.margin} 
        onClick={this.edit.bind(this)}
      >
        <EditIcon fontSize="small" />
      </IconButton>;
    }
    return (
      <div className={classes.root}>  
        <Grid 
          container
          direction="column"
          justify="center"
          alignItems="center"
          style={{ minHeight: '100vh' }}>
          {editButton}
          <Grid item xs={6} md={6} lg={6}>
            <MeetingTitle 
              title={this.state.title} 
              updateTitle={this.updateTitle.bind(this)}
              readOnly={this.state.readOnly}
            />
            <MeetingPurpose 
              purpose={this.state.purpose} 
              updatePurpose={this.updatePurpose.bind(this)}
              readOnly={this.state.readOnly}
            />
            <MuiPickersUtilsProvider utils={MomentUtils.bind(this)}>
              <MeetingDateTime 
                dateTime={this.state.dateTime} 
                updateDate={this.updateDate.bind(this)}
                readOnly={this.state.readOnly}
                isEdit={true}
              />
            </MuiPickersUtilsProvider>
            <ProjectSelect 
              project={{name: this.state.project}} 
              updateProject={this.updateProject.bind(this)}
              readOnly={this.state.readOnly}
            />
            <AttendeesSelect 
              attendees={this.state.attendees} 
              authToken={this.state.authToken}
              updateAttendees={this.updateAttendees.bind(this)}
              readOnly={this.state.readOnly}
            />
            <Grid item xs={12} className={classes.buttonBar}>
              <Button variant="contained" color="primary" onClick={this.cancel.bind(this)}>
                cancel
              </Button>
              <Button variant="contained" color="primary" onClick={this.update.bind(this)}>
                update
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </div>
    )
  }
}
WorkflowAdd.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(connect(null, { setWorkflow, allMeetings })(WorkflowAdd));
