import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import clsx from 'clsx';
import moment from 'moment';

import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import EditIcon from '@material-ui/icons/Edit';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Paper from '@material-ui/core/Paper';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import RefreshIcon from '@material-ui/icons/Refresh';
import StopIcon from '@material-ui/icons/Stop';
import TodayIcon from '@material-ui/icons/Today';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import CheckIcon from '@material-ui/icons/Check';
import ToggleButton from '@material-ui/lab/ToggleButton';
import blue from '@material-ui/core/colors/blue';
import green from '@material-ui/core/colors/green';

import TextEditor from '../../atoms/TextEditor'
import IconBtn from '../../atoms/IconBtn'
import { timerStops } from '../../../actions';

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 345,
    padding: theme.spacing(2),
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
  switchControl: {
    marginLeft: 'auto',
  },
  timer: {
    color: blue[700],
  },
  cost: {
    color: green[700],
  }
}));
export default function MeetingCard(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState(false);
  const [meeting, setMeeting] = useState(props.meetings[props.keyIndex]);
  const [rate, setRate] = useState(meeting.value.attendees.reduce(function(prev, cur) {
      return Number(prev) + Number(cur.value.rate);
  }, 0));
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerWasStarted, setTimerWasStarted] = useState(false);
  const [timerPaused, setTimerPaused] = useState(false);
  const [time, setTime] = useState(meeting.value.durationMS ? meeting.value.durationMS : 0);
  const [timer, setTimer] = useState();
  const [avTime, setAVTime] = useState(meeting.value.avDurationMS ? meeting.value.avDurationMS : 0);
  const [avTimer, setAVTimer] = useState();
  const avTimerRef = useRef(avTimer);
  avTimerRef.current = avTimer;
  const [avTimerRunning, setAVTimerRunning] = useState(false);
  const avTimerRunningRef = useRef(avTimerRunning);
  avTimerRunningRef.current = avTimerRunning;
  const [start, setStart] = useState(Date.now() - meeting.value.durationMS);
  const [switchState, setSwitchState] = useState(false);
  const switchStateRef = useRef(switchState);
  switchStateRef.current = switchState;

  const startAVTimer = () => {
    //start the timer for audio visual

    setAVTimerRunning(true);
    const timeNow=Date.now()-avTime;
    setAVTimer(setInterval(()=>{setAVTime(Date.now()-timeNow)},1000));
  };
  const stopAVTimer = () => {
    //stop the timer for audio visual

    clearInterval(avTimerRef.current);
    setAVTimerRunning(false);
  }
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const saveText = (textInfo) => {
    console.log('SAVETEXT TEXTINFO: ', textInfo);
    console.log('meeting.value.purpose: ', meeting.value.purpose);
    console.log('meeting.value._id: ', meeting.value._id);
    
  }
  const startMeeting = (meeting) => {
    //start the meeting timer
    
    const timeNow=Date.now()-time;
    if(timerRunning){
        clearInterval(timer);
        setTimerRunning(false);
        setTimerWasStarted(false);
    }else{
        setTimer(setInterval(()=>{
          setTime(Date.now()-timeNow);
          //else if to synchronize timers
          if (switchStateRef.current === true && avTimerRunningRef.current === false){
            startAVTimer();
          }
          else if (switchStateRef.current === false && avTimerRunningRef.current === true){
            stopAVTimer();
          }  
        },1000));
        setTimerRunning(true);
        setTimerPaused(false);
        setTimerWasStarted(true);
    }
  };
  const pauseMeeting = (meeting) => {
    if (timerRunning) {
        clearInterval(timer);
        setTimerRunning(false);
        setTimerPaused(true);
        console.log('setTimerPaused');
        clearInterval(avTimer);
        setAVTimerRunning(false);
    } 
    else if (!timerRunning && timerWasStarted) {
        setTimerPaused(false);
        startMeeting(meeting);
    }
  }
  
  const stopMeeting = (meeting) => {
    clearInterval(timer);
    setTimerRunning(false);
    clearInterval(avTimer);
    setAVTimerRunning(false);
    setTimerWasStarted(false);
    dispatch(timerStops({
      meeting,
      timer: {
        durationMS: time,
        durationHMS: msToHMS(time),
        cost: Number(msToCost(time)),
        avDurationMS: avTime,
        avDurationHMS: msToHMS(avTime),
        avCost: Number(msToCost(avTime)),
      }
    }));
  }
  const msToHMS = ( ms ) => {
    //Convert to seconds:
    var seconds = ms / 1000;
    //Extract hours:
    var hours = parseInt( seconds / 3600 ); // 3,600 seconds in 1 hour
    seconds = Math.round(seconds % 3600); // seconds remaining after extracting hours
    //Extract minutes:
    var minutes = parseInt( seconds / 60 ); // 60 seconds in 1 minute
    //Keep only seconds not extracted to minutes:
    seconds = seconds % 60;
    //make double digits for single digit numbers. 
    seconds = seconds.toString().length === 1 ? '0' + seconds : seconds
    minutes = minutes.toString().length === 1 ? '0' + minutes : minutes
    hours = hours.toString().length === 1 ? '0' + hours : hours
    return hours+":"+ minutes+":"+seconds;
}
  const msToCost = ( ms ) => {
    return (rate * ms/3600000).toFixed(2);
  }
  const toggleSwitchState = () => {
    //change the state of the A/V? switch
    setSwitchState(prev => !prev);
  };
  return (
    <Card className={classes.root} key={'card'+props.keyIndex}>
      <Paper>
        <CardHeader
            key={'cardHeader'+props.keyIndex}
            avatar={
            <Avatar>
                <TodayIcon />
            </Avatar>
            }
            action={
            <IconButton aria-label="settings">
                <MoreVertIcon />
            </IconButton>
            }
            title={props.cardValue.project}
            subheader={moment(props.cardValue.dateTime).format("MM-DD-YY HH:mm")}
        />
        <CardContent key={'cardContent'+props.keyIndex}>
            <ListItem key={'li'+props.keyIndex}>
                <Grid item >
                    <Typography variant="body2">{props.cardValue.title}</Typography>
                    <Typography variant="body2" color="textSecondary">{props.cardValue.purpose}</Typography>
                    <Grid container direction="row" justify="space-between">
                      <Grid item >
                          <Typography variant="body2">Total</Typography>
                          <Typography variant="body2" className={classes.timer}> {msToHMS(time)}</Typography>
                          <Typography variant="body2" className={classes.cost}>${msToCost(time)}</Typography>
                      </Grid>
                      <Grid item >
                          <Typography variant="body2">A/V</Typography>
                          <Typography variant="body2" className={classes.timer}> {msToHMS(avTime)}</Typography>
                          <Typography variant="body2" className={classes.cost}>${msToCost(avTime)}</Typography>
                      </Grid>
                    </Grid>
                </Grid>
                <ListItemSecondaryAction>
                    <IconButton 
                        edge="end" 
                        aria-label="delete" 
                        onClick={() => props.editMeeting(meeting)}
                    >
                        <EditIcon fontSize="small"/>
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
        </CardContent>
        <CardActions disableSpacing key={'cardActions'+props.keyIndex}>
            <IconBtn 
              icon={<PlayArrowIcon fontSize="small"/>} 
              click={(event) => startMeeting(meeting)}
              active={timerRunning}
            />
            {/* <IconButton onClick={(event) => startMeeting(meeting)}>
                <PlayArrowIcon fontSize="small"/>
            </IconButton> */}
            <IconBtn 
              icon={<PauseIcon fontSize="small"/>} 
              click={(event) => pauseMeeting(meeting)}
              active={timerPaused}
            />
            {/* <IconButton onClick={(event) => pauseMeeting(meeting)}>
                <PauseIcon fontSize="small"/>
            </IconButton> */}
            <IconBtn 
              icon={<StopIcon fontSize="small"/>} 
              click={(event) => stopMeeting(meeting)}
            />
            {/* <IconButton onClick={(event) => stopMeeting(meeting)}>
                <StopIcon fontSize="small"/>
            </IconButton> */}
            <IconBtn 
              icon={<RefreshIcon fontSize="small"/>} 
              click={(event) => props.refreshMeeting(event, meeting)}
            />
            {/* <IconButton onClick={(event) => props.refreshMeeting(event, meeting)}>
                <RefreshIcon fontSize="small"/>
            </IconButton> */}
            <FormControlLabel 
                className={classes.switchControl}
                control={
                <Switch size="small" 
                        checked={switchState} 
                        onChange={toggleSwitchState} 
                />} 
                label="A/V" 
            />
            <IconButton
            className={clsx(classes.expand, {
                [classes.expandOpen]: expanded,
            })}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
            >
            <ExpandMoreIcon />
            </IconButton>
        </CardActions>
        <Collapse key={'collapse'+props.keyIndex} in={expanded} timeout="auto" unmountOnExit>
            <CardContent>
            <TextEditor 
              saveText={saveText}
              meeting={meeting}
            ></TextEditor>
            </CardContent>
        </Collapse>
      </Paper>
    </Card>
  );
}