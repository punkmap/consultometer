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
      meetings: props.meetings,
      title: '',
      dateTime: '',
      project: {name: ''},
      attendees: []
    }

    // const meetingsWatch = watch(store.getState, 'meetings.meetings')
    // store.subscribe(meetingsWatch((newVal, oldVal, objectPath) => {
    //   this.setState({meetings: newVal}, () => {
    //   });
    // }))
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
  updateDate(dateTime){
    this.setState({dateTime});
  }
  updateProject(project){
    this.setState({project});
  }
  updateAttendees(attendees){
    this.setState({attendees});
  }

  nextPath(path) {
    this.props.history.push(path);
  }
  cancel() {
    this.props.setWorkflow('mainPage');
    this.nextPath('/');
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
    const data = {
      type: 'meeting',
      title: this.state.title,
      dateTime: this.state.dateTime,
      project: this.state.project.name,
      attendees: this.state.attendees,
    };

    const headers = {
      'Content-Type': 'application/json',
      //'Authorization': 'JWT fefege...'TODO: JWT authentication
    }
      const response = await axios.post('http://api:api@64.225.122.227:5984/consultometer', data, {
        headers: headers
      })
      if (this._isMounted) {
        const newMeeting = {
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
        const newMeetings = [...this.state.meetings, newMeeting];
        this.props.allMeetings(newMeetings);  
      }
      // axios.post('http://api:api@64.225.122.227:5984/consultometer', data, {
      //   headers: headers
      // })
      // .then((response) => {
      //   const newMeeting = {
      //     id: response.data.id, 
      //     key: response.data.id,
      //     value: {
      //       _id: response.data.id, 
      //       _rev: response.data.rev,
      //       type: 'meeting',
      //       title: this.state.title,
      //       dateTime: this.state.dateTime,
      //       project: this.state.project.name,
      //       attendees: this.state.attendees,
      //     }
      //   }
      //   const newMeetings = [...this.state.meetings, newMeeting];
      //   this.props.allMeetings(newMeetings);
      // })
      // .catch((error) => {
      // })
    this.props.setWorkflow('mainPage');
    this.nextPath('/');
  }
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>  
        <Grid 
          container
          direction="column"
          justify="center"
          alignItems="center"
          style={{ minHeight: '100vh' }}>
          <Grid item >
            <MeetingTitle title={this.state.title} updateTitle={this.updateTitle.bind(this)}></MeetingTitle>
            <MuiPickersUtilsProvider utils={MomentUtils.bind(this)}>
              <MeetingDateTime dateTime={new Date()} updateDate={this.updateDate.bind(this)}></MeetingDateTime>
            </MuiPickersUtilsProvider>
            <ProjectSelect project={this.state.project} updateProject={this.updateProject.bind(this)}></ProjectSelect>
            <AttendeesSelect updateAttendees={this.updateAttendees.bind(this)}></AttendeesSelect>
            <Grid item xs={12} className={classes.buttonBar}>
              <Button variant="contained" color="primary" onClick={this.cancel.bind(this)}>
                cancel
              </Button>
              <Button variant="contained" color="primary" onClick={this.save.bind(this)}>
                save
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

export default withRouter(withStyles(styles)(connect(null, { setWorkflow, allMeetings })(WorkflowAdd)));
