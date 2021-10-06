import styled, { css } from "styled-components";
import { logoColor } from "../../vars";

const ButtonStyles = css`
  background-color: black;
  color: white;
  border: none;

  &:hover {
    background-color: white;
    color: ${logoColor};
    border: 1px solid ${logoColor};
  }
`;

export const Button = styled.button`
  min-width: 165px;
  width: auto;
  height: 50px;
  letter-spacing: 0.5px;
  line-height: 50px;
  padding: 0 35px 0 35px;
  font-size: 15px;
  text-transform: uppercase;
  font-family: "Open Sans";
  font-weight: bolder;
  cursor: pointer;
  overflow: hidden;
  user-select: none;
  margin: 10px 5px;
  ${ButtonStyles}
`;
