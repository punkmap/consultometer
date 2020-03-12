import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { instanceOf } from 'prop-types';
import { useCookies, withCookies, Cookies } from 'react-cookie';
//import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IconBtn from '../../atoms/IconBtn'
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import RefreshIcon from '@material-ui/icons/Refresh';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import SendIcon from '@material-ui/icons/Send';
import StopIcon from '@material-ui/icons/Stop';
import Grid from '@material-ui/core/Grid';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import { updateMeeting, msTime } from '../../../util'

import { connect } from 'react-redux';
import { withRouter, useHistory } from "react-router-dom";
import axios from 'axios';

import blue from '@material-ui/core/colors/blue';
import green from '@material-ui/core/colors/green';


import { setWorkflow, futureMeetings, timerStops } from '../../../actions';
import { config } from '../../../config'
//const history = useHistory();
const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  buttonBar: {
    margin: "1rem"
  },
  actionGrid: {
    padding: theme.spacing(2),
    textAlign: 'center',
  },
  timer: {
    color: blue[700],
  },
  cost: {
    color: green[700],
  },
});
class MeetingDetail extends Component {
  constructor(props){
    super(props);
    const { cookies } = props;
    this.state = {
      meeting: props.detailObject,
      detailType: props.detailType,
      detailId: props.detailId,
      detailObject: props.detailObject,
      authToken: cookies.get('authToken'),
      detailItem: null,
      time: props.detailObject.durationMS ? props.detailObject.durationMS : 0,
      timer: null,
      timerRunning: false,
      timerWasStarted: false,
      avTime: props.detailObject.durationAVMS ? props.detailObject.durationAVMS : 0,
      avTimer: null,
      avTimerRunning: false,
      switchState: false,
    }
    this._isMounted = false;
  }
  cancel() {
    this.props.setWorkflow('mainPage');
    this.props.history.push('/');
  }
  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };
  
  componentDidMount() {
    this._isMounted = true;
    if (this.state.detailType === 'meeting'){
      if (this.state.detailId) {
        this.getMeeting(this.state.detailId, this.state.authToken)
      } 
      else if (this.state.detailObject) {
        const detailItem = this.state.detailObject;
        this.setState({detailItem});
      }
    }
  }
  async getMeeting (meetingId, token) {
    const url = config.API_URL+'/api/meeting/' + meetingId;
    const params = {token};
    const response = await axios.get(url, {
      params
    })
    if (this._isMounted) {
      const detailItem = response.data.meeting;
      this.setState({detailItem});
    }
  }
  startAVTimer = () => {
    //start the timer for audio visual
    const avTimerRunning = true;
    const timeNow=Date.now() - this.state.avTime;
    const avTimer = setInterval(()=>{
      const avTime=Date.now()-timeNow;
      this.setState({avTime});
    },1000);
    this.setState({
      avTimerRunning,
      avTimer,
    })
    //setAVTimer(setInterval(()=>{setAVTime(Date.now()-timeNow)},1000));
    // setAVTimerRunning(true);
    // const timeNow=Date.now()-avTime;
    // setAVTimer(setInterval(()=>{setAVTime(Date.now()-timeNow)},1000));
  };
  stopAVTimer = () => {
    //stop the timer for audio visual
    const avTimerRunning = false;
    this.setState({avTimerRunning},()=>{
      clearInterval(this.state.avTimer);
    })
  }
  startMeeting = (meeting) => {
    //start the meeting timer
    const timeNow = Date.now() - this.state.time;
    if(this.state.timerRunning){
        clearInterval(this.state.timer);
        const timerRunning = false;
        const timerWasStarted = false;
        this.setState({
          timerRunning,
          timerWasStarted,
        })
    }else{
      const timerRunning = true;
      const timerPaused = false;
      const timerWasStarted = true;  
      const timer = setInterval(()=>{
          
          const time = Date.now()-timeNow;
          this.setState({time})
          //setTime(Date.now()-timeNow);
          //else if to synchronize timers
          if (this.state.switchState === true && this.state.avTimerRunning === false){
            this.startAVTimer();
          }
          else if (this.state.switchState === false && this.state.avTimerRunning === true){
            this.stopAVTimer();
          }  
        },1000)
      this.setState({timer, timerRunning, timerPaused, timerWasStarted})
        // setTimer(setInterval(()=>{
        //   setTime(Date.now()-timeNow);
        //   //else if to synchronize timers
        //   if (switchStateRef.current === true && avTimerRunningRef.current === false){
        //     startAVTimer();
        //   }
        //   else if (switchStateRef.current === false && avTimerRunningRef.current === true){
        //     stopAVTimer();
        //   }  
        // },1000)); 
        // setTimerRunning(true);
        // setTimerPaused(false);
        // setTimerWasStarted(true);
    }
  };
  pauseMeeting = (meeting) => {
    if (this.state.timerRunning) {
        const timerRunning = false, timerPaused = true, avTimerRunning = false;
        clearInterval(this.state.timer);
        clearInterval(this.state.avTimer);
        this.setState({timerRunning, timerPaused, avTimerRunning})
        // clearInterval(timer);
        // setTimerRunning(false);
        // setTimerPaused(true);
        // clearInterval(avTimer);
        // setAVTimerRunning(false);
    } 
    else if (!this.state.timerRunning && this.state.timerWasStarted) {
        const timerPaused = false;
        this.setState({timerPaused});
        //setTimerPaused(false);
        this.startMeeting(meeting);
    }
  }
  
  stopMeeting = (meeting) => {
    const timerRunning = false, avTimerRunning = false, timerWasStarted = false;
    this.setState({timerRunning, avTimerRunning, timerWasStarted})
    clearInterval(this.state.timer);
    clearInterval(this.state.avTimer);
    // this.props.timerStops({
    //   durationMS: this.state.time,
    //   durationHMS: this.msToHMS(this.state.time),
    //   cost: Number(this.msToCost(this.state.time)),
    // })
    this.props.timerStops({
      meeting,
      timer: {
        durationMS: this.state.time,
        durationHMS: msTime.msToHMS(this.state.time),
        cost: Number(msTime.msToCost(meeting.value.rate, this.state.time)),
        durationAVMS: this.state.avTime,
        durationAVHMS: msTime.msToHMS(this.state.avTime),
        costAV: Number(msTime.msToCost(meeting.value.rate, this.state.avTime)),
      }
    });
    // clearInterval(timer);
    // setTimerRunning(false);
    // clearInterval(avTimer);
    // setAVTimerRunning(false);
    // setTimerWasStarted(false);
    // dispatch(timerStops({
    //   meeting,
    //   timer: {
    //     durationMS: time,
    //     durationHMS: msTime.msToHMS(time),
    //     cost: Number(msTime.msToCost(meeting.value.rate, time)),
    //     durationAVMS: avTime,
    //     durationAVHMS: msTime.msToHMS(avTime),
    //     costAV: Number(msTime.msToCost(meeting.value.rate, avTime)),
    //   }
    // }));
  }
  toggleSwitchState () {
    //change the state of the A/V? switch
    //setSwitchState(prev => !prev);
    this.setState({switchState: !this.state.switchState});
  };
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>  
        
        {/*TODO: create and implement Meeting Detail component and load it from App   */}
        <Grid 
          container
          direction="column"
          justify="center"
          alignItems="center"
          style={{ minHeight: '100vh' }}>
          <Grid item xs={6} md={6} lg={6}>
          <Typography variant="h4" gutterBottom>{this.state.detailItem && this.state.detailItem.title}</Typography>
          <Typography variant="h5" gutterBottom>{this.state.detailItem && this.state.detailItem.purpose}</Typography>
          {this.state.detailItem && this.state.detailItem.attendees && this.state.detailItem.attendees.map(data => {
            let icon;

            return (
              <Chip
                key={data.key}
                icon={icon}
                label={data.value.name}
                className={classes.chip}
              />
            );
          })}
          <Grid item >
              <Typography variant="body2">{this.state.detailItem && this.state.detailItem.title}</Typography>
              <Typography variant="body2" color="textSecondary">{this.state.detailItem && this.state.detailItem.purpose}</Typography>
              <Grid container direction="row" justify="space-between">
                <Grid item >
                    <Typography variant="body2">Total</Typography>
                    <Typography variant="body2" className={classes.timer}> {msTime.msToHMS(this.state.time)}</Typography>
                    <Typography variant="body2" className={classes.cost}>${msTime.msToCost(this.state.meeting.rate, this.state.time)}</Typography>
                </Grid>
                <Grid item >
                    <Typography variant="body2">A/V</Typography>
                    <Typography variant="body2" className={classes.timer}> {msTime.msToHMS(this.state.avTime)}</Typography>
                    <Typography variant="body2" className={classes.cost}>${msTime.msToCost(this.state.meeting.rate, this.state.avTime)}</Typography>
                </Grid>
                <Grid item>
                  <Box display={ this.state.meeting.infoOnly ? "none" : "block" }>
                    <IconBtn 
                      icon={<PlayArrowIcon fontSize="small"/>} 
                      click={(event) => this.startMeeting(this.state.meeting)}
                      active={this.state.timerRunning}
                    />
                    <IconBtn 
                      icon={<PauseIcon fontSize="small"/>} 
                      click={(event) => this.pauseMeeting(this.state.meeting)}
                      active={this.state.timerPaused}
                    />
                    <IconBtn 
                      icon={<StopIcon fontSize="small"/>} 
                      click={(event) => this.stopMeeting(this.state.meeting)}
                    />
                    <IconBtn 
                      icon={<RefreshIcon fontSize="small"/>} 
                      click={(event) => this.props.refreshMeeting(event, this.state.meeting)}
                    />
                    <FormControlLabel 
                      //className={classes.switchControl}
                      control={
                      <Switch size="small" 
                              checked={this.state.switchState} 
                              onChange={this.toggleSwitchState.bind(this)} 
                      />} 
                      label="A/V" 
                    />
                  </Box>
                </Grid>
              </Grid>
          </Grid>
            <Grid container className={classes.buttonBar}>
              <Grid item className={classes.actionGrid}>
                <Button variant="contained" color="primary" onClick={this.cancel.bind(this)}>
                  close
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    )
  }
}
MeetingDetail.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRouter(withCookies(withStyles(styles)(connect(null, { setWorkflow, futureMeetings, timerStops})(MeetingDetail))));
