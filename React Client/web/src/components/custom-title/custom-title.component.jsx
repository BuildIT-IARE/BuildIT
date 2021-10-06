import React from "react";

import { TitleContainer } from "./custom-title.styles";

const Title = ({ children, ...otherProps }) => (
  <TitleContainer {...otherProps}>{children}</TitleContainer>
);

export default Title;
