import ContestActionTypes from "./contest.types";

export const fetchContestsStart = (token) => ({
  type: ContestActionTypes.FETCH_CONTESTS_START,
  payload: token,
});

export const fetchContestsSuccess = (contests) => ({
  type: ContestActionTypes.FETCH_CONTESTS_SUCCESS,
  payload: contests,
});

export const fetchContestsFailure = (error) => ({
  type: ContestActionTypes.FETCH_CONTESTS_FAILURE,
  payload: error.message,
});
