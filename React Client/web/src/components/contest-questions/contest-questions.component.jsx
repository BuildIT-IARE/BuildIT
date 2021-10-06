import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { withRouter } from "react-router-dom";
import Timer from "react-compound-timer";
import dayjs from "dayjs";

import Page from "../page/page.component";
import Title from "../custom-title/custom-title.component";
import BackArrow from "../back-arrow/back-arrow.component";
import Spinner from "../spinner/spinner.component";
import Card from "../card/card.component";

import { Container, TitleContainer } from "./contest-questions.styles";

import { selectCurrentUserToken } from "../../redux/user/user.selector";
import {
  createParticipation,
  getAllQuestionsById,
  isContestActive,
  getParticipation,
} from "../../utils/query";
import ErrorPrompt from "../error-boundary/error.component";

const ContestQuestions = ({ match: { params }, history, location, token }) => {
  const { contestId } = params;
  const [state, setState] = useState({
    active: true,
    loading: true,
    questions: [],
    participation: null,
  });
  useEffect(() => {
    async function startRegistration(contestId, token) {
      try {
        let {
          data: { success },
        } = await isContestActive(contestId, token);
        if (success) {
          await createParticipation(contestId, token);
          const questionsResponse = await getAllQuestionsById(contestId, token);
          const participationResponse = await getParticipation(
            contestId,
            token
          );
          setState((state) => ({
            ...state,
            participation: participationResponse.data[0],
            questions: questionsResponse.data,
          }));
        } else {
          setState((state) => ({ ...state, active: false }));
        }
        setState((state) => ({ ...state, loading: false }));
      } catch (err) {
        throw err;
      }
    }
    startRegistration(contestId, token);
  }, [contestId, token]);
  const { loading, questions, active } = state;
  if (!loading) {
    const { participation } = state;
    var validTill = dayjs(participation.validTill) - dayjs();
    validTill = Math.max(0, validTill);
  } else {
    return <Spinner />;
  }
  return active ? (
    <Page>
      <Container>
        <BackArrow history={history} />
        <TitleContainer>
          <Title>{contestId}</Title>
          <Title logocolor>
            <Timer initialTime={validTill} direction="backward">
              <Timer.Hours />:
              <Timer.Minutes />:
              <Timer.Seconds />
            </Timer>
          </Title>
        </TitleContainer>
        {questions.map((question) => {
          const { _id, questionId, questionName } = question;
          return (
            <Card
              key={_id}
              handleClick={() =>
                history.push(`${location.pathname}/${questionId}`)
              }
            >
              <span>{questionName}</span>
              <span className="">Score: 0</span>
            </Card>
          );
        })}
      </Container>
    </Page>
  ) : (
    <ErrorPrompt image="monster" message="The contest is inactive right now." />
  );
};

const mapStateToProps = createStructuredSelector({
  token: selectCurrentUserToken,
});

export default withRouter(connect(mapStateToProps)(ContestQuestions));
