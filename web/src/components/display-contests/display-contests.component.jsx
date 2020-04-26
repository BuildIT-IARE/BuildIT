import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { withRouter } from "react-router-dom";

import { ContestsPageContainer } from "./display-contests.styles";

import ContestCard from "../contest-card/contest-card.component";
import Page from "../page/page.component";
import Title from "../custom-title/custom-title.component";
import BackArrow from "../back-arrow/back-arrow.component";

import { selectContestsDisplay } from "../../redux/contest/contest.selector";

const DisplayContests = ({ match, history, contests }) => {
  return (
    <Page>
      <ContestsPageContainer>
        <BackArrow history={history} />
        <Title>Contests</Title>
        {contests.map((contest) => (
          <ContestCard
            key={contest.contestId}
            handleClick={() => {
              history.push(`${match.path}/${contest.contestId}`);
            }}
            contest={contest}
          />
        ))}
      </ContestsPageContainer>
    </Page>
  );
};
const mapStateToProps = createStructuredSelector({
  contests: selectContestsDisplay,
});

export default withRouter(connect(mapStateToProps)(DisplayContests));
