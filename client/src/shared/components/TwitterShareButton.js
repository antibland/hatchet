import React from "react";
import ShareLink from "react-twitter-share-link";
import Symbol from "./Symbol";

export default function TwitterShareButton() {
  return (
    <ShareLink text="Please help bury this hatchet">
      {link => (
        <a href={link} target="_blank" rel="noopener noreferrer">
          <Symbol name="twitter-share-icon" />
        </a>
      )}
    </ShareLink>
  );
}
