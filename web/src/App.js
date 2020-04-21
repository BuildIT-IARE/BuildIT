import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Route, Switch, Redirect } from "react-router-dom";

import HomePage from "./pages/homepage/homepage.component";
import SignInAndSignUp from "./pages/sign-in-and-sign-up/sign-in-and-sign-up.component";

import Navbar from "./components/navbar/navbar.component";
import Spinner from "./components/spinner/spinner.component";
import ErrorPrompt from "./components/error-boundary/error.component";

import { selectCurrentUser } from "./redux/user/user.selector";

const App = ({ currentUser }) => {
  return (
    <div>
      <Navbar />
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route
          exact
          path="/signin"
          render={() => {
            return currentUser ? <Redirect to="/" /> : <SignInAndSignUp />;
          }}
        />
        <Route exact path="/spinner" component={Spinner} />
        <Route component={ErrorPrompt} />
      </Switch>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
});

export default connect(mapStateToProps)(App);
