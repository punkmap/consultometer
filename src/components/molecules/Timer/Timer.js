import React, { Component } from 'react';
import watch from 'redux-watch';
import { withStyles } from '@material-ui/core/styles';
import store from '../../../store';
import blue from '@material-ui/core/colors/blue';
import green from '@material-ui/core/colors/green';
const styles = theme => ({
  timer: {
    color: blue[700],
  },
  cost: {
    color: green[700],
  }
});
class Timer extends Component {
  constructor(props){
    super(props)
    this.state = {
      time: 0,
      isOn: false,
      start: 0
    }
    this.startTimer = this.startTimer.bind(this)
    this.stopTimer = this.stopTimer.bind(this)
    this.resetTimer = this.resetTimer.bind(this)
    const activeMeetingWatch = watch(store.getState, 'activeMeeting.meeting')
    store.subscribe(activeMeetingWatch((newVal, oldVal, objectPath) => {
        // const clickCount = store.getState().click.clickCount;
        console.log('activeMeeting newVal: ', newVal);
    }))
    const timerWatch = watch(store.getState, 'timerAction')
    store.subscribe(timerWatch((newVal, oldVal, objectPath) => {
        switch (newVal.timerAction) {
          case 'start':
            this.startTimer();
            break;
          case 'pause':
            this.pauseTimer();
            break;
          case 'stop':
            this.stopTimer();
            break;
          case 'refresh':
            this.resetTimer();
            break;  
          default:
            break;
        }
    }))
  }
  componentDidMount() {
    // const startMeetingWatch = watch(store.getState, 'timerAction.startMeeting')
    // store.subscribe(startMeetingWatch((newVal, oldVal, objectPath) => {
    //   console.log('SUBSCRIBE start');
    //   this.test();
    // }))
  }
  test() {
    console.log('TEST');
  }
  startTimer() {
    if (!this.state.isOn) {
      this.setState({
        isOn: true,
        time: this.state.time,
        start: Date.now() - this.state.time
      })
      this.timer = setInterval(() => this.setState({
        time: Date.now() - this.state.start
      }), 1);
    }
  }
  stopTimer() {
    this.setState({isOn: false})
    clearInterval(this.timer);
    //TODO ask if they want to stop the meeting if they do they
  }
  pauseTimer() {
    //TODO create switch that makes it so pause has no affect 
    //if it is clicked without having first clicked start.
    //clicking pause should not ever start the clock unless 
    //the start button has been previously clicked
    if (this.state.isOn === true) {
      clearInterval(this.timer);
      this.setState({isOn: false})
    } else {
      this.startTimer();
    }
  }
  resetTimer() {
    console.log("resetTimer");
    //TODO ask if they want to reset timer
    clearInterval(this.timer);
    this.setState({time: 0, isOn: false})
  }
   msToHMS( ms ) {
      // 1- Convert to seconds:
      var seconds = ms / 1000;
      // 2- Extract hours:
      var hours = parseInt( seconds / 3600 ); // 3,600 seconds in 1 hour
      seconds = Math.round(seconds % 3600); // seconds remaining after extracting hours
      // 3- Extract minutes:
      var minutes = parseInt( seconds / 60 ); // 60 seconds in 1 minute
      // 4- Keep only seconds not extracted to minutes:
      seconds = seconds % 60;
      return hours+":"+minutes+":"+seconds;
  }
  render() {
    
    const { classes } = this.props;

    return(
      <div>
        <h3 className={classes.timer}>timer: {this.msToHMS(this.state.time)}</h3>
        <h3 className={classes.cost}>cost: {this.msToHMS(this.state.time)}</h3>
      </div>
    )
  }
}

export default withStyles(styles)(Timer);
