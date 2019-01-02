import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ZippingUploader from './lib/ZippingUploader';

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
        <section style={{ height: '100px'}}>
          <ZippingUploader {...{
            url: "localhost:9292/v1/samples/upload",
            headers: {
              user: 1
            }
          }} />
        </section>
      </div>
    );
  }
}

export default App;
