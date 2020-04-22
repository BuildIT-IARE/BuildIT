import React from "react";

import { BackAr } from "./back-arrow.styles";

const BackArrow = ({ history }) => <BackAr onClick={() => history.goBack()} />;

export default BackArrow;
