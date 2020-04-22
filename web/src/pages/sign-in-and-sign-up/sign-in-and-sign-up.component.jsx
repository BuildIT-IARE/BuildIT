import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import Page from "../../components/page/page.component";
import SignIn from "../../components/sign-in/sign-in.component";
import SignUp from "../../components/sign-up/sign-up.component";
import Spinner from "../../components/spinner/spinner.component";

import { isUserFetching } from "../../redux/user/user.selector";

const SignInAndSignUp = ({ isFetching }) => {
  return isFetching ? (
    <Spinner />
  ) : (
    <Page>
      <SignIn />
      <SignUp />
    </Page>
  );
};

const mapStateToProps = createStructuredSelector({
  isFetching: isUserFetching,
});

export default connect(mapStateToProps)(SignInAndSignUp);
