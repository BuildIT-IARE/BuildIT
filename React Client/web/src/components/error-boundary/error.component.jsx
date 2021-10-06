import React from "react";
import { ReactComponent as Error404 } from "../../assets/svg/error_404.svg";
import { ReactComponent as ErrorMonster } from "../../assets/svg/errormonster.svg";
import { ReactComponent as ErrorConstruction } from "../../assets/svg/errorconstruction.svg";

import {
  ErrorImageOverlay,
  ErrorImageContainer,
  ErrorImageText,
} from "./error-boundary.styles";

import Page from "../page/page.component";

const ErrorPrompt = ({
  message = "Woops! Looks like you're lost.",
  image = "404",
}) => (
  <Page>
    <ErrorImageOverlay>
      <ErrorImageContainer>
        {image === "monster" ? (
          <ErrorMonster />
        ) : image === "construction" ? (
          <ErrorConstruction />
        ) : (
          <Error404 />
        )}
      </ErrorImageContainer>
      <ErrorImageText>{message}</ErrorImageText>
    </ErrorImageOverlay>
  </Page>
);

export default ErrorPrompt;
