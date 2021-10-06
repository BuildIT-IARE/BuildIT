import { connect } from "react-redux";
import { compose } from "redux";
import { createStructuredSelector } from "reselect";

import ContestDetails from "./contest-details.component";
import WithSpinner from "../with-spinner/with-spinner.component";

import { selectIsContestsFetching } from "../../redux/contest/contest.selector";

const mapStateToProps = createStructuredSelector({
  isFetching: selectIsContestsFetching,
});

const ContestDetailsContainer = compose(
  connect(mapStateToProps),
  WithSpinner
)(ContestDetails);

export default ContestDetailsContainer;
