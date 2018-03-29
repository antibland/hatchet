import React from 'react';
import commonData from './shared/commonData';
import { Link } from 'react-router-dom';
import './css/Categories.css';
import ButtonLink from './shared/components/ButtonLink';
import { auth } from './Auth.js';
import utilities from './shared/utilities';

const Categories = () => (
  <div>
    <ul className='categories threeByThree'>
      {
        commonData.categories.map((item, index) => {
          let [ firstWord, lastWord ] = item.split(' ');
          let url = '/categories/' + item.replace('\'', '').toLowerCase().split(' ').join('_');
          let categoryImg = utilities.getCategoryImage(firstWord);
          return (
            <li key={index}>
              <Link to={url}>
                { categoryImg }
                <span className='firstWord'>{firstWord}</span>
                <span>{lastWord}</span>
              </Link>
            </li>
          )
        })
      }
    </ul>
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

export default Categories;
