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
  }
});

class MeetingList extends Component {
  constructor(props){
    super(props)
    this.state = {
      meetings: this.props.meetings,
      meeting: {},
    }
    const timerStopsWatch = watch(store.getState, 'timerStops')
    store.subscribe(timerStopsWatch((newVal, oldVal, objectPath) => {
        // const clickCount = store.getState().click.clickCount;
        console.log('endMeetingWatch: NEWVAL', newVal)
        this.timerStops(newVal);
    }))
  }
  componentWillMount() {
    // const url = 'http://64.225.122.227:5984/consultometer/_design/meetings/_view/meeting-view'
    // axios.get(url)
    // .then((response) => {
    //   this.setState({meetings: response.data.rows}, () => {
    //   });
    // })
  }
  componentDidMount() {
    // const url = 'http://64.225.122.227:5984/consultometer/_design/meetings/_view/meeting-view'
    // axios.get(url)
    // .then((response) => {
    //   this.setState({meetings: response.data.rows}, () => {
    //   });

    // })
  }
  componentDidUpdate() {
    // const url = 'http://64.225.122.227:5984/consultometer/_design/meetings/_view/meeting-view'
    // axios.get(url)
    // .then((response) => {
    //   this.setState({meetings: response.data.rows}, () => {
    //     this.state.meetings.forEach((meeting) => {
    //     })
    //   });

    // })
  }
  componentWillReceiveProps(nextProps){
    this.setState({meetings: nextProps.meetings});
  }

  nextPath(path) {
    this.props.history.push(path);
  }
  editMeeting(meeting) {
    this.props.setWorkflow('editMeeting');

    this.props.editMeeting(meeting);
    this.nextPath('/edit');
    // this.setState((state, props) => ({clickCount: state.clickCount + 1}), () => {
    //   this.props.increment(this.state.clickCount);
    // } )
  }
  openMeeting(meeting){
    this.props.setWorkflow('loadMeeting');
    this.props.editMeeting(meeting);
    this.props.activeMeeting(meeting);
    this.nextPath('/load');
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
    
    console.log('STOP meeting: ', meeting);
    event.stopPropagation();
    this.props.stopMeeting();
    this.setState({dialogOpen: true});
    // event.stopPropagation();
    // meeting.length = 
    // this.props.stopMeeting();
    // updateMeeting(meeting.value)
    // .then(response => {
    //     const updatedMeeting = {
    //       id: response.data.id, 
    //       key: response.data.id,
    //       value: {
    //         _id: response.data.id, 
    //         _rev: response.data.rev,
    //         type: 'meeting',
    //         title: meeting.value.title,
    //         dateTime: meeting.value.dateTime,
    //         project: meeting.value.project.name,
    //         attendees: meeting.value.attendees,
    //       }
    //     }
    //     const meetings = this.state.meetings.filter(function( obj ) {
    //       return obj.id !== response.data.id;
    //     });
    //     console.log('meeting: ', meeting);
    //     meetings.push(updatedMeeting);
    //     this.props.allMeetings(meetings);
    //     // const newMeetings = [...this.state.meetings, newMeeting];
    //     // this.props.allMeetings(newMeetings);
    // })
    // .catch(error => {
    // });

  }
  timerStops (val){
    let meeting = {...this.state.meeting};
    Object.keys(val.timerDetails).forEach((key, index) => {
      console.log(key, val.timerDetails[key]);
      meeting.value[key] = val.timerDetails[key];
    })
    console.log('meeting: ', meeting);
    updateMeeting(meeting.value)
    .then(response => {
        const updatedMeeting = {
          id: response.data.id, 
          key: response.data.id,
          value: {
            _id: response.data.id, 
            _rev: response.data.rev,
            type: 'meeting',
            title: meeting.value.title,
            dateTime: meeting.value.dateTime,
            project: meeting.value.project.name,
            attendees: meeting.value.attendees,
          }
        }
        const meetings = this.state.meetings.filter(function( obj ) {
          return obj.id !== response.data.id;
        });
        console.log('meeting: ', meeting);
        meetings.push(updatedMeeting);
        this.props.allMeetings(meetings);
        // const newMeetings = [...this.state.meetings, newMeeting];
        // this.props.allMeetings(newMeetings);
    })
    .catch(error => {
    });
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
            <div>
              <List dense={true}>
              {this.state.meetings.map((value, index) => {
                let timeControls;
                if(this.state.meeting && this.state.meeting.id === value.id){
                  timeControls = <Grid item >
                    <IconButton onClick={(event) => this.startMeeting(event, value)}>
                      <PlayArrowIcon fontSize="small"/>
                    </IconButton>
                    <IconButton onClick={(event) => this.pauseMeeting(event, value)}>
                      <PauseIcon fontSize="small"/>
                    </IconButton>
                    <IconButton onClick={(event) => this.stopMeeting(event, value)}>
                      <StopIcon fontSize="small"/>
                    </IconButton>
                    <IconButton onClick={(event) => this.refreshMeeting(event, value)}>
                      <RefreshIcon fontSize="small"/>
                    </IconButton>
                  </Grid>
                }  
                return <ListItem key={index} onClick={() => this.showTimeControls(value)}>
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
                    onClick={() => this.editMeeting(value)}
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

export default withStyles(styles)(withRouter(connect(null, { setWorkflow, allMeetings, activeMeeting, editMeeting, startMeeting, pauseMeeting, stopMeeting, refreshMeeting, timerStops })(MeetingList)));

