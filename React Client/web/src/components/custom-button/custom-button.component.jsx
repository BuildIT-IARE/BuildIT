import React from "react";
import { Button } from "./custom-button.styles";

const CustomButton = ({ children, ...props }) => (
  <Button {...props}>{children}</Button>
);

export default CustomButton;
