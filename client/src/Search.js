import React, { Component } from "react";
import { Link } from "react-router-dom";
import Symbol from "./shared/components/Symbol";
import Avatar from "./shared/components/Avatar";
import styled from "styled-components";

const FlexWrapVertical = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 0;
`;

const SearchResults = styled.div`
  flex: 1;

  &.notEmpty {
    padding-top: 2em;
    padding-bottom: 2em;
    background-color: white;
  }
`;

const SearchResultUsers = styled.div`
  ul {
    display: flex;
    justify-content: center;
    margin-bottom: 2em;
  }

  li a {
    display: flex;
    flex-direction: column;
    text-decoration: none;
    font-weight: bold;

    .username {
      color: var(--teal);
    }
  }
`;

const SearchResultFights = styled.div`
  ul {
    background-color: white;
  }

  li:not(.empty):nth-child(even) {
    background-color: var(--light-teal);
  }

  li.empty {
    display: block;
  }

  a {
    padding: 0.25em 0.5em;
    display: block;
    text-decoration: none;
    color: var(--dark-text);
  }
`;

const LoadingSpinner = styled.div`
  position: absolute;
  top: 19px;
  right: 1em;
  width: 30px;
  height: 30px;
  animation: spinIt 0.5s linear infinite;
  fill: var(--teal);

  svg {
    width: 100%;
    height: 100%;
  }

  @keyframes spinIt {
    to {
      transform: rotate(360deg);
    }
  }
`;

const SearchInput = styled.input`
  font-size: 2rem;
  align-self: center;
  flex: 0;
  width: 100%;
  padding: 0.2em 0.6em;
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
      resultFights: [],
      resultUsers: [],
      a11yText: ""
    };

    this.handleInput = this.handleInput.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.fetchResults = this.fetchResults.bind(this);
    this.highlightTerms = this.highlightTerms.bind(this);
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
          let fightCount = data.fights.length;
          let userCount = data.users.length;
          let a11yText =
            fightCount === 0 && userCount === 0
              ? `Your query, ${q}, yielded no results.`
              : `Hatchets found: ${fightCount}. Users found: ${userCount}`;
          this.setState({
            resultFights: data.fights,
            resultUsers: data.users,
            serverIsBusy: false,
            a11yText
          });
        })
        .catch(err => console.error(err));
    } else {
      this.setState({ resultFights: [], resultUsers: [], a11yText: "" });
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

  highlightTerms(needle, haystack) {
    let ret;
    try {
      ret = haystack.replace(
        new RegExp(needle, "gi"),
        str => `<strong>${str}</strong>`
      );
    } catch (err) {
      return false;
    }
    return ret;
  }

  render() {
    const { resultFights, resultUsers, serverIsBusy, a11yText, q } = this.state;
    const notEmpty = resultUsers.length > 0 || resultFights.length > 0;
    const searchResultUsers = resultUsers.length
      ? resultUsers.map(user => {
          return (
            <li key={user._id}>
              <Link to={`/profile/${user.username}`}>
                <Avatar
                  imgpath={`/svg/avatars/${user.avatar.path}`}
                  width="100px"
                  height="100px"
                />
                <div className="username">{user.username}</div>
              </Link>
            </li>
          );
        })
      : "";

    const searchResultFights = resultFights.length
      ? resultFights.map(fight => {
          return (
            <li key={fight._id}>
              <Link
                to={`/fight/${fight._id}`}
                dangerouslySetInnerHTML={{
                  __html: this.highlightTerms(q, fight.title)
                }}
              />
            </li>
          );
        })
      : "";

    return (
      <FlexWrapVertical>
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
          ariaOwns="searchResultFights searchResultUsers"
          onInput={this.handleInput}
          onKeyUp={this.handleKeyUp}
          placeholder="Search…"
        />
        {serverIsBusy ? (
          <LoadingSpinner>
            <Symbol name="challenger-hatchet-icon" />
          </LoadingSpinner>
        ) : (
          <SearchResults className={notEmpty && "notEmpty"}>
            <SearchResultUsers>
              <ul id="searchResultUsers">{searchResultUsers}</ul>
            </SearchResultUsers>
            <SearchResultFights>
              <ul id="searchResultFights">{searchResultFights}</ul>
            </SearchResultFights>
            <div aria-live="assertive" className="screenReaderText">
              {a11yText}
            </div>
          </SearchResults>
        )}
      </FlexWrapVertical>
    );
  }
}

export default Search;
