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
      firstButtonClick: true
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    this.setState({
      firstButtonClick: false,
      activeButton: e.currentTarget.dataset.id
    });
  }

  render() {
    let { activeButton, firstButtonClick } = this.state;

    return (
      <div>
        <ul className="categories">
          {commonData.categories.map((item, index) => {
            let [firstWord, lastWord] = item.split(" ");
            let url =
              "/categories/" +
              item
                .replace("'", "")
                .toLowerCase()
                .split(" ")
                .join("_");
            let categoryImg = utilities.getCategoryImage(firstWord);
            return (
              <li key={index}>
                {this.props.mode === "button" ? (
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
                ) : (
                  <Link to={url} title={`${firstWord} ${lastWord}`}>
                    {categoryImg}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

Categories.defaultProps = {
  mode: "link"
};

export default Categories;
