import React, { Component } from 'react';
import './App.css';
import { Button } from 'react-bootstrap';
const wellStyles = {maxWidth: 400, margin: '0 auto 10px'};
class App extends Component {


  render() {
    return (
      <div className="App">
          <h2>Welcome to the eHealth mobile technologies meetup</h2>
          <h2>Select your role</h2>
          <ul className="well" style={wellStyles}>
              <Button bsStyle="success" block>Im a sensor</Button>
              <Button bsStyle="success" block>Im a eHealth app enegineer</Button>
              <Button bsStyle="success" block>Im a healthcare proffessional</Button>
          </ul>
      </div>
    );
  }
}

export default App;
