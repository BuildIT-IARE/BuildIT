import UserActionTypes from "./user.types";

export const signInStart = (username, password) => ({
  type: UserActionTypes.SIGN_IN_START,
  payload: {
    username,
    password,
  },
});

export const signInSuccess = (userData) => ({
  type: UserActionTypes.SIGN_IN_SUCCESS,
  payload: userData,
});

export const signInFailure = (error) => ({
  type: UserActionTypes.SIGN_IN_FAILURE,
  payload: error.message,
});

export const signUpStart = (userCredentials) => ({
  type: UserActionTypes.SIGN_UP_START,
  payload: userCredentials,
});

export const signUpSuccess = (userData) => ({
  type: UserActionTypes.SIGN_UP_SUCCESS,
  payload: userData,
});

export const signUpFailure = (error) => ({
  type: UserActionTypes.SIGN_UP_FAILURE,
  payload: error.message,
});

export const signOut = () => ({
  type: UserActionTypes.SIGN_OUT,
});
