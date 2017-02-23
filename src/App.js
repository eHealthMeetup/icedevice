import React, { Component } from 'react';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
          <h2>Welcome to the eHealth mobile technologies meetup</h2>
          <h2>Select your role</h2>
          <ul>
              <li><button className="btn btn-md">Im a sensor</button></li>
              <li><button className="btn btn-md">Im a eHealth app enegineer</button></li>
              <li><button className="btn btn-md">Im a healthcare proffessional</button></li>
          </ul>
      </div>
    );
  }
}

export default App;
