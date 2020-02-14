/* eslint-disable no-use-before-define */
import React, { Component } from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    width: '100%'
  },
});

class AttendeesSelect extends Component {
  constructor(props){
    super(props)
    this.state = {
      attendees: this.props.attendees,
    }
  } 

  render(){
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Autocomplete
          multiple
          options={possibleAttendees.sort()}
          getOptionLabel={option => option.name}
          value={this.props.attendees}
          disabled={this.props.readOnly}
          onChange={(event, attendees) => {
            this.setState({attendees: attendees});
            this.props.updateAttendees(attendees);
          }}
          renderInput={params => (
            <TextField
              {...params}
              variant="standard"
              label="Attendees"
              placeholder="Favorites"
              margin="dense" 
              fullWidth
            />
          )}
        />
      </div>
    );
  }  
}
export default withStyles(styles)(AttendeesSelect);

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const possibleAttendees = [
  { name: 'Clint Cabanero', rate: 1957 },
  { name: 'Kim Kearns', rate: 1974 },
  { name: 'Jacob Lesser', rate: 1994 },
  { name: 'Tyler McCracken', rate: 1994 },
  { name: 'Shawna Paradee', rate: 2008 },
  { name: 'Todd Slind', rate: 1972 },
  { name: 'Collin Sullivan', rate: 2003 },
  { name: "Chris Voddry", rate: 1993 },
];