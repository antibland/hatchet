import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import utilities from "../utilities";

const GifWrapper = styled.figure`
  position: relative;
  margin: 0;
  display: inline-block;

  video {
    max-width: 100%;
  }
`;

const GifCaption = styled.figcaption`
  position: absolute;
  bottom: 0;
  transform: translateX(-50%);
  left: 50%;
  font-size: 1.2em;
  width: 100%;
  padding: 0.7em 2em 1em;
  background-color: rgba(255, 255, 255, 0.8);
  color: black;

  ${utilities.media.phone`
    transform: none;
    position: static;
    padding: 0;
  `};
`;

const Gif = props => (
  <GifWrapper>
    <video autoPlay loop muted>
      <source src={props.src} type="video/mp4" />
      <source src="movie.ogg" type="video/ogg" />
    </video>
    <GifCaption>{props.caption}</GifCaption>
  </GifWrapper>
);

Gif.propTypes = {
  src: PropTypes.string.isRequired,
  caption: PropTypes.string.isRequired
};

export default Gif;
