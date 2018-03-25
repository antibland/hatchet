import React from 'react';
import commonData from './shared/commonData';
import { Link } from 'react-router-dom';
import './css/Categories.css';

const Categories = () => (
  <div>
    <ul className='categories threeByThree'>
      {
        commonData.categories.map((item, index) => {
          let [ firstWord, lastWord ] = item.split(' ');
          let url = '/categories/' + item.replace('\'', '').toLowerCase().split(' ').join('_');

          return (
            <li key={index}>
              <Link to={url}>
                <img alt='placeholder' src='https://via.placeholder.com/150x150' />
                <span className='firstWord'>{firstWord}</span>
                <span>{lastWord}</span>
              </Link>
            </li>
          )
        })
      }
    </ul>
    <Link className='button' to='/create'>Start Fight</Link>
  </div>
);

export default Categories;
