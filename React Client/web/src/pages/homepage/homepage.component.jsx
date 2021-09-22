import React from "react";
import { withRouter } from "react-router-dom";

import Page from "../../components/page/page.component";
import CustomButton from "../../components/custom-button/custom-button.component";
import Title from "../../components/custom-title/custom-title.component";

import {
  HeaderOverlay,
  SubTitle,
  HalfContainer,
  QuarterContainer,
} from "./homepage.styles";

import { ReactComponent as HomeCode } from "../../assets/svg/home__stars.svg";

const HomePage = ({ history }) => (
  <Page>
    <HeaderOverlay>
      <HalfContainer>
        <HomeCode />
      </HalfContainer>
      <HalfContainer>
        <QuarterContainer>
          <Title>BuildIT_</Title>
          <SubTitle>
            Exclusive Online Judge platform for the students of Institute of
            Aeronautical Engineering.
          </SubTitle>
        </QuarterContainer>
        <QuarterContainer>
          <CustomButton onClick={() => history.push("/contests")}>
            Get Started
          </CustomButton>
        </QuarterContainer>
      </HalfContainer>
    </HeaderOverlay>
  </Page>
);

export default withRouter(HomePage);
