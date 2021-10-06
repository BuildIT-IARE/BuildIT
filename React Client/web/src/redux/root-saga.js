import { all, call } from "redux-saga/effects";

import userSagas from "./user/user.sagas";
import contestSagas from "./contest/contest.sagas";

function* rootSaga() {
  yield all([call(userSagas), call(contestSagas)]);
}

export default rootSaga;
