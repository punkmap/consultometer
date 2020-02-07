import React from "react";
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
import WorkflowsAnalyze from "./components/organisms/WorkflowsAnalyze";

// This site has 3 pages, all of which are rendered
// dynamically in the browser (not server rendered).
//
// Although the page does not ever refresh, notice how
// React Router keeps the URL up to date as you navigate
// through the site. This preserves the browser history,
// making sure things like the back button and bookmarks
// work properly.

export default function App() {
  return (
    <Router>
      <div>
        <ul>
          {/* <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/add">Add</Link>
          </li>
          <li>
            <Link to="/analyze">Analyze</Link>
          </li> */}
        </ul>

        <hr />

        {/*
          A <Switch> looks through all its children <Route>
          elements and renders the first one whose path
          matches the current URL. Use a <Switch> any time
          you have multiple routes, but you want only one
          of them to render at a time
        */}
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/add">
            <Add />
          </Route>
          <Route path="/analyze">
            <Analyze />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

// You can think of these components as "pages"
// in your app.

function Home() {
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
          <MeetingsList></MeetingsList>
        </Grid>
        <Grid item xs={12}>
          <MeetingsAnalyze></MeetingsAnalyze>
          <MeetingAdd></MeetingAdd>
        </Grid>
      </Grid>
  );
}

function Add() {
  return (
    <div>
      <WorkflowAdd></WorkflowAdd>
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
