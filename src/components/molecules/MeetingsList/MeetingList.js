import React, { Component } from 'react';
import { connect } from 'react-redux';
import watch from 'redux-watch';

import List from '@material-ui/core/List';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import FilterListIcon from '@material-ui/icons/FilterList';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import RefreshIcon from '@material-ui/icons/Refresh';
import StopIcon from '@material-ui/icons/Stop';
import { withStyles } from '@material-ui/core/styles';


import store from '../../../store';
import { updateMeeting } from '../../../util'

import MeetingCard from '../MeetingCard'

import { setWorkflow, allMeetings, activeMeeting, editMeeting, startMeeting, pauseMeeting, stopMeeting, refreshMeeting, timerStops } from '../../../actions';
const styles = theme => ({
  root: {
    flexGrow: 1,
    margin: '1em',
  },
  searchbar: {
    width: '100%'
  },
  scroll: {
    maxHeight: '60vh',
    overflow: 'auto'
  },
  box: {
    minWidth: '1000px'
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
      console.log('TIMERSTOPS newVal: ', newVal);  
      this.timerStop(newVal, oldVal);
    }));
    const saveNoteWatch = watch(store.getState, 'saveNote')
    store.subscribe(saveNoteWatch((newVal, oldVal, objectPath) => {
      this.saveNote(newVal, oldVal);
    }));
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
        console.log(newVal)
        const meeting = {...newVal.timerDetails.meeting};
        const updateVals = {...newVal.timerDetails.timer}; 
        this.saveMeeting(meeting, updateVals);
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
    this.setState({meeting});
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
  saveNote (newVal, oldVal) {
    if (newVal !== oldVal) {
      const meeting = this.state.meetings.filter((meeting) => {
        return meeting.value._id === newVal.contentBlock.meeting.value._id;
      })[0];
      const updateVals = { meetingNotes: newVal.contentBlock.contentBlock};
      this.saveMeeting(meeting, updateVals);
    }  
  }
  async saveMeeting (meeting, updateVals){
    console.log(updateVals);
    Object.keys(updateVals).forEach((key, index) => {
      meeting.value[key] = updateVals[key];
    })
    const response = await updateMeeting(meeting.value, this.state.authToken)
    console.log()
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
            durationAVMS: meeting.value.durationAVMS,
            durationHMS: meeting.value.durationHMS,
            project: meeting.value.project,
            attendees: meeting.value.attendees,
          }
        }
        console.log('updatedMeeting: ', updatedMeeting);
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
          
        <Grid container className={classes.root}>
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
                // let timeControls;
                // if(this.state.meeting && this.state.meeting.id === this.state.meetings[index].id){
                //   timeControls = <div>
                //     <IconButton onClick={(event) => this.startMeeting(event, this.state.meetings[index])}>
                //       <PlayArrowIcon fontSize="small"/>
                //     </IconButton>
                //     <IconButton onClick={(event) => this.pauseMeeting(event, this.state.meetings[index])}>
                //       <PauseIcon fontSize="small"/>
                //     </IconButton>
                //     <IconButton onClick={(event) => this.stopMeeting(event, this.state.meetings[index])}>
                //       <StopIcon fontSize="small"/>
                //     </IconButton>
                //     <IconButton onClick={(event) => this.refreshMeeting(event, this.state.meetings[index])}>
                //       <RefreshIcon fontSize="small"/>
                //     </IconButton>
                //   </div>
                // }  
                return <MeetingCard 
                          key={'meetingCard'+index} 
                          keyIndex={index}
                          cardValue={value.value}
                          meetings={this.state.meetings}
                          editMeeting={this.editMeeting.bind(this)}
                          startMeeting={this.startMeeting.bind(this)}
                          pauseMeeting={this.pauseMeeting.bind(this)}
                          stopMeeting={this.stopMeeting.bind(this)}
                          refreshMeeting={this.refreshMeeting.bind(this)}
                        /> 
              })}
              </List>
            </div>
          </Grid>
        </Grid>
        
    )
  }
}

export default withStyles(styles)(connect(null, { setWorkflow, allMeetings, activeMeeting, editMeeting, startMeeting, pauseMeeting, stopMeeting, refreshMeeting, timerStops })(MeetingList));

