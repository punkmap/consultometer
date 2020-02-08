import React, { Component } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import FolderIcon from '@material-ui/icons/Folder';
import DeleteIcon from '@material-ui/icons/Delete';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import axios from 'axios';
import moment from 'moment';

import store from '../../../store'
import { setWorkflow } from '../../../actions';
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
      meetings: [],
      elements: ['one', 'two', 'three'],
    }
  //  const addMeetingWatch = watch(store.getState, 'click.clickCount')
  //   store.subscribe(addMeetingWatch((newVal, oldVal, objectPath) => {
  //       const clickCount = store.getState().click.clickCount;
  //       this.setState({
  //           clickCount
  //       })
  //   }))
  }
  componentDidMount() {
    // const url = 'http://64.225.122.227:5984/consultometer/_design/meetings/_view/meeting-view'
    // axios.get(url)
    // .then((response) => {
    //   this.setState({meetings: response.data.rows}, () => {
    //     this.state.meetings.forEach((meeting) => {
    //     })
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
            {/* <div className={classes.demo}> */}
            <div>
              <List dense={true}>
              {this.state.meetings.map((value, index) => {
                return <ListItem key={index}>
                <ListItemAvatar>
                  <Avatar>
                    <FolderIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary= {"Title: " + value.value.title}
                  secondary={moment(value.value.dateTime).format("DD-MM-YY HH:mm")}
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="delete">
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              })}
                {/* {this.state.meetings.map((value, index) => {
                  <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <FolderIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Single-line item"
                    secondary={true ? 'Secondary text' : null}
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="delete">
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                 }
                )} */}
              </List>
            </div>
          </Grid>
        </Grid>
      </div>
    )
  }
}



export default connect(null, { setWorkflow })(MeetingList);