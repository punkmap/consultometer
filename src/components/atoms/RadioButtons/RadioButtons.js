import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(3),
  },
}));

export default function RadioButtonsGroup(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(props.radioOptions[0].value);

  const handleChange = event => {
    setValue(event.target.value);
    props.handleChange(event.target.value);
  };

  return (
    <div>
      <FormControl component="fieldset" className={classes.formControl}>
        <FormLabel component="legend">Cost Type</FormLabel>
        <RadioGroup row aria-label="gender" name="gender1" value={value} onChange={handleChange}>
          {props.radioOptions.map((option) =>
            <FormControlLabel key={option.value} value={option.value} control={<Radio />} label={option.label} />
          )}
        </RadioGroup>
      </FormControl>
    </div>
  );
}
