import React, { useEffect, Fragment }from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link
} from "react-router-dom";
import { instanceOf } from 'prop-types';
import { useCookies, withCookies, Cookies } from 'react-cookie';
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

import WorkflowDetail from './components/organisms/WorkFlowDetail'
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
      
      <MeetingsListFuture meetings={props.meetings} filterMeetings={props.filterMeetings} ></MeetingsListFuture>
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
function Home(props) {
  return (
    <div>
      {props.workflowControls}
    </div>
  );
}

const Meeting = ({match}) => {
  
  return (
      <WorkflowDetail  
        detailType={'meeting'}
        detailId={match.params.id}
      />
  );
}

const Project = ({match}) => {
  return (
    <div>
      <h1>Project: {match.params.id}</h1>
    </div>
  );
}
class App extends React.Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };
  constructor(props){
    super(props)
    const { cookies } = props;
    this.state = {
      appWorkflow: 'mainPage',
      isLoggedIn: false,
      meetingsGotten: false,
      meetings: [],
      searchMeetings: [],
      editMeeting: null,
      authToken: cookies.get('authToken') || '',
      
    }
    this._isMounted = false;

    const editMeetingWatch = watch(store.getState, 'editMeeting.meeting.value')
    store.subscribe(editMeetingWatch((newVal, oldVal, objectPath) => {
        this.setEditMeeting(newVal);
    }));
    const loadMeetingWatch = watch(store.getState, 'loadMeeting.meeting.value')
    store.subscribe(loadMeetingWatch((newVal, oldVal, objectPath) => {
        this.loadMeeting(newVal);
    }));
    const futureMeetingsWatch = watch(store.getState, 'futureMeetings.meetings')
    store.subscribe(futureMeetingsWatch((newVal, oldVal, objectPath) => {
      this.setMeetings(newVal);
    }));
    const loginWatch = watch(store.getState, 'loginAction')
    store.subscribe(loginWatch((newVal, oldVal, objectPath) => {
        this.loginStateHandler(newVal.loginAction, cookies);
    }));
    const appWorkflowWatch = watch(store.getState, 'appWorkflow.workflow')
      store.subscribe(appWorkflowWatch((newVal, oldVal, objectPath) => {
      this.setState((state, props) => ({appWorkflow: newVal}))
    }))
    window.onorientationchange = function() { 
      console.log("the orientation of the device is now " + window.screen.orientation.angle);
    };
  }
  componentDidMount() {
    if (!this._isMounted){
    }
    this._isMounted = true;

    if (!this.state.isLoggedIn){
       
    } else {

    }
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
  loadMeeting(loadMeeting) {
    if (this._isMounted) {
      this.setState({
          loadMeeting,
      })
    }
  }
  setMeetings(meetings) {
    if (this._isMounted) {
      this.setState({
          meetings,
          searchMeetings: meetings,
      })
    }
  }
  notLoggedIn() {
    return <Button>Login</Button>
  }
  loginStateHandler(loginState, cookies) {
    if(loginState.loggedIn === true){
      this.getMeetings(loginState.token);
      cookies.set('authToken', loginState.token);
      // this.setState({authToken: loginState.token}, () => {
      // });
    }
  }
  async getMeetings (token) {
    const url = config.API_URL + '/api/meetings-future';
    const params = {token};
    const response = await axios.get(url, {
      params
    })

    if (this._isMounted) {
        this.setState({
          meetings: response.data.body.rows.sort((a, b) => (new Date(a.value.dateTime) > new Date(b.value.dateTime)) ? 1 : -1),
          searchMeetings: response.data.body.rows.sort((a, b) => (new Date(a.value.dateTime) > new Date(b.value.dateTime)) ? 1 : -1),
        },() => {
          this.setState({isLoggedIn: true});
        });
    }    
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
    if(!this.state.authToken) {
      landing = <NotLoggedIn></NotLoggedIn>
    } else {
      landing = <LoggedIn classes={classes}
                  meetings={this.state.searchMeetings} 
                  filterMeetings={this.filterMeetings.bind(this)}
                  //authToken={this.state.authToken}
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
          //authToken={this.state.authToken}
        />
        break;
      case 'editMeeting':
        workflowControls = 
        <WorkflowEdit 
          editMeeting={this.state.editMeeting} 
          meetings={this.state.meetings}
          //authToken={this.state.authToken}
        />
        break; 
      case 'loadMeeting':
        workflowControls = 
        <div>Workflow goes here</div>
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
          <Router>
        

            {/*
              A <Switch> looks through all its children <Route>
              elements and renders the first one whose path
              matches the current URL. Use a <Switch> any time
              you have multiple routes, but you want only one
              of them to render at a time
            */}
            <Switch>
              <Route exact path="/">
                <Home workflowControls={workflowControls}/>
              </Route>
              <Route path="/meeting/:id" component={Meeting}>
              </Route>
              <Route path="/project/:id" component={Project}>
              </Route>
            </Switch>
          </Router>
    
      </div>
    );
  }
}

export default withCookies(withStyles(styles)(connect(null, { editMeeting })(App)));


