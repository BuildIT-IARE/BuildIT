import styled from "styled-components";

export const HeaderOverlay = styled.div`
  width: 100%;
  height: 500px;
  display: flex;
  align-items: center;
`;

export const HalfContainer = styled.div`
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  svg {
    height: 100%;
    width: 100%;
  }
`;

export const QuarterContainer = styled.div`
  text-align: center;
  width: 50%;
  height: 30%;
  margin-bottom: 50px;
`;

export const SubTitle = styled.p`
  display: inline;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  font-size: 16px;
`;
