/* eslint-disable no-use-before-define */
import React, { Component }from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    width: '100%',
  },
});
class ProjectSelect extends Component {
  
  constructor(props){
    super(props)
    this.state = {
      project: this.props.project,
    }
    
  }
  render(){
    const defaultProps = {
      options: projects.sort(),
      getOptionLabel: option => option.name,
    };
    
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Autocomplete
          {...defaultProps}
          id="auto-select"
          value={this.state.project}
          autoSelect
          onChange={(event, project) => {
            this.props.updateProject(project);
            this.setState({project});
          }}
          renderInput={params => (
            <TextField 
              {...params} 
              label="Project" 
              margin="dense" 
              fullWidth 
              // InputProps={{
              //   readOnly: this.props.readOnly,
              // }}
            />
          )}
        />
      </div>
    );
  }
}
export default withStyles(styles)(ProjectSelect);

//const projects = ['ATA','EAS','NC DOT','T-Mobile','Town of Cary','Trumbull'];

const projects = [
  { name: 'ATA' },
  { name: 'EAS' },
  { name: 'NC DOT' },
  { name: 'T-Mobile' },
  { name: 'Town of Cary' },
  { name: 'Trumbull'},
];