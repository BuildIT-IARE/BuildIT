import ContestActionTypes from "./contest.types";

const INITIAL_STATE = {
  allContests: [],
  isFetching: false,
  error: null,
};

const ContestReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ContestActionTypes.FETCH_CONTESTS_START:
      return {
        ...state,
        isFetching: true,
        allContests: [],
      };
    case ContestActionTypes.FETCH_CONTESTS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        allContests: action.payload,
        error: null,
      };
    case ContestActionTypes.FETCH_CONTESTS_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default ContestReducer;
