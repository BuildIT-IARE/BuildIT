import React from "react";

import { SpinnerOverlay, Dot1, Dot2, SpinnerContainer } from "./spinner.styles";

import Page from "../page/page.component";

const Spinner = () => (
  <Page>
    <SpinnerOverlay>
      <SpinnerContainer>
        <Dot1 />
        <Dot2 />
      </SpinnerContainer>
    </SpinnerOverlay>
  </Page>
);

export default Spinner;
