import React, { useEffect, Fragment }from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import AppBar from './components/molecules/AppBar'
import MeetingsListFuture from './components/molecules/MeetingsListFuture'
import MeetingAdd from './components/molecules/MeetingAdd';
import MeetingsAnalyze from './components/molecules/MeetingsAnalyze';
import Timer from './components/molecules/Timer';
import WorkflowAdd from "./components/organisms/WorkflowAdd";
import WorkflowEdit from "./components/organisms/WorkflowEdit";
import WorkflowsAnalyze from "./components/organisms/WorkflowsAnalyze";
import axios from 'axios';
import { connect } from 'react-redux';

import store from './store'
import watch from 'redux-watch';
import { config } from './config'

import { editMeeting } from './actions';
import { red } from "@material-ui/core/colors";

const styles = theme => ({
  button: {
    padding: theme.spacing(2),
  }, 
  buttonBar: {
    margin: "1rem"
  },
  actionGrid: {
    padding: theme.spacing(2),
    textAlign: 'center',
  }
});

function LoggedIn (props) {
  return <Fragment>
    
    
    <Grid item xs={12}>
      {/* <Timer/>   */}
    </Grid>
    <Grid item xs={12}>
      <Typography variant="h4" gutterBottom>
      </Typography>
      
      <MeetingsListFuture meetings={props.meetings} filterMeetings={props.filterMeetings} authToken={props.authToken}></MeetingsListFuture>
    </Grid>
    <Grid item xs={12} className={props.classes.buttonBar}>
      <Grid container  direction="row" justify="center">
        <Grid item className={props.classes.actionGrid}>
          <MeetingsAnalyze className={props.classes.buttonBar}/>
          </Grid>
        <Grid item className={props.classes.actionGrid}>  
          <MeetingAdd className={props.classes.buttonBar}/>
        </Grid>
      </Grid>
    </Grid>
  </Fragment>
}
function NotLoggedIn (props) {
  return <h3>Log in to get started</h3>
}
class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      appWorkflow: 'mainPage',
      isLoggedIn: false,
      meetingsGotten: false,
      meetings: [],
      searchMeetings: [],
      editMeeting: null,
      authToken: '',
    }
    this._isMounted = false;
    const editMeetingWatch = watch(store.getState, 'editMeeting.meeting.value')
    store.subscribe(editMeetingWatch((newVal, oldVal, objectPath) => {
        this.setEditMeeting(newVal);
    }));
    const futureMeetingsWatch = watch(store.getState, 'futureMeetings.meetings')
    store.subscribe(futureMeetingsWatch((newVal, oldVal, objectPath) => {
      console.log('FUTUREMEETINGS')  
      this.setMeetings(newVal);
    }));
    const loginWatch = watch(store.getState, 'loginAction')
    store.subscribe(loginWatch((newVal, oldVal, objectPath) => {
        this.loginStateHandler(newVal.loginAction);
    }));
    const appWorkflowWatch = watch(store.getState, 'appWorkflow.workflow')
      store.subscribe(appWorkflowWatch((newVal, oldVal, objectPath) => {
      this.setState((state, props) => ({appWorkflow: newVal}))
    }))
  }
  componentDidMount() {
    this._isMounted = true;


console.log('CONFIG: ', config);
    if (!this.state.isLoggedIn){
       
    } else {

    }
    // if (!this.state.meetingsGotten){
    //   this.setState({meetingsGotten: true}, () => {
    //     this.getMeetings();
    //   })
    // }
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  setEditMeeting(editMeeting) {
    if (this._isMounted) {
      this.setState({
          editMeeting,
      })
    }
  }
  setMeetings(meetings) {
    if (this._isMounted) {
      console.log('SET MEETINGS: ', meetings);
      this.setState({
          meetings,
          searchMeetings: meetings,
      })
    }
  }
  notLoggedIn() {
    return <Button>Login</Button>
  }
  loginStateHandler(loginState) {
    if(loginState.loggedIn === true){
      this.getMeetings(loginState.token);
      this.setState({authToken: loginState.token}, () => {
      });
    }
  }
  async getMeetings (token) {
    const url = config.API_URL + '/api/meetings-future';
    const params = {token};
    const response = await axios.get(url, {
      params
    })

    if (this._isMounted) this.setState({
      meetings: response.data.body.rows.sort((a, b) => (new Date(a.value.dateTime) > new Date(b.value.dateTime)) ? 1 : -1),
      searchMeetings: response.data.body.rows.sort((a, b) => (new Date(a.value.dateTime) > new Date(b.value.dateTime)) ? 1 : -1),
    },() => {
      this.setState({isLoggedIn: true});
    });

  }
  filterMeetings(event) {
    const searchString = event.target.value;
    this.setState({
      searchMeetings: this.state.meetings.filter(meeting => 
        meeting.value.title.indexOf(searchString) > -1 || 
        meeting.value.project.indexOf(searchString) > -1
      )
    });
    

  }
  render() {

    const { classes } = this.props;
    const appWorkflow = this.state.appWorkflow;
    
    let landing;
    if(!this.state.isLoggedIn) {
      landing = <NotLoggedIn></NotLoggedIn>
    } else {
      landing = <LoggedIn classes={classes}
                  meetings={this.state.searchMeetings} 
                  filterMeetings={this.filterMeetings.bind(this)}
                  authToken={this.state.authToken}
                />
    }
    let workflowControls;
    switch (appWorkflow) {
      case 'mainPage':
        workflowControls = 
        <Grid container
          direction="column"
          justify="center"
          alignItems="center"
          style={{ minHeight: '100vh' }}
        >
          {landing}  
        </Grid>
        break;
      case 'addMeeting':
        workflowControls = 
        <WorkflowAdd  
          meetings={this.state.meetings}
          authToken={this.state.authToken}
        />
        break;
      case 'editMeeting':
        workflowControls = 
        <WorkflowEdit 
          editMeeting={this.state.editMeeting} 
          meetings={this.state.meetings}
          authToken={this.state.authToken}
          test={'test'}
        />
        break;
      case 'analyzeMeetings':
        workflowControls = 
        <WorkflowsAnalyze></WorkflowsAnalyze>
        break;
      default:
        break;
    }
    return (
        <div>
          <AppBar></AppBar>
          <header className="App-header">
          {workflowControls}
        </header>
        </div>
    );
  }
}

export default withStyles(styles)(connect(null, { editMeeting })(App));

