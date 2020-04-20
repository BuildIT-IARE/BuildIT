import React from "react";

import {
  TopNavbar,
  NavbarContainer,
  LogoContainer,
  OptionsContainer,
  OptionItem,
} from "./navbar.styles";

const Navbar = () => (
  <TopNavbar>
    <NavbarContainer>
      <LogoContainer to="/">BuildIT_</LogoContainer>
      <OptionsContainer>
        <OptionItem to="/about">About</OptionItem>
        <OptionItem to="/signin">Sign In</OptionItem>
      </OptionsContainer>
    </NavbarContainer>
  </TopNavbar>
);

export default Navbar;
