import React, { Component } from 'react';
import watch from 'redux-watch';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import green from '@material-ui/core/colors/green';

import store from '../../../store';
import { timerStops } from '../../../actions';
import { isCompositeComponentWithType } from 'react-dom/test-utils';

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
      showTimer: false,
      time: 0,
      timerStarted: false,
      isOn: false,
      start: 0,
      hourlyRate: 0
    }
    this._isMounted = false;
    this.startTimer = this.startTimer.bind(this)
    this.stopTimer = this.stopTimer.bind(this)
    this.resetTimer = this.resetTimer.bind(this)
    const activeMeetingWatch = watch(store.getState, 'activeMeeting.meeting')
    store.subscribe(activeMeetingWatch((newVal, oldVal, objectPath) => {
        //if object is not empty then show the timer else hide the timer;
        this.toggleTimer(newVal)
    }))
    const timerWatch = watch(store.getState, 'timerAction')
    store.subscribe(timerWatch((newVal, oldVal, objectPath) => {
        console.log('TIMERACTION ACTION: ', newVal.timerAction);
        this.parseTimerAction(newVal.timerAction);
    }))
  }

  componentDidMount() {
    this._isMounted = true; 
  }
  componentWillUnmount() {
    this._isMounted = false; 
  }
  toggleTimer(newVal) {
    if (this._isMounted) {
      Object.keys(newVal).length ? this.showTimer(newVal) : this.hideTimer();
    }
  }
  showTimer(meeting){
    const hourlyRate = meeting.value.attendees.reduce(function(prev, cur) {
      return Number(prev) + Number(cur.value.rate);
    }, 0);
    this.setState({
      showTimer: true, 
      time: meeting.value.durationMS ? meeting.value.durationMS : 0,
      hourlyRate: hourlyRate, 
    })
  }
  hideTimer(){
    this.setState({showTimer: false})
  }
  parseTimerAction(timerAction){
    
    if (this._isMounted) {
      switch (timerAction) {
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
    }
  }
  startTimer() {
    if (!this.state.isOn) {
      this.setState({
        timerStarted: true,
        isOn: true,
        time: this.state.time,
        start: Date.now() - this.state.time
      }, () => {
        console.log('TIMER STATE ISON: ', this.state.isOn);
      })
      this.timer = setInterval(() => this.setState({
        time: Date.now() - this.state.start
      }), 1);
    }
  }
  stopTimer() {
    this.setState({
      timerStarted: false,
      isOn: false,
    })
    clearInterval(this.timer);
    this.props.timerStops({
      durationMS: this.state.time,
      durationHMS: this.msToHMS(this.state.time),
      cost: Number(this.msToCost(this.state.time)),
    })
  }
  pauseTimer() {
    //TODO create switch that makes it so pause has no affect 
    //if it is clicked without having first clicked start.
    //clicking pause should not ever start the clock unless 
    //the start button has been previously clicked
    if (this.state.isOn) {
      clearInterval(this.timer);
      this.setState({isOn: false})
    } else if (this.state.timerStarted){
      this.startTimer();
    }
  }
  resetTimer() {
    //TODO ask if they want to reset timer
    clearInterval(this.timer);
    this.setState({
      timerStarted: false,
      time: 0, 
      isOn: false
    })
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
  msToCost( ms ) {
    return (this.state.hourlyRate * ms/3600000).toFixed(2);
  }
  render() {
    const { classes } = this.props;
    return(
      this.state.showTimer ? 
      <div>
        <h3 className={classes.timer}>{this.msToHMS(this.state.time)}</h3>
        <h3 className={classes.cost}>${this.msToCost(this.state.time)}</h3>
      </div> : 
      null 
      
    )
  }
}

export default withStyles(styles)(connect(null, { timerStops })(Timer));
