import React from 'react';
import commonData from './shared/commonData';
import { Link } from 'react-router-dom';
import './css/Categories.css';
import { auth } from './Auth.js';
import utilities from './shared/utilities';
import JoinOrStartButton from './shared/components/JoinOrStartButton';

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
    <p>
      <JoinOrStartButton loggedIn={auth.hasValidToken()} />
    </p>
  </div>
);

export default Categories;
