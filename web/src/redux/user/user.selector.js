import { createSelector } from "reselect";

const selectUser = (state) => state.user;

export const selectCurrentUser = createSelector(
  [selectUser],
  (user) => user.currentUser
);

export const selectCurrentUserToken = createSelector(
  [selectCurrentUser],
  (currentUser) => currentUser.token
);

export const isUserFetching = createSelector(
  [selectUser],
  (user) => user.isFetching
);
