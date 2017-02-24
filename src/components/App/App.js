import React, { Component } from 'react';
import {Router, Route, Link, IndexRoute, hashHistory, browserHistory} from 'react-router';
import './App.css';

import HomeView from '../HomeView/HomeView';
import SensorView from '../SensorView/SensorView';
import EngineerView from '../EngineerView/EngineerView';
import MDView from '../MDView/MDView';
import NotFound from '../NotFoundView/NotFoundView';

const wellStyles = {maxWidth: 400, margin: '0 auto 10px'};

class App extends Component {
  render() {
    return (
      <div className="App">

          <Router history={hashHistory}>
              <Route path="/" component={HomeView} />
              <Route path="/sensor" component={SensorView} />
              <Route path="/engineer" component={EngineerView} />
              <Route path="/md" component={MDView} />
              <Route path="*" component={NotFound} />
          </Router>

      </div>
    );
  }
}

export default App;
