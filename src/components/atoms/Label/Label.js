import React, { Component } from 'react';

import store from '../../../store'
import watch from 'redux-watch';
export default class Label extends Component {
  constructor(props){
    super(props)
    this.state = {
      clickCount: 0
    }
    const clickCountWatch = watch(store.getState, 'click.clickCount')
    store.subscribe(clickCountWatch((newVal, oldVal, objectPath) => {
        const clickCount = store.getState().click.clickCount;
        this.setState({
            clickCount
        })
    }))
  }
  render() {
    return (
      <div className="Label">
        You clicked it this many times: {this.state.clickCount}
      </div>
    )
  }
}
