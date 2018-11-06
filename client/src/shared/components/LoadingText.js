import React from "react";
import styled from "styled-components";

const Dot = styled.em`
  @keyframes blink {
    0% {
      opacity: 0.2;
    }
    20% {
      opacity: 1;
    }
    100% {
      opacity: 0.2;
    }
  }

  animation-name: blink;
  animation-duration: 1.4s;
  animation-iteration-count: infinite;
  animation-fill-mode: both;

  &.dotTwo {
    animation-delay: 0.2s;
  }

  &.dotThree {
    animation-delay: 0.4s;
  }
`;

const LoadingText = props => {
  let text =
    props.isDisabled === true ? (
      <>
        Loading
        <Dot className="dotOne">.</Dot>
        <Dot className="dotTwo">.</Dot>
        <Dot className="dotThree">.</Dot>
      </>
    ) : (
      props.children
    );
  return <span className="buttonWithAnimatedLoading">{text}</span>;
};

export default LoadingText;
