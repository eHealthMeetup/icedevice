import React, { Component } from 'react';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
          <h2>Welcome to the eHealth mobile technologies meetup</h2>
          <h2>Select your role</h2>
          <ul>
              <li><button class="btn btn-md">I'm a sensor</button></li>
              <li><button class="btn btn-md">I'm a eHealth app enegineer</button></li>
              <li><button class="btn btn-md">I'm a healthcare proffessional</button></li>
          </ul>
      </div>
    );
  }
}

export default App;
