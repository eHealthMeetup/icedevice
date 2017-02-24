import React, { Component } from 'react';
import {Router, Route, Link, IndexRoute, hashHistory, browserHistory} from 'react-router';
import './App.css';

import Container from '../Container/Container';
import HomeView from '../HomeView/HomeView';
import SensorView from '../SensorView/SensorView';
import EngineerView from '../EngineerView/EngineerView';
import MDView from '../MDView/MDView';
import NotFound from '../NotFoundView/NotFoundView';

class App extends Component {
  render() {
    return (
      <div className="App">
          <Router history={hashHistory}>
            <Route path="/" component={Container}>
              <IndexRoute component={HomeView}/>
              <Route path="sensor" component={SensorView} />
              <Route path="engineer" component={EngineerView} />
              <Route path="md" component={MDView} />
              <Route path="*" component={NotFound} />
            </Route>
          </Router>

      </div>
    );
  }
}

export default App;
