import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles(theme => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: 200,
    },
  },
}));

export default function BasicTextFields(props) {
  const classes = useStyles();
  console.log('props.title: ', props.title);
  return (
      <TextField id="standard-basic" label="Meeting Title" value={props.title} onChange={(event) => {
        props.updateTitle(event.target.value);
      }}/>
  );
}