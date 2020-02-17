import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function AlertDialog(props) {

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
        <DialogTitle id="alert-dialog-title">{"Use Google's location service?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {props.contentText}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => props.closeDialog('cancel')} color="primary">
            Cancel
          </Button>
          <Button onClick={() => props.closeDialog('ok')} color="primary" autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}