import React, { Component } from 'react';

class Home extends Component {
  componentDidMount() {
    var url = '/api/show/fights';
    //var url = '/api/test';

    fetch(url)
      .then(res => res.json())
      .then(data => console.log(data));

    // fetch(url)
    // .then(function(response) {
    //   console.log('success', response)
    // })
    // .catch(function(error) {
    //   console.log('error', error)
    // });
  }

  render() {
    return (
      <div>
        <h1>Hey</h1>
      </div>
    );
  }
}

export default Home;
