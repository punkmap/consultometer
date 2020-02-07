/* eslint-disable no-use-before-define */
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

export default function ProjectSelect(props) {
  const defaultProps = {
    options: projects.sort(),
    getOptionLabel: option => option.name,
  };

  const [value, setValue] = React.useState(null);
  return (
    <Autocomplete
        {...defaultProps}
        id="auto-select"
        autoSelect
        onChange={(event, values) => {
          props.updateProject(values);
        }}
        renderInput={params => (
          <TextField {...params} label="Project" margin="normal" fullWidth />
        )}
      />
  );
}

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const projects = [
  { name: 'ATA' },
  { name: 'EAS' },
  { name: 'NC DOT' },
  { name: 'T-Mobile' },
  { name: 'Town of Cary' },
  { name: 'Trumbull'},
];