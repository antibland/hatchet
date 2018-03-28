import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { auth } from './Auth.js';
import ButtonLink from './shared/components/ButtonLink';

const SomeComponent = withRouter(props => <Category {...props}/>);

class Category extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    // /api/fights/categories/:category' => fightApi.getFightsByCategory
    const {pathname} = this.props.location;
    fetch(`api/fights/categories/${pathname}`)
      .then(res => res.json())
      .then(data => {
        console.log(data);
      });
  }

  render() {
    const {pathname} = this.props.location;

    return (
      <div>
        <div style={{ color: 'white' }}>{pathname}</div>
        { auth.hasValidToken()
            ? <ButtonLink
                to='/create'
                classList='button primary'>
                Start Fight
              </ButtonLink>
            : <ButtonLink
                to='/join'
                classList='button primary'>
                Join Us
              </ButtonLink>
        }
      </div>
    );
  }
}

export default Category;
