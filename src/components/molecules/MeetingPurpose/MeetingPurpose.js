import React, { Component }from 'react';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    width: '100%',
  },
  textField: {
    width: '100%',
    color: 'rgba(0, 0, 0, 0.54)',
  },
});

class MeetingPurpose extends Component {
  constructor(props){
    super(props)
    this.state = {
    }
  }
  render(){
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <TextField
          className={classes.textField} 
          id="standard-basic" 
          label="Meeting Purpose" 
          value={this.props.purpose} 
          onChange={(event) => {
            this.props.updatePurpose(event.target.value);
          }}
          margin="dense" 
          InputProps={{
            readOnly: this.props.readOnly,
          }}
        />
      </div>
    );  
  }
}

export default withStyles(styles)(MeetingPurpose)