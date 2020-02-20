import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import DialogContentText from '@material-ui/core/DialogContentText';
import axios from 'axios';

import store from '../../../store';
import Dialog from '../../atoms/Dialog'

import { loginAction } from '../../../actions';
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
  constructor(props){
    super(props)
    this.state = {
        isLoggedIn: false,
        dialogOpen: false,
        username: 'api', 
        password: 'api'
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
  closeDialog(event) {
    if (event.currentTarget.value === 'login'){
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
        }
        const params = new URLSearchParams();
        params.append('name', this.state.username);
        params.append('password', this.state.password);
        axios.post('http://localhost:5000/api/login', params, {
            headers: headers,
        })
        .then((response) => {
            if (response.status === 200) {
                const token = response.data.token
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
                    {'Consultometer'}
                </Typography>
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
export default withStyles(styles)(connect(null, { loginAction })(ButtonAppBar));