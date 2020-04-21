import React from "react";
import { ReactComponent as ErrorAlien } from "../../assets/svg/error_404.svg";

import {
  ErrorImageOverlay,
  ErrorImageContainer,
  ErrorImageText,
} from "./error-boundary.styles";

import Page from "../page/page.component";

const ErrorPrompt = () => (
  <Page>
    <ErrorImageOverlay>
      <ErrorImageContainer>
        <ErrorAlien />
      </ErrorImageContainer>
      <ErrorImageText>Woops! Looks like you're lost.</ErrorImageText>
    </ErrorImageOverlay>
  </Page>
);

export default ErrorPrompt;
