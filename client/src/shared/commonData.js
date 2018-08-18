import { css } from "styled-components";

const sizes = {
  desktop: 992,
  tablet: 768,
  phone: 576
};

const commonData = {
  media: Object.keys(sizes).reduce((acc, label) => {
    acc[label] = (...args) => css`
      @media (max-width: ${sizes[label] / 16}em) {
        ${css(...args)};
      }
    `;

    return acc;
  }, {}),
  categories: [
    "Lover's Quarrel",
    "Workplace Squabble",
    "Friend Fight",
    "Roommate Rumble",
    "Family Feud"
  ],
  mainTabs: [
    { id: 1, url: "/", name: "Popular" },
    { id: 2, url: "/categories", name: "Categories" },
    { id: 3, url: "/my-hatchets", name: "My Hatchets" }
  ],
  restrictedTabs: [
    { id: 1, url: "/", name: "Popular" },
    { id: 2, url: "/categories", name: "Categories" }
  ]
};

export default commonData;
