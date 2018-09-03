import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./css/Categories.css";
import commonData from "./shared/commonData";
import utilities from "./shared/utilities";
import Category from "./Category";

class Categories extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeButton: null,
      firstButtonClick: true,
      categoryImg: null,
      activeLink: commonData.categories[0],
      filteredItem: ""
    };
    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.createCategoryButton = this.createCategoryButton.bind(this);
    this.createCategoryLink = this.createCategoryLink.bind(this);
    this.filterItem = this.filterItem.bind(this);
  }

  componentDidMount() {
    this.setState({
      filteredItem: this.filterItem(this.state.activeLink)
    });
  }

  handleButtonClick(e) {
    e.preventDefault();
    this.setState({
      firstButtonClick: false,
      activeButton: e.currentTarget.dataset.id
    });
  }

  createCategoryButton(index, categoryImg) {
    let { activeButton, firstButtonClick } = this.state;
    return (
      <button
        data-id={`button-${index}`}
        onClick={e => {
          this.props.onClick(e.currentTarget.firstChild.alt);
          this.handleButtonClick(e);
        }}
        className={
          activeButton === `button-${index}`
            ? "active"
            : firstButtonClick === false
              ? "inactive"
              : ""
        }
      >
        {categoryImg}
      </button>
    );
  }

  filterItem(item) {
    return item
      .replace("'", "")
      .toLowerCase()
      .split(" ")
      .join("_");
  }

  createCategoryLink(item, categoryImg) {
    let [firstWord, lastWord] = item.split(" ");
    let url = `/categories/${this.filterItem(item)}`;

    return (
      <Link
        to={url}
        title={`${firstWord} ${lastWord}`}
        onClick={e => {
          e.preventDefault();
          this.setState({
            filteredItem: this.filterItem(item)
          });
        }}
      >
        {categoryImg}
      </Link>
    );
  }

  render() {
    let classes = `categories ${this.props.view}`;
    let { filteredItem } = this.state;

    const RenderCategory = () => {
      return (
        <Category
          renderFrom={this.props.view}
          pathname={`/categories/${filteredItem}`}
        />
      );
    };

    const Results = () => {
      return this.props.view === "listPage" && filteredItem.length > 0 ? (
        <div className="results">
          <RenderCategory />
        </div>
      ) : (
        ""
      );
    };

    const RenderCategories = () => {
      return (
        <ul className={classes}>
          {commonData.categories.map((item, index) => {
            let categoryImg = utilities.getCategoryImage(item.split(" ")[0]);
            return (
              <li key={index}>
                {this.props.view === "stepsPage"
                  ? this.createCategoryButton(index, categoryImg)
                  : this.createCategoryLink(item, categoryImg)}
              </li>
            );
          })}
        </ul>
      );
    };

    return (
      <React.Fragment>
        <RenderCategories />
        <Results />
      </React.Fragment>
    );
  }
}

Categories.defaultProps = {
  view: "listPage"
};

export default Categories;
