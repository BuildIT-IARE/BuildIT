import styled, { css } from "styled-components";

import { logoColor, gray } from "../../vars";

const ShrinkLabelStyles = css`
  top: -14px;
  font-size: 12px;
  color: ${logoColor};
`;

export const ShrinkLabel = ({ shrink }) => {
  if (shrink) {
    return ShrinkLabelStyles;
  }
};

export const FormInputContainer = styled.input`
  background: none;
  background-color: white;
  color: ${gray};
  font-size: 18px;
  padding: 10px 10px 10px 5px;
  display: block;
  width: 100%;
  border: none;
  border-radius: 0;
  border-bottom: 1px solid ${logoColor};
  margin: 25px 0;

  &:focus {
    outline: none;
  }

  &:focus ~ .form-input-label {
    ${ShrinkLabelStyles}
  }
  select {
    -webkit-appearance: none;
    -moz-appearance: none;
    text-indent: 1px;
    text-overflow: "";
  }
`;

export const GroupContainer = styled.div`
  position: relative;
  margin: 20px 0;
  input[type="password"] {
    letter-spacing: 0.3em;
  }
`;

export const FormInputLabel = styled.label`
  color: ${gray};
  font-size: 16px;
  font-weight: normal;
  position: absolute;
  pointer-events: none;
  left: 5px;
  top: 10px;
  transition: 300ms ease all;
  ${ShrinkLabel}

  option {
    background-color: white;
    font-family: "Open Sans";
  }
`;
