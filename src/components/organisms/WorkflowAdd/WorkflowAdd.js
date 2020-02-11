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
      meetings: props.meetings,
      title: '',
      dateTime: '',
      project: {name: ''},
      attendees: []
    }
    console.log('woprkflowadd meetings: ', this.state.meetings)
    // const meetingsWatch = watch(store.getState, 'meetings.meetings')
    // store.subscribe(meetingsWatch((newVal, oldVal, objectPath) => {
    //   this.setState({meetings: newVal}, () => {
    //     console.log('ADD this.state.meetings: ', this.state.meetings);
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
  save() {
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

    console.log("DATA: ", data)

    const headers = {
      'Content-Type': 'application/json',
      //'Authorization': 'JWT fefege...'TODO: JWT authentication
    }
    
    axios.post('http://api:api@64.225.122.227:5984/consultometer', data, {
        headers: headers
      })
      .then((response) => {
        console.log('response: ', response);
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
        console.log('this.state.meetings: ', this.state.meetings);
        const newMeetings = [...this.state.meetings, newMeeting];
        console.log("newMeetings: ", newMeetings);
        this.props.allMeetings(newMeetings);
        // dispatch({
        //   type: FOUND_USER,
        //   data: response.data[0]
        // })

      })
      .catch((error) => {
        console.log('error: ', error);
        // dispatch({
        //   type: ERROR_FINDING_USER
        // })
      })
    
    // var headers = new Headers();
    // const url = 'http://api:api@64.225.122.227:5984/consultometer'
    // axios.get(url)
    // .then((response) => {
    //   console.log('CouchDB response: ', response);
    // })
    this.props.setWorkflow('mainPage');
    this.nextPath('/');
  }
  render() {
    const { classes } = this.props;
    return (
    <Grid container
      direction="column"
      justify="center"
      alignItems="center"
      style={{ minHeight: '100vh' }}>
      <MeetingTitle title={this.state.title} updateTitle={this.updateTitle.bind(this)}></MeetingTitle>
      <MuiPickersUtilsProvider utils={MomentUtils.bind(this)}>
        <MeetingDateTime dateTime={new Date()} updateDate={this.updateDate.bind(this)}></MeetingDateTime>
      </MuiPickersUtilsProvider>
      <ProjectSelect project={this.state.project} updateProject={this.updateProject.bind(this)}></ProjectSelect>
      <AttendeesSelect updateAttendees={this.updateAttendees.bind(this)}></AttendeesSelect>
      <Grid item xs={12}>
        <Button variant="contained" color="primary" onClick={this.cancel.bind(this)}>
          cancel
        </Button>
        <Button variant="contained" color="primary" onClick={this.save.bind(this)}>
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
