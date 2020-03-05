import React, { PureComponent }from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import { FixedSizeList } from 'react-window';
import MeetingCard from '../MeetingCard';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    height: 400,
    maxWidth: 300,
    backgroundColor: theme.palette.background.paper,
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
    <div className={classes.root}>
      <FixedSizeList height={400} width={345} itemSize={46} itemCount={props.meetings.length} itemData={props.meetings}>
        {ItemRenderer}
      </FixedSizeList>
    </div>
  );
}