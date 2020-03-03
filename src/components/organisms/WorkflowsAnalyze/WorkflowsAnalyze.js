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
import MeetingsListAll from '../../molecules/MeetingsListAll'

    
class WorkflowAdd extends Component {
  constructor(props){
    super(props)
    this.state = {
      
    }

    
  }

  close() {
    this.props.setWorkflow('mainPage');
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
            <MeetingsListAll/>
          </Typography>
          
          <Button variant="contained" color="primary" onClick={this.close.bind(this)}>
            close
          </Button>
        </Grid>
      </div>
    )
  }
}

export default connect(null, { setWorkflow })(WorkflowAdd);