import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { instanceOf } from 'prop-types';
import { useCookies, withCookies, Cookies } from 'react-cookie';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import PublishIcon from '@material-ui/icons/Publish';
import IconButton from '@material-ui/core/IconButton';
import DialogContentText from '@material-ui/core/DialogContentText';
import axios from 'axios';

import store from '../../../store';
import Dialog from '../../atoms/Dialog'
import { config } from '../../../config'

import { loginAction } from '../../../actions';
import { useScrollTrigger } from '@material-ui/core';
const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  authButton: {
    color: 'white',
  },
});
function LoginButton(props) {
    return (
      <Button value={props.value} className={props.classname} onClick={props.onClick}>
        Login
      </Button>
    );
  }
  
  function LogoutButton(props) {
    return (
      <Button value={props.value}  className={props.classname} onClick={props.onClick}>
        Logout
      </Button>
    );
  }
class ButtonAppBar extends Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };
  constructor(props){
    super(props)
    const { cookies } = props;
    this.state = {
        token: null,
        isLoggedIn: false,
        dialogOpen: true,
        username: 'api', 
        password: 'api',
        name: cookies.get('authToken') || ''
    }
    this._isMounted = false;
  }
  handleAuthClick (event) {
    const direction = event.currentTarget.value;
    if (direction === 'login'){
        this.setState({dialogOpen: true});
        this.setState({isLoggedIn: true});
    } else {
        this.setState({isLoggedIn: false});
        this.props.loginAction({loggedIn: false});
        this.logout();
    }
  }
  logout() {
    const headers = {
        'Content-Type': 'application/json',
      }

    axios.delete('http://64.225.122.227:5984/_session', {
        headers: headers,
    })
    .then((response) => {
        console.log('LOGOUT response: ',response)
    })
    .catch((error) => {
        console.error(error);
    })
  }
  Max = (max) => Math.floor(Math.random() * max);
  RandomBetween = (min, max) => Math.random() * (max - min) + min;
  AddDaysToDate = (days) => {
    var date = new Date();
    date.setDate(date.getDate() + days);
    return date;
  }
  RandomDate = () => {
    const rndm = Math.random() < 0.5 ? -1 : 1;
    const rndmDays = this.Max(10) * rndm;
    return this.AddDaysToDate (rndmDays)
  }
  loadTestingData () {
    let attendees = new Array(10).fill(null).map((e, i)=> ({
      "type": "attendee",
      "name": "user"+i,
      "rate": this.Max(1000),
    }))
    //TODO: 
    //bulk load attendees
    //bulk request attendees by returned id list of loaded attendees
    //load attendees into meetings
    let meetings = new Array(10).fill(null).map((e, i)=> ({
      "type": "meeting",
      "title": "test "+1,
      "purpose": "purpose "+i,
      "durationMS": this.Max(3600000),
      "durationAVMS": this.Max(360000),
      "durationHMS": "",
      "dateTime": this.RandomDate(),
      "project": "EAS",
      "attendees": attendees.slice(this.RandomBetween(1,5),this.RandomBetween(6,10)),
      "rate": this.Max(3000),
    }))
    const docs = [...attendees, ...meetings];
    //load meetings array. them make bulk doc button conditional on development
    const headers = {
      'Content-Type': 'application/json',
    }
    const { cookies } = this.props;
    const authToken = cookies.set('authToken');
    axios.put(config.API_URL+'/api/docs_bulk', { docs, authToken }, {
        headers: headers,
    })
    .then((response) => {
      if (response.status === 200) {
          //bulk request meetings by returned id list of loaded meetings
          //calculate durationHMS from durationMS + durationAVMS  
          //calculate durationAVHMS from durationAVMS
          //bulk update meetings with updated durationHMS values
          const token = response.data.token
          //this.setState({token});

          const { cookies } = this.props;
          cookies.set('authToken', token);
          this.props.loginAction({loggedIn: true, token});
      }
    })
    .catch((error) => {
        console.error(error);
    })
  }
  closeDialog(event) {
    if (event.currentTarget.value === 'login'){
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
        }
        const params = new URLSearchParams();
        params.append('name', this.state.username);
        params.append('password', this.state.password);
        axios.post(config.API_URL+'/api/login', params, {
            headers: headers,
        })
        .then((response) => {
            if (response.status === 200) {
                const token = response.data.token;
                
                this.setState({token});
                this.props.loginAction({loggedIn: true, token});
            }
        })
        .catch((error) => {
            console.error(error);
        })
    }
    this.setState({dialogOpen: false});
  }
  render() {
    const { classes } = this.props;
    let authButton;

    if (!this.state.isLoggedIn) {
        authButton = <LoginButton value="login" classname={classes.authButton} onClick={(event) => this.handleAuthClick(event)} />;
    } else {
        authButton = <LogoutButton value="logout" classname={classes.authButton} onClick={(event) => this.handleAuthClick(event)} />;
    }
    let loadBulkDocs;
    if (process.env.NODE_ENV === "development"){
      loadBulkDocs = <IconButton 
          onClick={this.loadTestingData.bind(this)}
        >
          <PublishIcon/>
        </IconButton>
    }
    const dialogTitle = 'login'
    const dialogContent = <form>
            <TextField
                autoFocus
                margin="dense"
                label="username"
                fullWidth
                onChange={(event) => {this.setState({username: event.target.value})}}
                value={this.state.username}
            />
            <TextField
                autoFocus
                margin="dense"
                label="password"
                fullWidth
                type="password"
                onChange={(event) => {this.setState({password: event.target.value})}}
                value={this.state.password}
            />
        </form>
    const dialogActions = <Fragment> 
            <Button value="cancel" onClick={(event) => this.closeDialog(event)} color="primary">
            Cancel
            </Button>
            <Button  value="login" type="submit" disabled={this.state.username==='' || this.state.password===''} onClick={(event) => this.closeDialog(event)} color="primary" autoFocus>
            Login
            </Button>
        </Fragment>
    return (
        <div className={classes.root}>
            <AppBar position="static">
            <Toolbar>
                <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                </IconButton>
                <Typography variant="h6" className={classes.title}>
                    {'consultometer'}
                </Typography>
                {loadBulkDocs}
                {authButton}
            </Toolbar>
            </AppBar>
            <Dialog 
                dialogOpen={this.state.dialogOpen} 
                // closeDialog={this.closeDialog.bind(this)} 
                dialogContent={dialogContent} 
                dialogTitle={dialogTitle}
                dialogActions={dialogActions}
            />
        </div>
    );
  }  
}
export default withCookies(withStyles(styles)(connect(null, { loginAction })(ButtonAppBar)));