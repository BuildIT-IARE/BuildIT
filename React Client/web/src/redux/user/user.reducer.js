import UserActionTypes from "./user.types";

const INITIAL_STATE = {
  currentUser: null,
  isFetching: false,
  error: null,
};

const UserReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UserActionTypes.SIGN_IN_START:
    case UserActionTypes.SIGN_UP_START:
      return {
        ...state,
        isFetching: true,
        error: null,
      };
    case UserActionTypes.SIGN_IN_SUCCESS:
      return {
        ...state,
        isFetching: false,
        currentUser: action.payload,
        error: null,
      };
    case UserActionTypes.SIGN_IN_FAILURE:
    case UserActionTypes.SIGN_UP_FAILURE:
      return {
        ...state,
        isFetching: false,
        currentUser: null,
        error: action.payload,
      };
    case UserActionTypes.SIGN_OUT:
      return {
        ...state,
        currentUser: null,
      };
    default:
      return state;
  }
};

export default UserReducer;
