import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { instanceOf } from 'prop-types';
import { useCookies, withCookies, Cookies } from 'react-cookie';
//import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import Grid from '@material-ui/core/Grid';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import { updateMeeting, msTime } from '../../../util'

import { connect } from 'react-redux';
import { withRouter, useHistory } from "react-router-dom";
import axios from 'axios';

import blue from '@material-ui/core/colors/blue';
import green from '@material-ui/core/colors/green';


import { setWorkflow, futureMeetings } from '../../../actions';
import { config } from '../../../config'
//const history = useHistory();
const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  buttonBar: {
    margin: "1rem"
  },
  actionGrid: {
    padding: theme.spacing(2),
    textAlign: 'center',
  },
  timer: {
    color: blue[700],
  },
  cost: {
    color: green[700],
  },
});
class WorkflowDetail extends Component {
  constructor(props){
    super(props);
    const { cookies } = props;
    this.state = {
      detailType: props.detailType,
      detailId: props.detailId,
      authToken: cookies.get('authToken'),
      detailItem: null
    }
    this._isMounted = false;
  }
  cancel() {
    this.props.setWorkflow('mainPage');
    this.props.history.push('/');
  }
  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };
  
  componentDidMount() {
    this._isMounted = true;
    if (this.state.detailType === 'meeting' && this.state.detailId ){
      this.getMeeting(this.state.detailId, this.state.authToken)
    }
  }
  async getMeeting (meetingId, token) {
    const url = config.API_URL+'/api/meeting/' + meetingId;
    const params = {token};
    const response = await axios.get(url, {
      params
    })
    if (this._isMounted) {
      const detailItem = response.data.meeting;
      this.setState({detailItem});
    }
  }
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>  
        <Grid 
          container
          direction="column"
          justify="center"
          alignItems="center"
          style={{ minHeight: '100vh' }}>
          <Grid item xs={6} md={6} lg={6}>
          <Typography variant="h4" gutterBottom>{this.state.detailItem && this.state.detailItem.title}</Typography>
          <Typography variant="h5" gutterBottom>{this.state.detailItem && this.state.detailItem.purpose}</Typography>
          {this.state.detailItem && this.state.detailItem.attendees.map(data => {
            let icon;

            return (
              <Chip
                key={data.key}
                icon={icon}
                label={data.value.name}
                className={classes.chip}
              />
            );
          })}
          <Grid item >
              <Typography variant="body2">{this.state.detailItem && this.state.detailItem.title}</Typography>
              <Typography variant="body2" color="textSecondary">{this.state.detailItem && this.state.detailItem.purpose}</Typography>
              <Grid container direction="row" justify="space-between">
                <Grid item >
                    <Typography variant="body2">Total</Typography>
                    <Typography variant="body2" className={classes.timer}> {this.state.detailItem && msTime.msToHMS(this.state.detailItem.durationMS)}</Typography>
                    <Typography variant="body2" className={classes.cost}>${this.state.detailItem && msTime.msToCost(this.state.detailItem.rate, this.state.detailItem.durationMS)}</Typography>
                </Grid>
                <Grid item >
                    <Typography variant="body2">A/V</Typography>
                    <Typography variant="body2" className={classes.timer}> {this.state.detailItem && msTime.msToHMS(this.state.detailItem.durationAVMS)}</Typography>
                    <Typography variant="body2" className={classes.cost}>${this.state.detailItem && msTime.msToCost(this.state.detailItem.rate, this.state.detailItem.durationAVMS)}</Typography>
                </Grid>
              </Grid>
          </Grid>
            <Grid container className={classes.buttonBar}>
              <Grid item className={classes.actionGrid}>
                <Button variant="contained" color="primary" onClick={this.cancel.bind(this)}>
                  close
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    )
  }
}
WorkflowDetail.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRouter(withCookies(withStyles(styles)(connect(null, { setWorkflow, futureMeetings })(WorkflowDetail))));
