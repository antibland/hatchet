import styled from "styled-components";

const shared = {
  stepButtons: () => {
    return styled.div`
      display: flex;
      justify-content: center;
      padding-top: 20px;
      & > * {
        padding-top: 0.9em !important;
        padding-bottom: 0.9em !important;
        flex: 1;
        &:first-child {
          margin-right: 10px !important;
        }
        &:last-child {
          margin-left: 10px !important;
        }
      }
    `;
  },

  fieldWrap: () => {
    return styled.div`
      position: relative;
    `;
  },

  submitButton: () => {
    return styled.button`
      display: block;
      margin: 2em auto 0;
    `;
  }
};

export default shared;
