import React from "react";

import Page from "../../components/page/page.component";
import SignIn from "../../components/sign-in/sign-in.component";
import SignUp from "../../components/sign-up/sign-up.component";

const SignInAndSignUp = () => (
  <Page>
    <SignIn />
    <SignUp />
  </Page>
);

export default SignInAndSignUp;
