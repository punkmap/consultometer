import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function ADialog(props) {

  // const handleClickOpen = () => {
  //   setOpen(true);
  // };

  const handleClose = () => {
    
  };

  return (
    <div>
      <Dialog
        open={props.dialogOpen}
        onClose={props.closeDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{props.dialogTitle}</DialogTitle>
        <DialogContent>
          {props.dialogContent}
        </DialogContent>
        <DialogActions>
          {props.dialogActions}
        </DialogActions>
      </Dialog>
    </div>
  );
}