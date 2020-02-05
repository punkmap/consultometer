import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Button from '@material-ui/core/Button';

import { increment, defaultFunction } from './actions';

import Label from './components/atoms/Label';
// function incrementCount() {
//   console.log("increment");
//   this.props.increment(this.count)
// }
class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      clickCount: 0
    }
  }
  componentDidMount() {
    // call default function to display redux operation
    this.props.defaultFunction();
    // this.props.setConfig(config);// .setConfig(config);
  }
  incrementCount() {
    this.setState((state, props) => ({clickCount: state.clickCount + 1}), () => {
      this.props.increment(this.state.clickCount);
    } )
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <Button variant="contained" color="primary" onClick={this.incrementCount.bind(this)}>
            Click me
          </Button>
          <Label></Label>
        </header>
      </div>
    );
  }
}

App.propTypes = {
  increment: PropTypes.func.isRequired
};

export default connect(null, { increment, defaultFunction })(App);
