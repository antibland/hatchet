import React, { Component } from "react";
import Pagination from "./shared/components/Pagination";
import Loading from "./Loading.js";
import utilities from "./shared/utilities";

class Category extends Component {
  constructor() {
    super();
    this.state = {
      fights: [],
      loading: true,
      message: "",
      firstWord: ""
    };
  }

  componentDidMount() {
    // /api/fights/categories/:category' => fightApi.getFightsByCategory
    let pathname = this.props.pathname
      ? this.props.pathname
      : this.props.location.pathname;

    const lastSegment = pathname.substr(pathname.lastIndexOf("/") + 1);
    this.setState({ firstWord: lastSegment.split("_")[0] });

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
    const CategoryImg = () => {
      return this.props.renderFrom === "listPage"
        ? ""
        : utilities.getCategoryImage(this.state.firstWord);
    };

    const NoFightResults = () => (
      <ul>
        <li className="noResults center">
          <p>It's lonely here. Not a hatchet in sight.</p>
        </li>
      </ul>
    );

    return (
      <div>
        <CategoryImg />
        <div className="paginationContainer">
          {this.state.loading === true ? (
            <Loading />
          ) : this.state.fights.length === 0 ? (
            <NoFightResults />
          ) : (
            <Pagination items={this.state.fights} />
          )}
        </div>
      </div>
    );
  }
}

Category.defaultProps = {
  renderFrom: ""
};

export default Category;
