import React, { Component } from 'react';
import commonData from './shared/commonData';
import { Link } from 'react-router-dom';
import './css/Categories.css';
import utilities from './shared/utilities';

class Categories extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeButton: null,
      firstButtonClick: true
    }
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    this.setState({
      firstButtonClick: false,
      activeButton: e.currentTarget.dataset.id
    })
  }

  render() {
    let { activeButton, firstButtonClick } = this.state;

    return (
      <div>
        <ul className='categories threeByThree'>
        {
          commonData.categories.map((item, index) => {
            let [ firstWord, lastWord ] = item.split(' ');
            let url = '/categories/' + item.replace('\'', '').toLowerCase().split(' ').join('_');
            let categoryImg = utilities.getCategoryImage(firstWord);
            return (
              <li key={index}>
                { this.props.mode === 'button'
                    ? <button
                        data-id={`button-${index}`}
                        onClick={(e) => {
                          this.props.onClick();
                          this.handleClick(e);
                        }}
                        className={
                          activeButton === `button-${index}`
                            ? 'active'
                            : firstButtonClick === false
                              ? 'inactive'
                              : ''
                        }>
                        { categoryImg }
                        <span className='firstWord'>{firstWord}</span>
                        <span>{lastWord}</span>
                      </button>
                    : <Link to={url}>
                        { categoryImg }
                        <span className='firstWord'>{firstWord}</span>
                        <span>{lastWord}</span>
                      </Link>
                }
              </li>
            )
          })
      }
      </ul>
    </div>
    )
  }
}

Categories.defaultProps = {
  mode: 'link'
};

export default Categories;
