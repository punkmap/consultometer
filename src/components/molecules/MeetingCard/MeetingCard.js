import React, { useState, useEffect } from 'react';
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
export default function RecipeReviewCard(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);
  const [time, setTime] = useState(props.meetings[props.keyIndex].value.durationMS ? props.meetings[props.keyIndex].value.durationMS : 0);
  const [timer, setTimer] = useState();
  const [avTime, setAVTime] = useState(props.meetings[props.keyIndex].value.durationAVMS ? props.meetings[props.keyIndex].value.durationAVMS : 0);
  const [avTimer, setAVTimer] = useState();
  const [start, setStart] = useState(Date.now() - props.meetings[props.keyIndex].value.durationMS);
  const [switchState, setSwitchState] = useState(false);
  useEffect(() => {
    console.log('SWITCHSTATE: ', switchState);
    if (switchState === true && timerRunning){
      console.log('start av timer')
      startAV();
    } 
    else if (switchState === false && 
      timerRunning){
      console.log('stop av timer')
    }
  }, [switchState]);
  const startAV = () => {
    //const meeting = props.meetings[props.keyIndex];
    const timeNow=Date.now()-avTime;
    // if(timerRunning){

    //     clearInterval(avTimer);
    //     setTimerRunning(false);
    // }else{
        setAVTimer(setInterval(()=>{setAVTime(Date.now()-timeNow)},1000));
        //setTimerRunning(true);
    // }
  };
  const stopAV = () => {
    
  }
  const [rate, setRate] = useState(props.meetings[props.keyIndex].value.attendees.reduce(function(prev, cur) {
    return Number(prev) + Number(cur.value.rate);
}, 0));
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  //rate callback here
  const startMeeting = (meeting) => {
    //const meeting = props.meetings[props.keyIndex];
    const timeNow=Date.now()-time;
    if(timerRunning){
        clearInterval(timer);
        setTimerRunning(false);
    }else{
        setTimer(setInterval(()=>{setTime(Date.now()-timeNow)},1000));
        setTimerRunning(true);
    }
  };
  const pauseMeeting = (meeting) => {
    if (timerRunning) {

        console.log('PAUSE START: ', Date(start));
        clearInterval(timer);
        setTimerRunning(false);
    } 
    else {
        startMeeting(meeting);
    }
  }
  
  const stopMeeting = (meeting) => {
    setTimerRunning(false);
    clearInterval(timer);
    dispatch(timerStops({
      meeting,
      timer: {
        durationMS: time,
        durationHMS: msToHMS(time),
        cost: Number(msToCost(time)),
      }
    }));
  }
  const msToHMS = ( ms ) => {
    // 1- Convert to seconds:
    var seconds = ms / 1000;
    // 2- Extract hours:
    var hours = parseInt( seconds / 3600 ); // 3,600 seconds in 1 hour
    seconds = Math.round(seconds % 3600); // seconds remaining after extracting hours
    // 3- Extract minutes:
    var minutes = parseInt( seconds / 60 ); // 60 seconds in 1 minute
    // 4- Keep only seconds not extracted to minutes:
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
  // const handleAVSwitch = () => {
  //   console.log('AVSWITCHVAL: ', avSwitchVal);
  //   setAVSwitchVal(prev => !prev)
  // }
  const toggleSwitchState = () => {
    console.log('CHECKED: ', switchState);
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
                        onClick={() => props.editMeeting(props.meetings[props.keyIndex])}
                    >
                        <EditIcon fontSize="small"/>
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
        </CardContent>
        <CardActions disableSpacing key={'cardActions'+props.keyIndex}>
        
            <IconButton onClick={(event) => startMeeting(props.meetings[props.keyIndex])}>
            {/* <IconButton onClick={(event) => handleStartClick()}> */}
                <PlayArrowIcon fontSize="small"/>
            </IconButton>
            <IconButton onClick={(event) => pauseMeeting(props.meetings[props.keyIndex])}>
                <PauseIcon fontSize="small"/>
            </IconButton>
            <IconButton onClick={(event) => stopMeeting(props.meetings[props.keyIndex])}>
                <StopIcon fontSize="small"/>
            </IconButton>
            <IconButton onClick={(event) => props.refreshMeeting(event, props.meetings[props.keyIndex])}>
                <RefreshIcon fontSize="small"/>
            </IconButton>
            


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
            <Typography paragraph>Method:</Typography>
            <Typography paragraph>
                Heat 1/2 cup of the broth in a pot until simmering, add saffron and set aside for 10
                minutes.
            </Typography>
            <Typography paragraph>
                Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet over medium-high
                heat. Add chicken, shrimp and chorizo, and cook, stirring occasionally until lightly
                browned, 6 to 8 minutes. Transfer shrimp to a large plate and set aside, leaving chicken
                and chorizo in the pan. Add pimentón, bay leaves, garlic, tomatoes, onion, salt and
                pepper, and cook, stirring often until thickened and fragrant, about 10 minutes. Add
                saffron broth and remaining 4 1/2 cups chicken broth; bring to a boil.
            </Typography>
            <Typography paragraph>
                Add rice and stir very gently to distribute. Top with artichokes and peppers, and cook
                without stirring, until most of the liquid is absorbed, 15 to 18 minutes. Reduce heat to
                medium-low, add reserved shrimp and mussels, tucking them down into the rice, and cook
                again without stirring, until mussels have opened and rice is just tender, 5 to 7
                minutes more. (Discard any mussels that don’t open.)
            </Typography>
            <Typography>
                Set aside off of the heat to let rest for 10 minutes, and then serve.
            </Typography>
            </CardContent>
        </Collapse>
      </Paper>
    </Card>
  );
}