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

// function renderRow(props) {
//   console.log(props);
//   const { index, style } = props;

//   return (
//     <ListItem button style={style} key={index}>
//       <Card>
//         <Paper>
//         <CardHeader
//           // title={'card title'}
//           // subheader={'card subheader'}
//           title={props.meetings[index].project}
//           subheader={props.meetings[index].dateTime}
//         />
//         <CardContent>
//           Content
//         </CardContent>
//         </Paper>
//       </Card>
//     </ListItem>
//   );
// }

// renderRow.propTypes = {
//   index: PropTypes.number.isRequired,
//   style: PropTypes.object.isRequired,
// };
class ItemRenderer extends PureComponent {
  render() {

    console.log(this.props.index);
    console.log(this.props.data);
    console.log(this.props.data[this.props.index]);
    return (
      // <div style={this.props.style}>
      //   Item {this.props.data[this.props.index].value.project}
      // </div>
      
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
  console.log('MeetingsListPastMeetings: ', props.meetings);
  return (
    <div className={classes.root}>
      <FixedSizeList height={400} width={345} itemSize={46} itemCount={props.meetings.length} itemData={props.meetings}>
        {ItemRenderer}
      </FixedSizeList>
    </div>
  );
}