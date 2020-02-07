import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";


import { setWorkflow } from '../../../actions';


// const useStyles = makeStyles(theme => ({
//   root: {
//     flexGrow: 1,
//   },
//   paper: {
//     height: 140,
//     width: 100,
//   },
//   control: {
//     padding: theme.spacing(2),
//   },
// }));
// const [spacing, setSpacing] = React.useState(2);
//     const classes = useStyles();

//     const handleChange = event => {
//       setSpacing(Number(event.target.value));
//     };
    
class WorkflowAdd extends Component {
  constructor(props){
    super(props)
    this.state = {
      
    }

    
  }

  nextPath(path) {
    this.props.history.push(path);
  }
  save() {
    // validate form
    // save meeting 
    //return to main
    this.props.setWorkflow('mainPage');
    this.nextPath('/');
  }
  render() {
    return (
      <div >
        <Grid container
          direction="column"
          justify="center"
          alignItems="center"
          style={{ minHeight: '100vh' }}>
          <Typography variant="h4" gutterBottom>
            Analysis page here
          </Typography>
          
          <Button variant="contained" color="primary" onClick={this.save.bind(this)}>
            close
          </Button>
        </Grid>
      </div>
    )
  }
}

export default withRouter(connect(null, { setWorkflow })(WorkflowAdd));