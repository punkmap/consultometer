import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import watch from 'redux-watch';
import { withRouter } from "react-router-dom";

import store from '../../../store'
import { setWorkflow } from '../../../actions';

class MeetingsAnalyze extends Component {
  constructor(props){
    super(props)
    this.state = {
      
    }
   const analyzeMeetingsWatch = watch(store.getState, 'click.clickCount')
    store.subscribe(analyzeMeetingsWatch((newVal, oldVal, objectPath) => {
        const clickCount = store.getState().click.clickCount;
        this.setState({
            clickCount
        })
    }))
  }


  nextPath(path) {
    this.props.history.push(path);
  }
  analyzeMeetings() {
    this.props.setWorkflow('analyzeMeetings');
    this.nextPath('/analyze');
    // this.setState((state, props) => ({clickCount: state.clickCount + 1}), () => {
    //   this.props.increment(this.state.clickCount);
    // } )
  }
  render() {
    return (
      <Button variant="contained" color="primary" onClick={this.analyzeMeetings.bind(this)}>
        Analyze
      </Button>
    )
  }
}



export default withRouter(connect(null, { setWorkflow })(MeetingsAnalyze));