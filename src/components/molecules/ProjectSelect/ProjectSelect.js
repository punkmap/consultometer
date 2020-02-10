/* eslint-disable no-use-before-define */
import React, { Component }from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

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
    
    return (
      <div>
        <Autocomplete
          {...defaultProps}
          id="auto-select"
          value={this.state.project}
          autoSelect
          onChange={(event, project) => {
            console.log('project: ', project);
            this.props.updateProject(project);
            this.setState({project});
          }}
          renderInput={params => (
            <TextField {...params} label="Project" margin="normal" fullWidth />
          )}
        />
      </div>
    );
  }
}
export default ProjectSelect;

//const projects = ['ATA','EAS','NC DOT','T-Mobile','Town of Cary','Trumbull'];

const projects = [
  { name: 'ATA' },
  { name: 'EAS' },
  { name: 'NC DOT' },
  { name: 'T-Mobile' },
  { name: 'Town of Cary' },
  { name: 'Trumbull'},
];