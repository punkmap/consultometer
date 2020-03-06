import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import clsx from 'clsx';
import moment from 'moment';

import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import EditIcon from '@material-ui/icons/Edit';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Paper from '@material-ui/core/Paper';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import RefreshIcon from '@material-ui/icons/Refresh';
import StopIcon from '@material-ui/icons/Stop';
import FaceIcon from '@material-ui/icons/Face';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import CheckIcon from '@material-ui/icons/Check';
import ToggleButton from '@material-ui/lab/ToggleButton';
import blue from '@material-ui/core/colors/blue';
import green from '@material-ui/core/colors/green';

import TextEditor from '../../atoms/TextEditor'
import CurrencyFormat from 'react-currency-format';
import IconBtn from '../../atoms/IconBtn'
import { timerStops } from '../../../actions';

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 345,
    padding: theme.spacing(2),
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
  switchControl: {
    marginLeft: 'auto',
  },
  timer: {
    color: blue[700],
  },
  cost: {
    color: green[700],
  },
}));
export default function AttendeeCard(props) {
  const classes = useStyles();
  
  return (
    <Card className={classes.root} key={'card'+props.keyIndex}>
      <Paper>
        <CardHeader
            key={'cardHeader'+props.keyIndex}
            avatar={
            <Avatar>
                <FaceIcon />
            </Avatar>
            }
            action={
            <IconButton aria-label="settings">
                <MoreVertIcon />
            </IconButton>
            }
            title={props.cardValue.key[0]}
            subheader={'rate: $'+props.cardValue.key[1]}
        />
        <CardContent key={'cardContent'+props.keyIndex}>
            <ListItem key={'li'+props.keyIndex} >
                <Grid item >
                    <Typography variant="body2">Total Meetings Cost: </Typography>
                    <Typography variant="body2" color="textSecondary">{'$ '+ Math.round(props.cardValue.value[0].sum)}</Typography>
                    <Typography variant="body2">Meetings Count: </Typography>
                    <Typography variant="body2" color="textSecondary">{props.cardValue.value[0].count}</Typography>
                    
                </Grid>
                
            </ListItem>
        </CardContent>
      </Paper>
    </Card>
  );
}