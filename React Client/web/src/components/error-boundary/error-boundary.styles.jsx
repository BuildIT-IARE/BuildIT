import styled from "styled-components";

export const ErrorImageOverlay = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const ErrorImageContainer = styled.div`
  display: inline-block;
  width: 40%;
  height: 20%;
  svg {
    height: 100%;
    width: 100%;
  }
`;

export const ErrorImageText = styled.h2`
  font-size: 28px;
  color: black;
  flex: 2;
`;
