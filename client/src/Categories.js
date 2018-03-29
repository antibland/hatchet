import React from 'react';
import commonData from './shared/commonData';
import { Link } from 'react-router-dom';
import './css/Categories.css';
import ButtonLink from './shared/components/ButtonLink';
import { auth } from './Auth.js';

function getImg(word) {
  let prefix = '/categories/category-';
  let img = '';
  let w = word.replace('\'', '').toLowerCase();

  switch (w) {
    case 'lovers':
      img = <img
              className='categoriesImg'
              src={`${prefix}lover.png`}
              srcSet={`${prefix}lover.png 1x, ${prefix}lover@2x.png 2x`}
              alt="Lover's Quarrel"
            />
      break;
    case 'workplace':
      img = <img
               className='categoriesImg'
              src={`${prefix}coworker.png`}
              srcSet={`${prefix}coworker.png 1x, ${prefix}coworker@2x.png 2x`}
              alt="Workplace Squabble"
            />
      break;
    case 'friend':
      img = <img
              className='categoriesImg'
              src={`${prefix}friend.png`}
              srcSet={`${prefix}friend.png 1x, ${prefix}friend@2x.png 2x`}
              alt="Friend Fight"
            />
      break;
    case 'roommate':
      img = <img
              className='categoriesImg'
              src={`${prefix}roommate.png`}
              srcSet={`${prefix}roommate.png 1x, ${prefix}roommate@2x.png 2x`}
              alt="Roommate Rumble"
            />
      break;
    case 'family':
      img = <img
              className='categoriesImg'
              src={`${prefix}family.png`}
              srcSet={`${prefix}family.png 1x, ${prefix}family@2x.png 2x`}
              alt="Family Feud"
            />
      break;
    case 'world':
      img = <img
              className='categoriesImg'
              src={`${prefix}everyone.png`}
              alt="World War"
            />
      break;
    default:
      img = <img
              className='categoriesImg'
              src={`${prefix}everyone.png`}
              alt="World War"
            />
      break;
  }
  return img;
}

const Categories = () => (
  <div>
    <ul className='categories threeByThree'>
      {
        commonData.categories.map((item, index) => {
          let [ firstWord, lastWord ] = item.split(' ');
          let url = '/categories/' + item.replace('\'', '').toLowerCase().split(' ').join('_');
          let categoryImg = getImg(firstWord);
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
