import React from "react";

import { CardContainer } from "./card.styles";

const Card = ({ handleClick, children, ...otherProps }) => (
  <CardContainer onClick={handleClick} {...otherProps}>
    {children}
  </CardContainer>
);

export default Card;
