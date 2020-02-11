/* eslint-disable no-use-before-define */
import React, { Component } from 'react';
import Chip from '@material-ui/core/Chip';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { render } from '@testing-library/react';

const useStyles = makeStyles(theme => ({
  root: {
    '& > * + *': {
      marginTop: theme.spacing(3),
    },
  },
}));

class AttendeesSelect extends Component {
  constructor(props){
    super(props)
    this.state = {
      attendees: this.props.attendees,
    }
  } 
  render(){
    //const classes = useStyles();
    return (
      // <div className={classes.root}>
      <div>
        <Autocomplete
          multiple
          id="tags-standard"
          options={possibleAttendees.sort()}
          getOptionLabel={option => option.name}
          value={this.props.attendees}
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
              fullWidth
            />
          )}
        />
      </div>
    );
  }  
}
export default AttendeesSelect;

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