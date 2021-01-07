import React, { Component } from 'react';
import Photo from './components/Photo';

class App extends Component {
  state = {
    result: ""
  }

  componentDidMount() {
    this.callApi()
    .then(res => this.setState({result: res}))
    .catch(err => console.log(err));
  }

  callApi = async () => {
    const response = await fetch('api/photo');
    const body = await response.json();
    return body;
  }

  render() {
    return(
      <div>
        <Photo/>
      </div>
    );
  }
}

export default App;
