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

import { setWorkflow } from '../../../actions';

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
      title: '',
      dateTime: '',
      project: '',
      attendees: ''
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
    this.setState({dateTime});
  }
  updateProject(project){
    this.setState({project});
  }
  updateAttendees(attendees){
    this.setState({attendees});
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
      <AttendeesSelect attendees={this.state.attendees} updateAttendees={this.updateAttendees.bind(this)}></AttendeesSelect>
      <Button variant="contained" color="primary" onClick={this.save.bind(this)}>
        save
      </Button>
    </Grid>
    )
  }
}
WorkflowAdd.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(connect(null, { setWorkflow })(WorkflowAdd)));