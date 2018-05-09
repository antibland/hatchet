import React from 'react';
import HatchetList from './HatchetList';
import PropTypes from 'prop-types';
import '../../css/Pagination.css';

class Pagination extends React.Component {
  constructor() {
    super();
    this.state = {
      currentPage: 1
    };
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    console.log('componentDidMount')
    this.setState({ itemsPerPage: this.props.itemsPerPage });
  }

  handleClick(event) {
    this.setState({ currentPage: Number(event.target.id) } );
  }

  render() {
    const { currentPage, itemsPerPage } = this.state;
    const items = this.props.items;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(items.length / itemsPerPage); i++) {
      pageNumbers.push(i);
    }

    const renderItems = (
      <HatchetList fights={currentItems} />
    );

    const renderPageNumbers = pageNumbers.map(number => {
      return (
        <li key={'page' + (number)}>
          <button
            className={'pageNumberButton' + (number === currentPage ? ' active' : '')}
            id={number}
            onClick={this.handleClick}
          >{number}
          </button>
        </li>
      );
    });


    return (
      <div>
        <ul className='fightList'>
          {renderItems}
        </ul>
        <ul className='pageNumbers'>
          {renderPageNumbers}
        </ul>
      </div>
    );
  }
}

Pagination.propTypes = {
  items: PropTypes.array.isRequired,
  itemsPerPage: PropTypes.number
};

Pagination.defaultProps = {
  itemsPerPage: 6
};

export default Pagination;
