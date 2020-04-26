import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Route, Switch, Redirect } from "react-router-dom";

import HomePage from "./pages/homepage/homepage.component";
import SignInAndSignUp from "./pages/sign-in-and-sign-up/sign-in-and-sign-up.component";
import ContestsPage from "./pages/contests-page/contests-page.component";
import AttemptPage from "./pages/attempt-page/attempt-page.component";

import Navbar from "./components/navbar/navbar.component";
import Spinner from "./components/spinner/spinner.component";
import ErrorBoundary from "./components/error-boundary/error-boundary.component";
import ErrorPrompt from "./components/error-boundary/error.component";

import { selectCurrentUser } from "./redux/user/user.selector";

const App = ({ currentUser }) => {
  const checkAuth = (component) => {
    return currentUser ? component : <Redirect to="/signin" />;
  };
  return (
    <div>
      <Navbar />
      <ErrorBoundary>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route
            exact
            path="/signin"
            render={() => {
              return currentUser ? (
                <Redirect to="/contests" />
              ) : (
                <SignInAndSignUp />
              );
            }}
          />
          <Route
            path="/contests"
            render={(props) => checkAuth(<ContestsPage {...props} />)}
          />
          <Route
            path="/attempt"
            render={(props) => checkAuth(<AttemptPage {...props} />)}
          />
          <Route exact path="/spinner" component={Spinner} />
          <Route component={ErrorPrompt} />
        </Switch>
      </ErrorBoundary>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
});

export default connect(mapStateToProps)(App);
