import React, { Component, Fragment } from 'react';
import { DateTimePicker } from "@material-ui/pickers";
import FormControl from '@material-ui/core/FormControl';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    width: '100%'
  },
  DTP: {
    width: '100%'
  }
});

class MeetingDateTime extends Component {

  constructor(props) {
    super(props);
    this.state = {
      // dateTime: moment(props.dateTime).format("MMMM, Do, HH, hh, a"),
      dateTime: this.props.dateTime,
      timesDateHasBeenChanged: 0,
    };
  }
  dateChange(event) {
    const timesDateHasBeenChanged = this.state.timesDateHasBeenChanged + 1;
    this.setState({
      dateTime: event._d,
      timesDateHasBeenChanged,
    })
    this.props.updateDate(event._d, timesDateHasBeenChanged);
  }
  render() {

    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <DateTimePicker
          error={this.state.timesDateHasBeenChanged < 1}
          className={classes.DTP}
          autoOk
          value={ new Date(this.state.dateTime) }
          onChange={this.dateChange.bind(this)}
          label="Meeting Date/Time"
          margin="dense"  
          readOnly={this.props.readOnly}
        />
      </div>
    );
  }
}

export default withStyles(styles)(MeetingDateTime);

// import React, { Fragment, useState } from "react";
// import { DateTimePicker } from "@material-ui/pickers";

// function MeetingDateTime(props) {
//   const [selectedDate, handleDateChange] = useState(new Date());

//   return (
//     <Fragment>
//       {/* <DateTimePicker
//         autoOk
//         ampm={false}
//         value={selectedDate}
//         onChange={handleDateChange}
//         label="24h clock"
//       /> */}
//       <DateTimePicker
//         autoOk
//         value={ selectedDate }
//         onChange={handleDateChange}
//         label="Meeting Date/Time"
//       />
//     </Fragment>
//   );
// }

// export default MeetingDateTime;