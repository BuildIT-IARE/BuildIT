import { createSelector } from "reselect";

const selectContests = (state) => state.contests;

export const selectAllContests = createSelector(
  [selectContests],
  (contests) => contests.allContests
);

export const selectContestsDisplay = createSelector(
  [selectAllContests],
  (contests) => {
    return contests ? Object.keys(contests).map((key) => contests[key]) : [];
  }
);

export const selectIsContestsFetching = createSelector(
  [selectContests],
  (contests) => contests.isFetching
);

export const selectContestWithId = (contestId) =>
  createSelector([selectContestsDisplay], (contests) =>
    contests.length > 0
      ? contests.find((contest) => {
          return contest.contestId === contestId;
        })
      : {
          contestName: "",
          contestDate: "",
          contestDuration: "",
          contestStartTime: "",
          contestEndTime: "",
        }
  );
