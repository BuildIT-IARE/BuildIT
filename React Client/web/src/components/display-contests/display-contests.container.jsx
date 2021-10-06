import { connect } from "react-redux";
import { compose } from "redux";
import { createStructuredSelector } from "reselect";

import DisplayContests from "./display-contests.component";
import WithSpinner from "../with-spinner/with-spinner.component";

import { selectIsContestsFetching } from "../../redux/contest/contest.selector";

const mapStateToProps = createStructuredSelector({
  isFetching: selectIsContestsFetching,
});

const DisplayContestsContainer = compose(
  connect(mapStateToProps),
  WithSpinner
)(DisplayContests);

export default DisplayContestsContainer;
