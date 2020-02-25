import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import watch from 'redux-watch';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TodayIcon from '@material-ui/icons/Today';
import EditIcon from '@material-ui/icons/Edit';
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import FilterListIcon from '@material-ui/icons/FilterList';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import RefreshIcon from '@material-ui/icons/Refresh';
import StopIcon from '@material-ui/icons/Stop';
import { withStyles } from '@material-ui/core/styles';

import moment from 'moment';

import store from '../../../store';
import { updateMeeting } from '../../../util'

import { setWorkflow, allMeetings, activeMeeting, editMeeting, startMeeting, pauseMeeting, stopMeeting, refreshMeeting, timerStops } from '../../../actions';
const styles = theme => ({
  searchbar: {
    width: '100%'
  },
  scroll: {
    maxHeight: '30vh',
    overflow: 'auto'
  } 
});

class MeetingList extends Component {
  constructor(props){
    super(props)
    this.state = {
      meetings: this.props.meetings,
      meeting: {},
      authToken: this.props.authToken,
    }
    this._isMounted = false;
    const timerStopsWatch = watch(store.getState, 'timerStops')
    store.subscribe(timerStopsWatch((newVal, oldVal, objectPath) => {
        
      this.timerStop(newVal, oldVal);
    }))
  }
  componentDidMount() {
    this._isMounted = true; 
  }
  componentWillUnmount() {
    this._isMounted = false; 
  }
  componentWillReceiveProps(nextProps){
    this.setState({meetings: nextProps.meetings});
  }
  timerStop(newVal, oldVal){
    if (this._isMounted) {
      if (newVal !== oldVal){
        this.timerStops(newVal);
      }
    }
  }
  editMeeting(meeting) {
    this.props.setWorkflow('editMeeting');

    this.props.editMeeting(meeting);
  }
  
  showTimeControls(meeting){
    if (meeting.id === this.state.meeting.id){
      meeting = {}
    } 
    this.props.activeMeeting(meeting);
    this.setState({meeting})
  }
  startMeeting(event, meeting){
    event.stopPropagation();
    this.props.startMeeting();
    //event.preventDefault();
  }
  pauseMeeting(event, meeting){
    event.stopPropagation();
    this.props.pauseMeeting();
  }
  stopMeeting(event, meeting){
    
    event.stopPropagation();
    this.props.stopMeeting();
  }
  async timerStops (val){
    let meeting = {...this.state.meeting};
    Object.keys(val.timerDetails).forEach((key, index) => {
      meeting.value[key] = val.timerDetails[key];
    })
    const response = await updateMeeting(meeting.value, this.state.authToken)
    if (this._isMounted){
          const updatedMeeting = {
          id: response.data.body.id, 
          key: response.data.body.id,
          value: {
            _id: response.data.body.id, 
            _rev: response.data.body.rev,
            type: 'meeting',
            title: meeting.value.title,
            purpose: meeting.value.purpose,
            dateTime: meeting.value.dateTime,
            durationMS: meeting.value.durationMS,
            durationHMS: meeting.value.durationHMS,
            project: meeting.value.project,
            attendees: meeting.value.attendees,
          }
        }

        let meetings = [...this.state.meetings]
        const meetingIndex = this.state.meetings.findIndex(meeting => meeting.id === response.data.body.id);
        meetings[meetingIndex] = updatedMeeting;
        this.props.allMeetings(meetings);
        this.setState({meetings, meeting: updatedMeeting});
    }
    
  }
  refreshMeeting(event, meeting){
    event.stopPropagation();
    this.props.refreshMeeting();
  }
  searchChange(event) {
  }
  // generate(element) {
  //   return this.state.meetings.map((value, index) => {});
  // }
  render() {
    const { classes } = this.props;
    
    return (
        // <div className={classes.root}>
        <div>
          
        <Grid container spacing={2}>
          <Grid item >
            {/* <Typography variant="h6" className={classes.title}> */}
            <Typography variant="h6">
              Meetings
            </Typography>
            <TextField 
              className={classes.searchbar}
              label="Filter by Project or Title"
              onChange={this.props.filterMeetings}
              InputProps={{
                endAdornment: (
                  <InputAdornment>
                    <IconButton>
                      <FilterListIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            {/* <div className={classes.demo}> */}
            <div className={classes.scroll}> 
              <List dense={true}>
              {this.state.meetings.map((value, index) => {
                let timeControls;
                if(this.state.meeting && this.state.meeting.id === this.state.meetings[index].id){
                  timeControls = <Grid item >
                    <IconButton onClick={(event) => this.startMeeting(event, this.state.meetings[index])}>
                      <PlayArrowIcon fontSize="small"/>
                    </IconButton>
                    <IconButton onClick={(event) => this.pauseMeeting(event, this.state.meetings[index])}>
                      <PauseIcon fontSize="small"/>
                    </IconButton>
                    <IconButton onClick={(event) => this.stopMeeting(event, this.state.meetings[index])}>
                      <StopIcon fontSize="small"/>
                    </IconButton>
                    <IconButton onClick={(event) => this.refreshMeeting(event, this.state.meetings[index])}>
                      <RefreshIcon fontSize="small"/>
                    </IconButton>
                  </Grid>
                }  
                return <ListItem key={index} onClick={() => this.showTimeControls(this.state.meetings[index])}>
                <ListItemAvatar>
                  <Avatar>
                    <TodayIcon />
                  </Avatar>
                </ListItemAvatar>
                <Grid item>
                  <Typography variant="body2">Project: {value.value.project}</Typography>
                  <Typography variant="body2">Title: {value.value.title}</Typography>
                  <Typography variant="body2" color="textSecondary">{moment(value.value.dateTime).format("MM-DD-YY HH:mm")}</Typography>
                  {timeControls}
                </Grid>
                
                <ListItemSecondaryAction>
                  <IconButton 
                    edge="end" 
                    aria-label="delete" 
                    onClick={() => this.editMeeting(this.state.meetings[index])}
                  >
                    <EditIcon fontSize="small"/>
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              })}
              </List>
            </div>
          </Grid>
        </Grid>
        
      </div>
    )
  }
}

export default withStyles(styles)(connect(null, { setWorkflow, allMeetings, activeMeeting, editMeeting, startMeeting, pauseMeeting, stopMeeting, refreshMeeting, timerStops })(MeetingList));

