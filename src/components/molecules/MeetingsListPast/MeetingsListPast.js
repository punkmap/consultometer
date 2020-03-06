import React, { PureComponent }from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';  
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
    
import CardContent from '@material-ui/core/CardContent';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import { FixedSizeList } from 'react-window';
import MeetingCard from '../MeetingCard';

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


class ItemRenderer extends PureComponent {
  render() {

    return (
      <MeetingCard 
        key={'meetingCard'+this.props.index} 
        keyIndex={this.props.index}
        cardValue={this.props.data[this.props.index].value}
        meetings={this.props.data}
        infoOnly={true}
      />
      
      
    );
  }
}
export default function MeetingListAll(props) {
  const classes = useStyles();
  return (
    
    <Grid container className={classes.root}>
    <Grid item >
        {/* <FixedSizeList height={400} width={345} itemSize={props.meetings.length} itemCount={props.meetings.length} itemData={props.meetings}>
        {ItemRenderer}
      </FixedSizeList> */}
      <div className={classes.scroll}>
      <List dense={true}>
        {props.meetings.map((value, index) => {
          return  <MeetingCard 
          key={'meetingCard'+index} 
                    keyIndex={index}
                    cardValue={value.value}
                    meetings={props.meetings}
                    infoOnly={true}
                  /> 
        })}
      </List>
    </div>
          </Grid>
        </Grid>

);
}