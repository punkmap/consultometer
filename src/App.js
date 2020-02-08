import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import store from './store'
import watch from 'redux-watch';

import { increment, setWorkflow } from './actions';

import Label from './components/atoms/Label';
import MeetingAdd from './components/molecules/MeetingAdd';
import MeetingsAnalyze from './components/molecules/MeetingsAnalyze';
import WorkflowAdd from './components/organisms/WorkflowAdd'
// function incrementCount() {
//   console.log("increment");
//   this.props.increment(this.count)
// }
class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      clickCount: 0,
      appWorkflow: 'main'
    }
    const addMeetingWatch = watch(store.getState, 'addMeeting.workflow')
    store.subscribe(addMeetingWatch((newVal, oldVal, objectPath) => {
        console.log('addMeeting newVal: ', newVal);
        this.setState((state, props) => ({appWorkflow: newVal}))
    }))
  }

  componentDidMount() {
    // call default function to display redux operation
    
    // this.props.setConfig(config);// .setConfig(config);
  }
  incrementCount() {
    this.setState((state, props) => ({clickCount: state.clickCount + 1}), () => {
      this.props.increment(this.state.clickCount);
    } )
  }

  render() {
    const appWorkflow = this.state.appWorkflow;
    let workflowControls;
    switch (appWorkflow) {
      case 'main':
        workflowControls = 
        <div>
          <MeetingsAnalyze></MeetingsAnalyze>
          <MeetingAdd></MeetingAdd>
        </div>
        break;
      case 'addMeeting':
        workflowControls = 
        <div>
          <WorkflowAdd></WorkflowAdd>
        </div>
        break;
      case 'analyzeMeetings':
        workflowControls = <p>analyze</p>
        break;
      default:
        break;
    }
    return (
      <div className="App">
        <header className="App-header">
          {workflowControls}
        </header>
      </div>
    );
  }
}
// function to convert the global state obtained from redux to local props
function mapStateToProps(state) {
  return {
    default: state.default
  };
}

App.propTypes = {
  increment: PropTypes.func.isRequired
};

export default connect(mapStateToProps, { increment, setWorkflow })(App);
