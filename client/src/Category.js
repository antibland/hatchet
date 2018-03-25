import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { auth } from './Auth.js';

const SomeComponent = withRouter(props => <Category {...props}/>);

class Category extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {pathname} = this.props.location;

    return (
      <div>
        <div style={{ color: 'white' }}>{pathname}</div>
        <Link className='button' to='/create'>Start Fight</Link>
      </div>
    );
  }
}

export default Category;
