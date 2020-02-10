import React, { useEffect }from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import MeetingsList from './components/molecules/MeetingsList'
import MeetingAdd from './components/molecules/MeetingAdd';
import MeetingsAnalyze from './components/molecules/MeetingsAnalyze';
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

class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      meetings: [],
      editMeeting: null
    }

    const editMeetingWatch = watch(store.getState, 'editMeeting.meeting.value')
    store.subscribe(editMeetingWatch((newVal, oldVal, objectPath) => {
        // const clickCount = store.getState().click.clickCount;
        const editMeeting = newVal;
        this.setState({
            editMeeting,
        })
        console.log('editMeetingWatch newVal: ', newVal);
    }))
    const meetingsWatch = watch(store.getState, 'meetings.meetings')
    store.subscribe(meetingsWatch((newVal, oldVal, objectPath) => {
        this.setState({meetings: newVal}, () => {
          console.log('willMount this.state.meetings: ', this.state.meetings);
        });
    }))
  }
  componentWillMount() {
    console.log('willMount');

    const url = 'http://64.225.122.227:5984/consultometer/_design/meetings/_view/meeting-view'
    axios.get(url)
    .then((response) => {
      //TODO add the meetings to redux and then set the state to the action. 
      this.props.allMeetings(response.data.rows);
      

    })
  }
  componentDidMount() {
    console.log('didMount');

    // const url = 'http://64.225.122.227:5984/consultometer/_design/meetings/_view/meeting-view'
    // axios.get(url)
    // .then((response) => {
    //   this.setState({meetings: response.data.rows}, () => {
    //     console.log('this.state.meetings: ', this.state.meetings);
    //   });

    // })
  }
  componentDidUpdate() {
    console.log('didUpdate');
    
    // const url = 'http://64.225.122.227:5984/consultometer/_design/meetings/_view/meeting-view'
    // axios.get(url)
    // .then((response) => {
    //   this.setState({meetings: response.data.rows}, () => {
    //     console.log('this.state.meetings: ', this.state.meetings);
    //   });

    // })
  }
  render() {
    return (
      <Router>
        <div>
          
  
          {/*
            A <Switch> looks through all its children <Route>
            elements and renders the first one whose path
            matches the current URL. Use a <Switch> any time
            you have multiple routes, but you want only one
            of them to render at a time
          */}
          <Switch>
            <Route exact path="/">
              <Home meetings={this.state.meetings}/>
            </Route>
            <Route path="/add">
              <Add meetings={this.state.meetings}/>
            </Route>
            <Route path="/edit">
              <Edit editMeeting={this.state.editMeeting} meetings={this.state.meetings}/>
            </Route>
            <Route path="/analyze">
              <Analyze />
            </Route>
          </Switch>
        </div>
      </Router>
    );
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
  console.log('props.meetings: ', props.meeting);
  console.log('props: ', props);
  return (
    <div>
      <WorkflowEdit editMeeting={props.editMeeting} meetings={props.meetings}></WorkflowEdit>
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

