import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import watch from 'redux-watch';
import { withRouter } from "react-router-dom";

import store from '../../../store'
import { setWorkflow } from '../../../actions';

class MeetingAdd extends Component {
  constructor(props){
    super(props)
    this.state = {
      
    }
   const addMeetingWatch = watch(store.getState, 'click.clickCount')
    store.subscribe(addMeetingWatch((newVal, oldVal, objectPath) => {
        const clickCount = store.getState().click.clickCount;
        this.setState({
            clickCount
        })
    }))
  }

  nextPath(path) {
    this.props.history.push(path);
  }
  addMeeting() {
    this.props.setWorkflow('addMeeting');
    this.nextPath('/add');
    // this.setState((state, props) => ({clickCount: state.clickCount + 1}), () => {
    //   this.props.increment(this.state.clickCount);
    // } )
  }
  render() {
    return (
      <Button variant="contained" color="primary" onClick={this.addMeeting.bind(this)}>
        Add
      </Button>
    )
  }
}



export default withRouter(connect(null, { setWorkflow })(MeetingAdd));