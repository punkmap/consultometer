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

class MeetingsTitle extends Component {
  constructor(props){
    super(props)
    this.state = {
      project: this.props.project,
    }
  }
  render(){
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <TextField
          error={!this.props.title.length}
          className={classes.textField} 
          id="standard-basic" 
          label="Meeting Title" 
          value={this.props.title} 
          onChange={(event) => {
            this.props.updateTitle(event.target.value);
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

export default withStyles(styles)(MeetingsTitle)
// function BasicTextFields(props) {
//   const classes = useStyles();
//   return (
//       <TextField id="standard-basic" label="Meeting Title" value={props.title} onChange={(event) => {
//         props.updateTitle(event.target.value);
//       }}/>
//   );
// }