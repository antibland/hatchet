import React, { Component } from 'react';
import { NavLink, Link } from 'react-router-dom';

class MainTabs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTabId: 1
    };
  }

  setActiveTab(selectedTabId) {
    this.setState({ selectedTabId });
  }

  render() {
    let tabs = this.props.data.map((el, index) => {
          return <Tab
            key={index}
            content={el.name}
            url={el.url}
            onActiveTab={ this.setActiveTab.bind(this, el.id) }
          />
        });

    return (
      <ul className='navTabs'>
        { tabs }
      </ul>
    );
  }
};

const isActive = (match, location) => {
  if (!match) {
    return false;
  } else if (match.path === location.pathname && match.isExact === true) {
    return true;
  }
  return false;
};

const Tab = props => (
  <li
    onClick={props.onActiveTab}>
    <NavLink isActive={isActive} to={props.url} className='navTabsItem'>
      { props.content }
    </NavLink>
  </li>
);

export default MainTabs;
