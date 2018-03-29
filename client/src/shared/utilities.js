import React from 'react';

const utilities = {
  truncate: (str, len=75) => (str.length > len) ? str.substr(0, len-1) + '…' : str,
  getCategoryImage: word => {
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
};

export default utilities;
