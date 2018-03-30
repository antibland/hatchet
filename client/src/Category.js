import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { auth } from './Auth.js';
import ButtonLink from './shared/components/ButtonLink';

class Category extends Component {
  componentDidMount() {
    // /api/fights/categories/:category' => fightApi.getFightsByCategory
    const {pathname} = this.props.location;

    fetch(`/api/fights${pathname}`)
      .then(res => res.json())
      .then(data => {
        console.log(data);
      });
  }

  render() {
    return (
      <div>
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
