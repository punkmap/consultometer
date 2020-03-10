import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import clsx from 'clsx';
import moment from 'moment';
import copy from "clipboard-copy";

import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import EditIcon from '@material-ui/icons/Edit';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import RefreshIcon from '@material-ui/icons/Refresh';
import SendIcon from '@material-ui/icons/Send';
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
import { msTime } from '../../../util'
import { config } from '../../../config'

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
  },
}));
export default function MeetingCard(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState(false);
  const [meeting, setMeeting] = useState(props.meetings[props.keyIndex]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [copyMeetingLinkTest, setCopyMeetingLinkTest] = React.useState('Copy Meeting Link');
  const open = Boolean(anchorEl);
  const [rate, setRate] = useState(meeting.value.attendees.reduce(function(prev, cur) {
      return Number(prev) + Number(cur.value.rate);
  }, 0));
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerWasStarted, setTimerWasStarted] = useState(false);
  const [timerPaused, setTimerPaused] = useState(false);
  const [time, setTime] = useState(meeting.value.durationMS ? meeting.value.durationMS : 0);
  const [timer, setTimer] = useState();
  const [avTime, setAVTime] = useState(meeting.value.durationAVMS ? meeting.value.durationAVMS : 0);
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
        durationHMS: msTime.msToHMS(time),
        cost: Number(msTime.msToCost(meeting.value.rate, time)),
        durationAVMS: avTime,
        durationAVHMS: msTime.msToHMS(avTime),
        costAV: Number(msTime.msToCost(meeting.value.rate, avTime)),
      }
    }));
  }
  
  const toggleSwitchState = () => {
    //change the state of the A/V? switch
    setSwitchState(prev => !prev);
  };
  const handleMoreClick = event => {
    setAnchorEl(event.currentTarget);
  };
  const handleMoreClose = () => {
    setAnchorEl(null);
  };
  const meetingLinkClick = () => {
    copy(config.APP_URL+'/meeting/'+meeting.id);
    setCopyMeetingLinkTest('Copied')
    setTimeout(()=>{
      setAnchorEl(null);
      setTimeout(()=>{
        setCopyMeetingLinkTest('Copy Meeting Link')
      }, 100)
    }, 700)  
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
            <IconButton aria-label="settings" onClick={handleMoreClick}>
                <MoreVertIcon />
            </IconButton>
            }
            title={props.cardValue.project}
            subheader={moment(props.cardValue.dateTime).format("MM-DD-YY HH:mm")}
        />
        <CardContent key={'cardContent'+props.keyIndex}>
            <ListItem key={'li'+props.keyIndex} >
                <Grid container>
                    <Grid item >
                        <Typography variant="body2">{props.cardValue.title}</Typography>
                        <Typography variant="body2" color="textSecondary">{props.cardValue.purpose}</Typography>
                    </Grid>
                    <Grid container direction="row" justify="space-between">
                      <Grid item >
                          <Typography variant="body2">Total</Typography>
                          <Typography variant="body2" className={classes.timer}> {msTime.msToHMS(time)}</Typography>
                          <Typography variant="body2" className={classes.cost}>${msTime.msToCost(meeting.value.rate, time)}</Typography>
                      </Grid>
                      <Grid item >
                          <Typography variant="body2">A/V</Typography>
                          <Typography variant="body2" className={classes.timer}> {msTime.msToHMS(avTime)}</Typography>
                          <Typography variant="body2" className={classes.cost}>${msTime.msToCost(meeting.value.rate, avTime)}</Typography>
                      </Grid>
                      <Grid item></Grid>
                    </Grid>
                </Grid>
                <div>{props.infoOnly}</div>
                <Box display={ props.infoOnly ? "none" : "block" }>
                  <ListItemSecondaryAction  >
                      <IconButton 
                          edge="end" 
                          aria-label="edit" 
                          onClick={() => props.editMeeting(meeting)}
                      >
                          <EditIcon fontSize="small"/>
                      </IconButton>
                  </ListItemSecondaryAction>
                </Box>
                
            </ListItem>
        </CardContent>
        <Box display={ props.infoOnly ? "none" : "block" }>
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
        </Box>
        
        <Menu
          id="long-menu"
          anchorEl={anchorEl}
          keepMounted
          open={open}
          onClose={handleMoreClose}
          PaperProps={{
            style: {
              width: 300,
            },
          }}
        >
          {/* {options.map(option => (
            <MenuItem key={option} selected={option === 'Pyxis'} onClick={handleMoreClose}>
              {option}
            </MenuItem>
          ))} */}
          <MenuItem onClick={meetingLinkClick}>
          <ListItemIcon>
            <SendIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit">{copyMeetingLinkTest}</Typography>
        </MenuItem>
        </Menu>
        <Collapse key={'collapse'+props.keyIndex} in={expanded} timeout="auto" unmountOnExit>
            <CardContent>
            <TextEditor 
              meeting={meeting}
            ></TextEditor>
            </CardContent>
        </Collapse>
      </Paper>
    </Card>
  );
}