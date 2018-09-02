import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./css/Categories.css";
import commonData from "./shared/commonData";
import utilities from "./shared/utilities";

class Categories extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeButton: null,
      firstButtonClick: true,
      categoryImg: null
    };
    this.handleClick = this.handleClick.bind(this);
    this.createCategoryButton = this.createCategoryButton.bind(this);
    this.createCategoryLink = this.createCategoryLink.bind(this);
  }

  handleClick(e) {
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
          this.handleClick(e);
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

  createCategoryLink(item, categoryImg) {
    let [firstWord, lastWord] = item.split(" ");
    let url =
      "/categories/" +
      item
        .replace("'", "")
        .toLowerCase()
        .split(" ")
        .join("_");
    return (
      <Link to={url} title={`${firstWord} ${lastWord}`}>
        {categoryImg}
      </Link>
    );
  }

  render() {
    let classes = `categories ${this.props.view}`;

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
  }
}

Categories.defaultProps = {
  view: "listPage"
};

export default Categories;
