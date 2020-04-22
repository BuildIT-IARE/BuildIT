import { connect } from "react-redux";
import { compose } from "redux";
import { createStructuredSelector } from "reselect";

import Contests from "./contests.component";
import WithSpinner from "../with-spinner/with-spinner.component";

import { selectIsContestsFetching } from "../../redux/contest/contest.selector";

const mapStateToProps = createStructuredSelector({
  isFetching: selectIsContestsFetching,
});

const ContestsContainer = compose(
  connect(mapStateToProps),
  WithSpinner
)(Contests);

export default ContestsContainer;
