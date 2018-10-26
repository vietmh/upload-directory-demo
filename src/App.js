import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ZippingUploader from './ZippingUploader';

class App extends Component {

  constructor() {
    super();
  }

  componentDidMount() {
  }

  render() {

    return (
      <div className="App">
        <header>
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        <ZippingUploader url="localhost:9292/v1/samples/upload"/>
      </div>
    );
  }
}

export default App;
