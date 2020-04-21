import { takeLatest, put, all, call } from "redux-saga/effects";

import UserActionTypes from "./user.types";

import {
  signInSuccess,
  signInFailure,
  signUpSuccess,
  signUpFailure,
} from "./user.actions";
import { requestSignIn, requestSignUp } from "../../utils/auth";

function* signIn({ payload }) {
  try {
    const { data } = yield call(requestSignIn, payload);

    if (data.success) {
      const { username, token, branch } = data;
      yield put(signInSuccess({ username, token, branch }));
    } else {
      throw data;
    }
  } catch (err) {
    const { data } = err.response;
    yield put(signInFailure(data));
  }
}

function* signUp({ payload }) {
  try {
    const { data } = yield call(requestSignUp, payload);
    yield put(signUpSuccess(data));
  } catch (err) {
    const { data } = err.response;
    yield put(signUpFailure(data));
  }
}

function* onSignInStart() {
  yield takeLatest(UserActionTypes.SIGN_IN_START, signIn);
}

function* onSignUpStart() {
  yield takeLatest(UserActionTypes.SIGN_UP_START, signUp);
}

function* userSagas() {
  yield all([call(onSignInStart), call(onSignUpStart)]);
}

export default userSagas;
