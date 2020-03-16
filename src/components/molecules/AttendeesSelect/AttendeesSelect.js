/* eslint-disable no-use-before-define */
import React, { Component, Fragment } from 'react';
import { instanceOf } from 'prop-types';
import { useCookies, withCookies, Cookies } from 'react-cookie';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';

import Dialog from '../../atoms/Dialog'

import { config } from '../../../config'

const styles = theme => ({
  root: {
    width: '100%'
  },
});
// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top

class AttendeesSelect extends Component {
  constructor(props){
    super(props)
    const { cookies } = props;
    this.state = {
      authToken: cookies.get('authToken'),
      possibleAttendees: [],
      filterAttendees: this.props.attendees,
      attendees: this.props.attendees,
      dialogType: '',
      dialogOpen: false,
      deleteAttendeeOption: null,
      deleteAttendeeName: '',
      newAttendeeName: 'test',
      newAttendeeRate: 1234,
      newAttendees: [],
      editAttendeeName: '',
      editAttendeeRate: 0,
      editAttendeeOption: null,
    }
    this._isMounted = false;
  }
  componentDidMount() {
    this._isMounted = true;
    if (this.state.possibleAttendees.length === 0 ){
      this.getAttendees(this.state.authToken)
    }
  }
  componentWillUnmount() {
    this._isMounted = false; 
  }
  async getAttendees (token) {
    const url = config.API_URL+'/api/attendees'
    const params = {token};
    const response = await axios.get(url, {
      params
    })
    if (this._isMounted) {
      let possibleAttendees
      possibleAttendees=response.data.body.rows;
      if (possibleAttendees.findIndex((attendee) => attendee.value.name === 'Add User') === -1) possibleAttendees.unshift({ value: { name: "Add User", rate: 0 }});
      this.setState({possibleAttendees, filterAttendees: possibleAttendees})
    }
  }
  // showAddAttendeeDialog(){
  //   this.setState({addAttendeeDialogOpen: true});
  // }
  // closeAddAttendeeDialog() {
  //   this.setState({dialogOpen: false});
  // }
  async addAttendee (event){
    let newAttendees = this.state.newAttendees;
    let possibleAttendees = this.state.possibleAttendees;
    const attendee = {
      type: 'attendee', 
      name: this.state.newAttendeeName, 
      rate: this.state.newAttendeeRate, 
    };

    const headers = {
      'Content-Type': 'application/json',
    }
    const authToken = this.state.authToken;
    const response = await axios.post(config.API_URL+'/api/attendee', { attendee, authToken }, {
        headers: headers,
    })
    const newAttendee = {id: response.data.body.id, key: response.data.body.id, value: {...attendee, _id: response.data.body.id, _rev: response.data.body.rev}};
    newAttendees.push(newAttendee);
    possibleAttendees.push(newAttendee);
    this.setState({possibleAttendees, newAttendees, filterAttendees: possibleAttendees});
  }
  loadEditAttendeeDialog(option){
    this.setState({
      editAttendeeOption: option,
      dialogType: 'editAttendee', 
      dialogOpen: true,
      editAttendeeName: option.value.name,
      editAttendeeRate: option.value.rate,
    });
  }
  async updateAttendee(option){
    const headers = {
      'Content-Type': 'application/json',
    }
    const authToken = this.state.authToken;
    const attendee = option;
    attendee.value.name = this.state.editAttendeeName;
    attendee.value.rate = this.state.editAttendeeRate;
    const params = {attendee, authToken}
    const response = await axios.put(config.API_URL+'/api/attendee', params, {
        headers: headers,
    })
    attendee.value._rev = response.data.body.rev;
    if (response.status === 200){
      this.setState({dialogOpen: false});
      let possibleAttendees = this.state.possibleAttendees;
      possibleAttendees[possibleAttendees.findIndex((pa) => pa.value._id === attendee.value._id)].value = attendee.value;
      let attendees = this.state.attendees;
      attendees[attendees.findIndex((aa) => aa.value._id === attendee.value._id)].value = attendee.value;
      this.setState({attendees, possibleAttendees, editAttendeeOption: attendee, filterAttendees: possibleAttendees});
    }
  }
  confirmDeleteAttendee(event, option){
    event.stopPropagation();
    this.setState({
      deleteAttendeeOption: option,
      dialogOpen: true,
      dialogType: 'deleteAttendee',
      deleteAttendeeName: option.value.name
    })
  }
  async deleteAttendee(option){
    let possibleAttendees = this.state.possibleAttendees;
    const id = option.value._id, rev = option.value._rev;
    const headers = {
      'Content-Type': 'application/json',
    }
    const authToken = this.state.authToken;
    const params = {id, rev, authToken}
    const response = await axios.delete(config.API_URL+'/api/attendee', {
        headers: headers,
        data: {params}
    })
    if (response.status === 200){
      this.setState({dialogOpen: false});
      possibleAttendees = possibleAttendees.filter((attendee) => attendee.id !== response.data.body.id);
      this.setState({possibleAttendees, filterAttendees: possibleAttendees});
    }
  }
  removeAddedAttendee(index){
    let newAttendees = this.state.newAttendees;
    this.deleteAttendee(newAttendees[index])
    newAttendees.splice(index, 1);
    this.setState({newAttendees});
  }
  getDialogTitle(){
    let title;
    if (this.state.dialogType === 'addAttendee'){
      title = 'login';
    }
    else if (this.state.dialogType === 'deleteAttendee'){
      title = 'delete user';
    }
    else if (this.state.dialogType === 'editAttendee'){
      title = 'edit attendee';
    }
    return title;
  }
  filterTheAttendees(event) {
    const searchString = event.target.value;
    console.log('SEARCHSTRING: ', searchString);
    console.log('Attendees: ', this.state.attendees);
    this.setState({filterAttendees: this.state.possibleAttendees.filter(attendee => {
        console.log('ATTENDEE: ', attendee.value);
        return attendee.value.name.indexOf(searchString) > -1
      })
    })
    // this.setState({
    //   searchMeetings: this.state.meetings.filter(meeting => 
    //     meeting.value.title.indexOf(searchString) > -1 || 
    //     meeting.value.project.indexOf(searchString) > -1
    //   )
    // });
  }
  getDialogContent(){
    let content;
    if (this.state.dialogType === 'addAttendee'){
      content = <form>
          <TextField
              autoFocus
              margin="dense"
              label="attendee"
              fullWidth
              onChange={(event) => {this.setState({newAttendeeName: event.target.value})}}
              value={this.state.newAttendeeName}
          />
          <TextField
              autoFocus
              margin="dense"
              label="rate"
              type="number"
              fullWidth
              onChange={(event) => {this.setState({newAttendeeRate: Number(event.target.value)})}}
              value={this.state.newAttendeeRate}
          />
          <div>
          {this.state.newAttendees.map((option, index) => {
            return <Chip
              key={index}
              label={option.value.name + " $" + option.value.rate}
              onDelete={() => this.removeAddedAttendee(index)}
          />    
          })}
            
          </div>
      </form>
    }
    else if (this.state.dialogType === 'deleteAttendee'){
      content = <Typography variant="h6">Are you sure you want to delete {this.state.deleteAttendeeName}</Typography>;
    }
    else if (this.state.dialogType === 'editAttendee'){
      content = <form>
          <TextField
              autoFocus
              margin="dense"
              label="attendee"
              fullWidth
              onChange={(event) => {this.setState({editAttendeeName: event.target.value})}}
              value={this.state.editAttendeeName}
          />
          <TextField
              autoFocus
              margin="dense"
              label="rate"
              type="number"
              fullWidth
              onChange={(event) => {this.setState({editAttendeeRate: Number(event.target.value)})}}
              value={this.state.editAttendeeRate}
          />
      </form>
    }
    return content;
  }
  getDialogActions(){
    let actions;

    if (this.state.dialogType === 'addAttendee'){
      actions = <Fragment> 
          <Button value="cancel" onClick={() => {this.setState({dialogOpen: false});}} color="primary">
          Close
          </Button>
          <Button  value="add" type="submit" disabled={this.state.username==='' || this.state.password===''} onClick={(event) => this.addAttendee(event)} color="primary" autoFocus>
          Add
          </Button>
      </Fragment>
    }
    else if (this.state.dialogType === 'deleteAttendee'){
      actions = <Fragment> 
          <Button value="cancel" onClick={() => {this.setState({dialogOpen: false});}} color="primary">
          Cancel
          </Button>
          <Button  value="add" type="submit" disabled={this.state.username==='' || this.state.password===''} onClick={(event) => this.deleteAttendee(this.state.deleteAttendeeOption)} color="primary" autoFocus>
          Delete
          </Button>
      </Fragment>
    }
    else if (this.state.dialogType === 'editAttendee'){
      actions = <Fragment> 
          <Button value="cancel" onClick={() => {this.setState({dialogOpen: false});}} color="primary">
          Cancel
          </Button>
          <Button  value="add" type="submit" disabled={this.state.username==='' || this.state.password===''} onClick={(event) => this.updateAttendee(this.state.editAttendeeOption)} color="primary" autoFocus>
          Update
          </Button>
      </Fragment>
    }
    return actions;
  }
  styleOption(option){
    let returnOption;
    if (option.value.name === 'Add User'){
      returnOption = <Fragment>
          <Grid item>
            {option.value.name}
          </Grid>
          <Grid item>
            <PersonAddIcon fontSize="small"/>
          </Grid>
        </Fragment>
    } else {
      returnOption =<Fragment><Grid item>
      {option.value.name}
      </Grid>
      
      <Grid item>
        <div>
        <IconButton 
          edge="end" 
          aria-label="delete" 
          fontSize="small"
          onClick={(event) => this.confirmDeleteAttendee(event,option)}
        >
          <DeleteIcon fontSize="small"/>
        </IconButton>
        </div>
      </Grid>
      </Fragment>    
    }
    return returnOption
  }
  render(){
    const { classes } = this.props;
    console.log('filterAttendees: ', this.state.filterAttendees);
    console.log('possibleAttendees: ', this.state.possibleAttendees);
    return (
      <div className={classes.root}>
        <Autocomplete
          multiple
          options={this.state.filterAttendees}
          // getOptionLabel={option => {
          //   console.log('OPTION: ', option);
          //   return option.value.name}}
          value={this.props.attendees}
          disabled={this.props.readOnly}
          onChange={(event, attendees) => {
            const addAttendeeIndex = attendees.findIndex((attendee) => {
              return attendee.value.name === 'Add User'
            });
            if (addAttendeeIndex > -1) {
              //if Add User was selected then remove the option and popup the dialog;
              attendees.splice(addAttendeeIndex, 1);
              this.setState({dialogType: 'addAttendee', dialogOpen: true});
            }
            this.setState({attendees});
            this.props.updateAttendees(attendees);
          }}
          renderOption={option => (
            <Grid
              justify="space-between" 
              alignItems="center"
              container 
            >
              {this.styleOption(option)}
            </Grid>
          )}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                label={option.value.name + " $" + option.value.rate}
                {...getTagProps({ index })}
                icon={<IconButton 
                  edge="end" 
                  aria-label="delete" 
                  fontSize="small"
                  onClick={() => this.loadEditAttendeeDialog(option)}
                >
                  <EditIcon fontSize="small"/>
                </IconButton>}
              />
            ))
          }
          renderInput={params => (
              <TextField
                error={this.state.attendees === undefined}
                {...params}
                variant="standard"
                label="Attendees"
                margin="dense" 
                fullWidth
                onChange={(event)=>{this.filterTheAttendees(event)}}
              />
          )}
        />
        <Dialog 
          dialogOpen={this.state.dialogOpen} 
          dialogContent={this.getDialogContent()}
          dialogTitle={this.getDialogTitle()}
          dialogActions={this.getDialogActions()}
        />
      </div>
    );
  }  
}
export default withCookies(withStyles(styles)(AttendeesSelect));

