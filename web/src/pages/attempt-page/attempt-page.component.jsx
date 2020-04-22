import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Route } from "react-router-dom";

import ContestQuestions from "../../components/contest-questions/contest-questions.component";

import { fetchContestsStart } from "../../redux/contest/contest.actions";

const AttemptPage = ({ match, fetchContests }) => {
  useEffect(() => {
    fetchContests();
  }, [fetchContests]);

  return (
    <div>
      <Route
        exact
        path={`${match.path}/:contestId`}
        render={(props) => <ContestQuestions {...props} />}
      />
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  fetchContests: () => dispatch(fetchContestsStart()),
});

export default connect(null, mapDispatchToProps)(AttemptPage);
