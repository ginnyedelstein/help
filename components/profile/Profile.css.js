import styled, { css } from "styled-components";

export const Wrapper = styled.div`
  padding: 40px;
  min-height: 500px;
`;
export const Data = styled.div`
  color: blue;
`;

export const Stars = styled.div`
  padding: 40px;
  min-height: 500px;
`;

export const Star = styled.div`
  position: relative;

  display: inline-block;
  width: 0;
  height: 0;

  margin-left: 0.9em;
  margin-right: 0.9em;
  margin-bottom: 1.2em;

  border-right: 0.3em solid transparent;
  border-bottom: 0.7em solid #fc0;
  border-left: 0.3em solid transparent;

  /* Controlls the size of the stars. */
  font-size: 24px;

  &:before,
  &:after {
    content: "";

    display: block;
    width: 0;
    height: 0;

    position: absolute;
    top: 0.6em;
    left: -1em;

    border-right: 1em solid transparent;
    border-bottom: 0.7em solid #fc0;
    border-left: 1em solid transparent;

    transform: rotate(-35deg);
  }

  &:after {
    transform: rotate(35deg);
  }
`;
