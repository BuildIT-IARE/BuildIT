import axios from "axios";

export const getAllContests = (token) => {
  return axios({
    url: "/contests",
    method: "get",
    headers: {
      Authorization: token,
    },
  });
};

export const isContestActive = (contestId, token) => {
  return axios({
    url: `/isOngoing`,
    method: "post",
    data: {
      contestId,
    },
    headers: {
      Authorization: token,
    },
  });
};

export const createParticipation = (contestId, token) => {
  return axios({
    url: `/participations`,
    method: "post",
    data: {
      contestId,
    },
    headers: {
      Authorization: token,
    },
  });
};

export const getParticipation = (contestId, token) => {
  return axios({
    url: `/participations/${contestId}`,
    method: "get",
    headers: {
      Authorization: token,
    },
  });
};

export const getAllQuestionsById = (contestId, token) => {
  return axios({
    url: `/questions/contests/${contestId}`,
    method: "get",
    headers: {
      Authorization: token,
    },
  });
};

export const getQuestionWithId = (questionId, token) => {
  return axios({
    url: `/questions/${questionId}`,
    method: "get",
    headers: {
      Authorization: token,
    },
  });
};
