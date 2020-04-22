import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { withRouter } from "react-router-dom";

import { Container } from "./contest-questions.styles";

import Page from "../page/page.component";
import Title from "../custom-title/custom-title.component";
import BackArrow from "../back-arrow/back-arrow.component";

const ContestQuestions = ({ match: { params }, history }) => {
  const contestId = params.contestId;
  return (
    <Page>
      <Container>
        <BackArrow history={history} />
        <Title>{contestId}</Title>
      </Container>
    </Page>
  );
};

const mapStateToProps = createStructuredSelector({});

export default withRouter(connect(mapStateToProps)(ContestQuestions));
