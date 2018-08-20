import React, { Component } from "react";
import Pagination from "./shared/components/Pagination";
import Loading from "./Loading.js";

class Category extends Component {
  constructor() {
    super();
    this.state = {
      fights: [],
      loading: true,
      message: ""
    };
  }

  componentDidMount() {
    // /api/fights/categories/:category' => fightApi.getFightsByCategory
    const { pathname } = this.props.location;

    fetch(`/api/fights${pathname}`)
      .then(res => res.json())
      .then(data => {
        this.setState({
          fights: data.fights,
          loading: false,
          message: data.message
        });
      });
  }

  render() {
    const NoFightResults = () => (
      <ul>
        <li className="noResults center">
          <p>It's lonely here. Not a hatchet in sight.</p>
        </li>
      </ul>
    );

    return (
      <div className="paginationContainer">
        {this.state.loading === true ? (
          <Loading />
        ) : this.state.fights.length === 0 ? (
          <NoFightResults />
        ) : (
          <Pagination items={this.state.fights} />
        )}
      </div>
    );
  }
}

export default Category;
