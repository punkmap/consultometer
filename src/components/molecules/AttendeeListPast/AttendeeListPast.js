import React, { PureComponent }from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import { FixedSizeList } from 'react-window';
import AttendeeCard from '../AttendeeCard';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    margin: '1em',
  },
  searchbar: {
    width: '100%'
  },
  scroll: {
    maxHeight: '60vh',
    overflow: 'auto'
  },
}));


class AttendeeListPast extends PureComponent {
  render() {

    return (
        <AttendeeCard 
          keyIndex={this.props.index}
          cardValue={this.props.data[this.props.index]}
          // meetings={this.props.data}
          // infoOnly={true}
        />
    );
  }
}
export default function AttendeesListPast(props) {
  const classes = useStyles();
  return (
    // <div className={classes.root}>
    //   <FixedSizeList height={400} width={345} itemSize={46} itemCount={props.attendees.length} itemData={props.attendees}>
    //     {AttendeeListPast}
    //   </FixedSizeList>
    // </div>
    <Grid container className={classes.root}>
    <Grid item >
        {/* <FixedSizeList height={400} width={345} itemSize={props.meetings.length} itemCount={props.meetings.length} itemData={props.meetings}>
        {ItemRenderer}
      </FixedSizeList> */}
      <div className={classes.root}>
      <List dense={true}>
        {props.attendees.map((value,index) => {
          return <AttendeeCard 
          key={index}
          keyIndex={index}
          cardValue={value}
          // meetings={this.props.data}
          // infoOnly={true}
        />
        })}
      </List>
      
    </div>
          </Grid>
        </Grid>
  );
}