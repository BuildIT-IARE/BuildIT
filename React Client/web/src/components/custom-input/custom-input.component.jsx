import React from "react";

import {
  GroupContainer,
  FormInputContainer,
  FormInputLabel,
} from "./custom-input.styles";

const CustomInput = ({ label, handleChange, ...otherProps }) => (
  <GroupContainer>
    <FormInputContainer onChange={handleChange} {...otherProps} />
    {label ? (
      <FormInputLabel
        shrink={otherProps.value.length}
        className="form-input-label"
      >
        {label}
      </FormInputLabel>
    ) : null}
  </GroupContainer>
);

export default CustomInput;
