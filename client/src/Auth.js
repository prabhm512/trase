/* eslint-disable import/no-anonymous-default-export */
import React, { Component } from 'react';
import Landing from './pages/Landing/Landing.js';

export default function(ComposedComponent) {
  class Authentication extends Component {
    render() {
        if (localStorage.getItem('usertoken')) {
            return <ComposedComponent {...this.props} />

        } else {
            return <Landing />
        }
    }
  }

  return Authentication;
}