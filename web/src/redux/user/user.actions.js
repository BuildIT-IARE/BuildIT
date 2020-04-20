import UserActionTypes from "./user.types";

export const signInStart = (username, password) => ({
  type: UserActionTypes.SIGN_IN_START,
  payload: {
    username,
    password,
  },
});

export const signInSuccess = (userCredentials) => ({
  type: UserActionTypes.SIGN_IN_SUCCESS,
  payload: userCredentials,
});

export const signInFailure = (error) => ({
  type: UserActionTypes.SIGN_IN_START,
  payload: error.message,
});
