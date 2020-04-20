import { takeLatest, all, call } from "redux-saga/effects";

import UserActionTypes from "./user.types";

import {} from "./user.actions";

function signIn(action) {
  console.log(action.payload);
}

function* onSignInStart() {
  yield takeLatest(UserActionTypes.SIGN_IN_START, signIn);
}

function* userSagas() {
  yield all([call(onSignInStart)]);
}

export default userSagas;
