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

import AppBar from './components/molecules/AppBar'
import MeetingsList from './components/molecules/MeetingsList'
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


import { editMeeting, allMeetings } from './actions';

// This site has 3 pages, all of which are rendered
// dynamically in the browser (not server rendered).
//
// Although the page does not ever refresh, notice how
// React Router keeps the URL up to date as you navigate
// through the site. This preserves the browser history,
// making sure things like the back button and bookmarks
// work properly.
function LoggedIn (props) {
  return <Fragment>
    <Grid item xs={12}>
      <Timer/>  
    </Grid>
    <Grid item xs={12}>
      <Typography variant="h4" gutterBottom>
      </Typography>
      
      <MeetingsList meetings={props.meetings} filterMeetings={props.filterMeetings} authToken={props.authToken}></MeetingsList>
    </Grid>
    <Grid item xs={12}>
      <MeetingsAnalyze></MeetingsAnalyze>
      <MeetingAdd></MeetingAdd>
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
    const meetingsWatch = watch(store.getState, 'meetings.meetings')
    store.subscribe(meetingsWatch((newVal, oldVal, objectPath) => {
        this.setMeetings(newVal);
    }));
    const loginWatch = watch(store.getState, 'loginAction')
    store.subscribe(loginWatch((newVal, oldVal, objectPath) => {
        this.loginStateHandler(newVal.loginAction);
    }));
    const appWorkflowWatch = watch(store.getState, 'appWorkflow.workflow')
      store.subscribe(appWorkflowWatch((newVal, oldVal, objectPath) => {
      console.log('appWorkflow newVal: ', newVal);
      this.setState((state, props) => ({appWorkflow: newVal}))
    }))
  }
  componentDidMount() {
    this._isMounted = true;
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
      this.setState({
          meetings,
          searchMeetings: meetings,
      })
    }
  }
  loggedIn(props) {
    return <div>
      <Grid item xs={12}>
        <Timer/>  
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>
          {props.test}
        </Typography>
        {/* <MeetingsList meetings={props.meetings} filterMeetings={props.filterMeetings}></MeetingsList> */}
      </Grid>
      <Grid item xs={12}>
        <MeetingsAnalyze></MeetingsAnalyze>
        <MeetingAdd></MeetingAdd>
      </Grid>
  </div>
  }
  notLoggedIn() {
    return <Button>Login</Button>
  }
  loginStateHandler(loginState) {
    if(loginState.loggedIn === true){
      this.getMeetings(loginState.token);
      this.setState({authToken: loginState.token}, () => {
        console.log('this.state.authToken: ', this.state.authToken);
      });
    }
  }
  async getMeetings (token) {
    const url = 'http://localhost:5000/api/meetings'
    const params = {token};
    const response = await axios.get(url, {
      params
    })
    console.log('RESPONSE: ', response);
    if (this._isMounted) this.setState({
      meetings: response.data.body.rows,
      searchMeetings: response.data.body.rows,
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

    const appWorkflow = this.state.appWorkflow;
    
    let landing;
    if(!this.state.isLoggedIn) {
      landing = <NotLoggedIn></NotLoggedIn>
    } else {
      landing = <LoggedIn 
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
  
          {/*
            A <Switch> looks through all its children <Route>
            elements and renders the first one whose path
            matches the current URL. Use a <Switch> any time
            you have multiple routes, but you want only one
            of them to render at a time
          */}
          <header className="App-header">
          {workflowControls}
        </header>
        </div>
    );
    // return (
    //   <Router>
    //     <div>
    //       <AppBar></AppBar>
  
    //       {/*
    //         A <Switch> looks through all its children <Route>
    //         elements and renders the first one whose path
    //         matches the current URL. Use a <Switch> any time
    //         you have multiple routes, but you want only one
    //         of them to render at a time
    //       */}
    //       <Switch>
    //         <Route exact path="/">
    //         <Grid container
    //           direction="column"
    //           justify="center"
    //           alignItems="center"
    //           style={{ minHeight: '100vh' }}
    //         >
    //           {landing}  
    //         </Grid>
    //           {/* <Home meetings={this.state.meetings}/> */}
    //         </Route>
    //         <Route path="/add">
    //           <WorkflowAdd  
    //             meetings={this.state.meetings}
    //             authToken={this.state.authToken}
    //           />
    //           {/* <Add meetings={this.state.meetings}/> */}
    //         </Route>
    //         <Route path="/load">
    //           <WorkflowEdit 
    //             editMeeting={this.state.editMeeting} 
    //             meetings={this.state.meetings}
    //             //readOnly={true}
    //           />
    //         </Route>
    //         <Route path="/edit">
    //           <WorkflowEdit 
    //             editMeeting={this.state.editMeeting} 
    //             meetings={this.state.meetings}
    //             authToken={this.state.authToken}
    //             test={'test'}
    //           />
    //           {/* <Edit editMeeting={this.state.editMeeting} meetings={this.state.meetings}/> */}
    //         </Route>
    //         <Route path="/analyze">
    //         <WorkflowsAnalyze></WorkflowsAnalyze>
    //           {/* <Analyze /> */}
    //         </Route>
    //       </Switch>
    //     </div>
    //   </Router>
    // );
  }
}

export default connect(null, { editMeeting, allMeetings })(App);
// export default function App() {
//   useEffect(() => {
//     // Update the document title using the browser API
//     //document.title = `You clicked ${count} times`;
//     const url = 'http://64.225.122.227:5984/consultometer/_design/meetings/_view/meeting-view'
//     axios.get(url)
//     .then((response) => {
//       console.log('response: ', response);

//     })
//   });
//   return (
//     <Router>
//       <div>
//         <ul>
//           {/* <li>
//             <Link to="/">Home</Link>
//           </li>
//           <li>
//             <Link to="/add">Add</Link>
//           </li>
//           <li>
//             <Link to="/analyze">Analyze</Link>
//           </li> */}
//         </ul>

//         <hr />

//         {/*
//           A <Switch> looks through all its children <Route>
//           elements and renders the first one whose path
//           matches the current URL. Use a <Switch> any time
//           you have multiple routes, but you want only one
//           of them to render at a time
//         */}
//         <Switch>
//           <Route exact path="/">
//             <Home />
//           </Route>
//           <Route path="/add">
//             <Add />
//           </Route>
//           <Route path="/edit">
//             <Add />
//           </Route>
//           <Route path="/analyze">
//             <Analyze />
//           </Route>
//         </Switch>
//       </div>
//     </Router>
//   );
// }

// You can think of these components as "pages"
// in your app.

function Home(props) {
  return (
      <Grid container
          direction="column"
          justify="center"
          alignItems="center"
          style={{ minHeight: '100vh' }}>
        <Grid item xs={12}>
          {/* <Typography variant="h4" gutterBottom>
            Meetings
          </Typography> */}
          <MeetingsList meetings={props.meetings}></MeetingsList>
        </Grid>
        <Grid item xs={12}>
          <MeetingsAnalyze></MeetingsAnalyze>
          <MeetingAdd></MeetingAdd>
        </Grid>
      </Grid>
  );
}

function Add(props) {
  return (
    <div>
      <WorkflowAdd  meetings={props.meetings}></WorkflowAdd>
    </div>
  );
}
function Edit(props) {
  return (
    <div>
      <WorkflowEdit editMeeting={props.editMeeting} meetings={props.meetings} authToken={props.authToken}></WorkflowEdit>
    </div>
  );
}
function Analyze() {
  return (
    <div>
      <WorkflowsAnalyze></WorkflowsAnalyze>
    </div>
  );
}

