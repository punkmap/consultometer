import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { instanceOf } from 'prop-types';
import { useCookies, withCookies, Cookies } from 'react-cookie';
//import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

import { connect } from 'react-redux';
import axios from 'axios';


import { setWorkflow, futureMeetings } from '../../../actions';

import AttendeesSelect from '../../molecules/AttendeesSelect'
import MeetingTitle from '../../molecules/MeetingTitle'
import MeetingPurpose from '../../molecules/MeetingPurpose'
import ProjectSelect from '../../molecules/ProjectSelect'
import MeetingDateTime from '../../molecules/MeetingDateTime'

import { config } from '../../../config'
//const history = useHistory();
const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  buttonBar: {
    margin: "1rem"
  },
  actionGrid: {
    padding: theme.spacing(2),
    textAlign: 'center',
  },
});
class WorkflowAdd extends Component {
  constructor(props){
    super(props);
    const { cookies } = props;
    this.state = {
      meetings: props.meetings,
      title: '',
      purpose: '',
      dateTime: '',
      project: {name: ''},
      attendees: [],
      timesDateTimeChanged: 0,
      formValidated: false,
      authToken: cookies.get('authToken'),
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
      const dateTimeValid = this.state.timesDateTimeChanged > 0;
      const projectValid = this.state.project.name.length > 0;
      const attendeesValid = this.state.attendees.length > 0;
    if(titleValid && dateTimeValid && projectValid && attendeesValid) {
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
  async addMeeting() {
    const meeting = {
      type: 'meeting',
      title: this.state.title,
      purpose: this.state.purpose,
      durationMS: 0,
      durationAVMS: 0,
      durationHMS: '',
      dateTime: this.state.dateTime,
      project: this.state.project.name,
      attendees: this.state.attendees,
      rate: this.state.attendees.reduce((a1, a2) => { return a1.value ? a1.value.rate : a1 + a2.value.rate
      }),
    };
    
    const headers = {
      'Content-Type': 'application/json',
    }
    const authToken = this.state.authToken;
    axios.post(config.API_URL+'/api/meeting', { meeting, authToken }, {
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
              rate: this.state.attendees.reduce((a1, a2) => a1.value ? a1.value.rate : a1 + a2.value.rate),
            }
          }
          const newMeetings = [...this.state.meetings, newMeeting];
          this.props.futureMeetings(newMeetings.sort((a, b) => (new Date(a.value.dateTime) > new Date(b.value.dateTime)) ? 1 : -1));  
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
          style={{ minHeight: '80vh' }}>
          <Grid item >
            <MeetingTitle title={this.state.title} updateTitle={this.updateTitle.bind(this)}></MeetingTitle>
            <MeetingPurpose purpose={this.state.purpose} updatePurpose={this.updatePurpose.bind(this)}/>
            <MuiPickersUtilsProvider utils={MomentUtils.bind(this)}>
              <MeetingDateTime dateTime={new Date()} updateDate={this.updateDate.bind(this)}></MeetingDateTime>
            </MuiPickersUtilsProvider>
            <ProjectSelect project={this.state.project} updateProject={this.updateProject.bind(this)}></ProjectSelect>
            <AttendeesSelect 
              //authToken={this.state.authToken}
              updateAttendees={this.updateAttendees.bind(this)}
            />
            <Grid container className={classes.buttonBar}>
              <Grid item className={classes.actionGrid}>
                <Button 
                  className={classes.button}
                  variant="contained" 
                  color="primary" 
                  onClick={this.cancel.bind(this)}
                >
                  cancel
                </Button>
              </Grid>
              <Grid item className={classes.actionGrid}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  disabled={!this.state.formValidated}
                  onClick={this.addMeeting.bind(this)}
                >
                  add
                </Button>
              </Grid>
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

export default withCookies(withStyles(styles)(connect(null, { setWorkflow, futureMeetings })(WorkflowAdd)));
