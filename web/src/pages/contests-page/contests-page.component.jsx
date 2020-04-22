import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Route } from "react-router-dom";

import ContestsContainer from "../../components/contests/contests.container";
import ContestsDetailsContainer from "../../components/contest-details/contest-details.container";

import { fetchContestsStart } from "../../redux/contest/contest.actions";

const ContestsPage = ({ match, fetchContests }) => {
  useEffect(() => {
    fetchContests();
  }, [fetchContests]);

  return (
    <div>
      <Route
        exact
        path={`${match.path}`}
        render={(props) => <ContestsContainer {...props} />}
      />
      <Route
        exact
        path={`${match.path}/:contestId`}
        render={(props) => <ContestsDetailsContainer {...props} />}
      />
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  fetchContests: () => dispatch(fetchContestsStart()),
});

export default connect(null, mapDispatchToProps)(ContestsPage);
