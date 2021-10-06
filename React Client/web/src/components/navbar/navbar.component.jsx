import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import {
  TopNavbar,
  NavbarContainer,
  LogoContainer,
  OptionsContainer,
  OptionItem,
} from "./navbar.styles";

import { selectCurrentUser } from "../../redux/user/user.selector";

import { signOut } from "../../redux/user/user.actions";

const Navbar = ({ currentUser, signOut }) => (
  <TopNavbar>
    <NavbarContainer>
      <LogoContainer to="/">BuildIT_</LogoContainer>
      <OptionsContainer>
        {currentUser ? (
          <OptionItem to="/profile" logocolor="true">
            {currentUser.username}
          </OptionItem>
        ) : null}
        <OptionItem to="/about">About</OptionItem>
        {currentUser ? (
          <OptionItem to="/" onClick={signOut}>
            Sign Out
          </OptionItem>
        ) : (
          <OptionItem to="/signin">Sign In</OptionItem>
        )}
      </OptionsContainer>
    </NavbarContainer>
  </TopNavbar>
);

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
});

const mapDispatchToProps = (dispatch) => ({
  signOut: () => dispatch(signOut()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
