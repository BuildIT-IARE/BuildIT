import { takeLatest, all, call, put, select } from "redux-saga/effects";
import ContestActionTypes from "./contest.types";
import { fetchContestsSuccess, fetchContestsFailure } from "./contest.actions";
import { getAllContests } from "../../utils/query";
import { selectCurrentUserToken } from "../user/user.selector";

function* fetchContests() {
  try {
    const token = yield select(selectCurrentUserToken);
    const { data } = yield getAllContests(token);
    const contests = data;
    const transformedContests = contests.reduce((accumulator, contest) => {
      accumulator[contest.contestId.toLowerCase()] = contest;
      return accumulator;
    }, {});
    yield put(fetchContestsSuccess(transformedContests));
  } catch (error) {
    yield put(fetchContestsFailure(error));
  }
}

function* onFetchContestsStart() {
  yield takeLatest(ContestActionTypes.FETCH_CONTESTS_START, fetchContests);
}

function* contestSagas() {
  yield all([call(onFetchContestsStart)]);
}

export default contestSagas;
