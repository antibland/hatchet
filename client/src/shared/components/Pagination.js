import PropTypes from 'prop-types';
import React from 'react';
import '../../css/Pagination.css';
import HatchetList from './HatchetList';

class Pagination extends React.Component {
  static numbersCutoff = 5;
  constructor() {
    super();
    this.state = {
      currentPage: 1
    };
    this.handleClick = this.handleClick.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.previousPage = this.previousPage.bind(this);
  }

  componentDidMount() {
    this.setState({ itemsPerPage: this.props.itemsPerPage });
  }

  handleClick(event) {
    this.setState({ currentPage: Number(event.target.id) });
  }

  nextPage(event) {
    event.preventDefault();
    this.setState({ currentPage: this.state.currentPage + 1 });
  }

  previousPage(event) {
    event.preventDefault();
    this.setState({ currentPage: this.state.currentPage - 1 });
  }

  render() {
    const { currentPage, itemsPerPage } = this.state;

    const items = this.props.items;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

    const pageNumbers = [];
    const lastPage = Math.ceil(items.length / itemsPerPage);
    let numbersStart = 1;
    let numbersEnd = lastPage < Pagination.numbersCutoff
          ? lastPage
          : Pagination.numbersCutoff;

    if (currentPage > Pagination.numbersCutoff) {
      let difference = currentPage - Pagination.numbersCutoff;
      numbersStart += difference;
      numbersEnd += difference;
    }

    for (let i = numbersStart; i <= numbersEnd; i++) {
      pageNumbers.push(i);
    }

    const renderItems = (
      <HatchetList fights={currentItems} />
    );

    const Previous = () => (
      <li className='pageNumberNav buttonPrevious'>
        <button
          onClick={this.previousPage}
          disabled={currentPage === 1}>
          <svg aria-hidden="true" className="chevron-left">
            <use xlinkHref="./symbols/svg-defs.svg#chevron-left" />
          </svg>Prev
        </button>
      </li>
    );

    const Next = () => (
      <li className='pageNumberNav buttonNext'>
        <button
          onClick={this.nextPage}
          disabled={currentPage === lastPage}>Next
          <svg aria-hidden="true" className="chevron-right">
            <use xlinkHref="./symbols/svg-defs.svg#chevron-right" />
          </svg>
        </button>
      </li>
    );

    const renderPageNumbers = pageNumbers.map(number => {
      return (
        <li key={'page' + (number)} className='pageNumberListItem'>
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
      <React.Fragment>
        <ul className='fightList'>
          {renderItems}
        </ul>
        <ul className='pageNumbers'>
          <Previous />
          {renderPageNumbers}
          <Next />
        </ul>
      </React.Fragment>
    );
  }
}

Pagination.propTypes = {
  items: PropTypes.array.isRequired,
  itemsPerPage: PropTypes.number
};

Pagination.defaultProps = {
  itemsPerPage: 5
};

export default Pagination;
