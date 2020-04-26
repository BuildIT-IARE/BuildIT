import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Route, Switch } from "react-router-dom";

import DisplayContestsContainer from "../../components/display-contests/display-contests.container";
import ContestsDetailsContainer from "../../components/contest-details/contest-details.container";

import { fetchContestsStart } from "../../redux/contest/contest.actions";
import ErrorPrompt from "../../components/error-boundary/error.component";

const ContestsPage = ({ match, fetchContests }) => {
  useEffect(() => {
    fetchContests();
  }, [fetchContests]);

  return (
    <div>
      <Switch>
        <Route
          exact
          path={`${match.path}`}
          render={(props) => <DisplayContestsContainer {...props} />}
        />
        <Route
          exact
          path={`${match.path}/:contestId`}
          render={(props) => <ContestsDetailsContainer {...props} />}
        />
        <Route component={ErrorPrompt} />
      </Switch>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  fetchContests: () => dispatch(fetchContestsStart()),
});

export default connect(null, mapDispatchToProps)(ContestsPage);
