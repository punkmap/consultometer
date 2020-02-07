import React, { Fragment, useState } from "react";
import { DateTimePicker } from "@material-ui/pickers";

function MeetingDateTime(props) {
  const [selectedDate, handleDateChange] = useState(new Date());

  return (
    <Fragment>
      <DateTimePicker
        autoOk
        value={selectedDate}
        onChange={handleDateChange, (event) => {
          console.log('data/time change: ', event._i);
          props.updateDate(event._i);
        }}
        label="Meeting Date/Time"
      />
    </Fragment>
  );
}

export default MeetingDateTime;