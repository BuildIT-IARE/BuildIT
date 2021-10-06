import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { ContestDetailsContainer } from "./contest-details.styles";

import Page from "../page/page.component";
import Title from "../custom-title/custom-title.component";
import CustomButton from "../custom-button/custom-button.component";
import BackArrow from "../back-arrow/back-arrow.component";

import { selectContestWithId } from "../../redux/contest/contest.selector";

const ContestDetails = ({ contest, location, history }) => {
  const attemptContest = location.pathname.replace("contests", "attempt");
  const error = { message: "Invalid Contest" };
  if (!contest) throw error;
  const {
    contestName,
    contestDate,
    contestDuration,
    contestStartTime,
    contestEndTime,
  } = contest;

  return (
    <Page>
      <ContestDetailsContainer>
        <BackArrow history={history} />
        <Title>{contestName}</Title>
        <span>Date: {contestDate.split("-").reverse().join("-")}</span>
        <span>
          {`Contest Window: ${contestStartTime.slice(
            0,
            2
          )}:${contestStartTime.slice(2)} - ${contestEndTime.slice(
            0,
            2
          )}:${contestEndTime.slice(2)}`}
        </span>
        <span>{`Duration: ${contestDuration} minutes`}</span>
        <CustomButton onClick={() => history.push(attemptContest)}>
          Start_
        </CustomButton>
      </ContestDetailsContainer>
    </Page>
  );
};

const mapStateToProps = (state, ownProps) => ({
  contest: selectContestWithId(ownProps.match.params.contestId)(state),
});

export default withRouter(connect(mapStateToProps)(ContestDetails));
