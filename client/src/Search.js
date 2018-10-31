import React, { Component } from "react";
import { Link } from "react-router-dom";
import Symbol from "./shared/components/Symbol";
import styled from "styled-components";

const SearchResults = styled.ul`
  li:not(.empty):nth-child(odd) {
    background-color: var(--light-teal);
  }

  li.empty {
    padding: 0.5em;
  }

  a {
    padding: 0.5em;
    text-decoration: none;
    color: var(--dark-text);
  }
`;

const LoadingSpinner = styled.div`
  position: absolute;
  top: 34px;
  right: 1em;
  width: 30px;
  height: 30px;
  animation: spinIt 0.3s linear infinite;

  svg {
    width: 100%;
    height: 100%;
  }

  @keyframes spinIt {
    to {
      transform: rotate(-360deg);
    }
  }
`;

const SearchInput = styled.input`
  font-size: 2rem;
  align-self: center;
  flex: 0;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  text-align: center;
  border: none !important;
  border-bottom: 1px solid rgba(57, 160, 207, 0.1) !important;

  &:focus {
    border: none !important;
    border-bottom: 1px solid rgba(57, 160, 207, 0.1) !important;
  }
`;

export class Search extends Component {
  static timeout = null;
  static timeoutInterval = 300;

  constructor(props) {
    super(props);
    this.state = {
      q: "",
      serverIsBusy: false,
      results: [],
      a11yText: ""
    };

    this.handleInput = this.handleInput.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.fetchResults = this.fetchResults.bind(this);
  }

  fetchResults() {
    const { q } = this.state;
    if (q.length > 2) {
      this.setState({ serverIsBusy: true });
      fetch("/api/search", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          query: q
        })
      })
        .then(res => {
          return res.ok
            ? Promise.resolve(res.json())
            : Promise.reject({
                status: res.status,
                statusText: res.statusText
              });
        })
        .then(data => {
          let count = data.fights.length;
          let a11yText =
            count === 0
              ? "Your search yielded no results."
              : `Results returned: ${count}`;
          this.setState({
            results: data.fights,
            serverIsBusy: false,
            a11yText
          });
        })
        .catch(err => console.error(err));
    } else {
      this.setState({ results: [], a11yText: "" });
    }
  }

  handleKeyUp() {
    clearTimeout(Search.timeout);
    Search.timeout = setTimeout(this.fetchResults, Search.timeoutInterval);
  }

  handleInput(e) {
    this.setState({ q: e.target.value });
    clearTimeout(Search.timeout);
  }

  render() {
    const { results, serverIsBusy, a11yText } = this.state;

    const searchResults = results.length ? (
      results.map(fight => {
        return (
          <li key={fight._id}>
            <Link to={`/fight/${fight._id}`}>{fight.title}</Link>
          </li>
        );
      })
    ) : (
      <li class="empty">Nothing right now.</li>
    );

    return (
      <div>
        <SearchInput
          type="text"
          aria-label="Search…"
          name="q"
          id="q"
          autoFocus
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          ariaOwns="searchResults"
          onInput={this.handleInput}
          onKeyUp={this.handleKeyUp}
          placeholder="Search…"
        />
        {serverIsBusy ? (
          <LoadingSpinner>
            <Symbol name="tilted-ax" />
          </LoadingSpinner>
        ) : (
          <>
            <SearchResults id="searchResults">{searchResults}</SearchResults>
            <div aria-live="assertive" className="screenReaderText">
              {a11yText}
            </div>
          </>
        )}
      </div>
    );
  }
}

export default Search;
