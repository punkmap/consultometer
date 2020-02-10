import React, { Component, Fragment } from 'react';
import { DateTimePicker } from "@material-ui/pickers";
import moment from 'moment';

class MeetingDateTime extends Component {

  constructor(props) {
    super(props);
    this.state = {
      // dateTime: moment(props.dateTime).format("MMMM, Do, HH, hh, a"),
      dateTime: this.props.dateTime,
    };
  }
  dateChange(event) {
    this.props.updateDate(event._d);
  }
  render() {
    return (
      <Fragment>
       {/* <DateTimePicker
         autoOk
         ampm={false}
         value={selectedDate}
         onChange={handleDateChange}
         label="24h clock"
       /> */}
       <DateTimePicker
         autoOk
         value={ new Date(this.state.dateTime) }
         onChange={this.dateChange.bind(this)}
         label="Meeting Date/Time"
       />
     </Fragment>
    );
  }
}

export default MeetingDateTime;

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