import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Route, Switch } from "react-router-dom";

import ContestQuestions from "../../components/contest-questions/contest-questions.component";
import ErrorPrompt from "../../components/error-boundary/error.component";

import { fetchContestsStart } from "../../redux/contest/contest.actions";
import DisplayQuestions from "../../components/display-question/display-question.component";

const AttemptPage = ({ match, fetchContests }) => {
  useEffect(() => {
    fetchContests();
  }, [fetchContests]);

  return (
    <div>
      <Switch>
        <Route
          exact
          path={`${match.path}/:contestId`}
          render={(props) => <ContestQuestions {...props} />}
        />
        <Route
          exact
          path={`${match.path}/:contestId/:questionId`}
          render={(props) => <DisplayQuestions {...props} />}
        />
        <Route component={ErrorPrompt} />
      </Switch>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  fetchContests: () => dispatch(fetchContestsStart()),
});

export default connect(null, mapDispatchToProps)(AttemptPage);
