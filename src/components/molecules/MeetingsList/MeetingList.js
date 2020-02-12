import React, { Component } from 'react';
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
import StopIcon from '@material-ui/icons/Stop';

import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import moment from 'moment';

import { setWorkflow, editMeeting } from '../../../actions';
// function generate(element) {
//   return [0, 1, 2].map(value =>
//     React.cloneElement(element, {
//       key: value,
//     }),
//   );
// }
class MeetingList extends Component {
  constructor(props){
    super(props)
    this.state = {
      meetings: this.props.meetings,
      meeting: {},
    }
  }
  componentWillMount() {
    console.log('this.state.meetings: ', this.state.meetings);
    console.log('this.props.meetings: ', this.props.meetings);
    console.log('ML willMount');
    // const url = 'http://64.225.122.227:5984/consultometer/_design/meetings/_view/meeting-view'
    // axios.get(url)
    // .then((response) => {
    //   this.setState({meetings: response.data.rows}, () => {
    //     console.log('Meetings List: ', this.state.meetings);
    //   });
    // })
  }
  componentDidMount() {
    console.log('ML didMount')
    // const url = 'http://64.225.122.227:5984/consultometer/_design/meetings/_view/meeting-view'
    // axios.get(url)
    // .then((response) => {
    //   this.setState({meetings: response.data.rows}, () => {
    //     console.log('Meetings List: ', this.state.meetings);
    //   });

    // })
  }
  componentDidUpdate() {
    console.log('ML didUpdate');
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
    console.log('nextProps: ', nextProps)
    this.setState({meetings: nextProps.meetings});
  }

  nextPath(path) {
    this.props.history.push(path);
  }
  editMeeting(meeting) {
    console.log('value: ', meeting);
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
    this.nextPath('/load');
  }
  showTimeControls(meeting){
    if (meeting.id === this.state.meeting.id){
      meeting = {}
    }
    this.setState({meeting})
  }
  startMeeting(event, meeting){
    console.log('start');
    event.stopPropagation();
    //event.preventDefault();
  }
  pauseMeeting(event, meeting){
    console.log('pause');
    event.stopPropagation();
  }
  stopMeeting(event, meeting){
    console.log('stop');
    event.stopPropagation();
  }
  searchChange(event) {
    console.log(event.target.value);
    
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
          <Grid item xs={12} md={6}>
            {/* <Typography variant="h6" className={classes.title}> */}
            <Typography variant="h6">
              Meetings
            </Typography>
            <TextField
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



export default withRouter(connect(null, { setWorkflow, editMeeting })(MeetingList));
