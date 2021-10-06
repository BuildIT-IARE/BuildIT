import styled, { css } from "styled-components";
import { logoColor } from "../../vars";

const Dots = css`
  width: 60%;
  height: 60%;
  display: inline-block;
  position: absolute;
  top: 0;
  background-color: ${logoColor};
  border-radius: 100%;

  -webkit-animation: sk-bounce 2s infinite ease-in-out;
  animation: sk-bounce 2s infinite ease-in-out;
`;

const Keyframes = css`
  @-webkit-keyframes sk-rotate {
    100% {
      -webkit-transform: rotate(360deg);
    }
  }
  @keyframes sk-rotate {
    100% {
      transform: rotate(360deg);
      -webkit-transform: rotate(360deg);
    }
  }

  @-webkit-keyframes sk-bounce {
    0%,
    100% {
      -webkit-transform: scale(0);
    }
    50% {
      -webkit-transform: scale(1);
    }
  }

  @keyframes sk-bounce {
    0%,
    100% {
      transform: scale(0);
      -webkit-transform: scale(0);
    }
    50% {
      transform: scale(1);
      -webkit-transform: scale(1);
    }
  }
`;

export const SpinnerOverlay = styled.div`
  position: absolute;
  top: 30%;
  left: 45%;
`;

export const SpinnerContainer = styled.div`
  margin: 100px auto;
  width: 100px;
  height: 100px;
  position: relative;
  text-align: center;
  -webkit-animation: sk-rotate 2s infinite linear;
  animation: sk-rotate 2s infinite linear;

  ${Keyframes}
`;

export const Dot1 = styled.div`
  ${Dots}
`;

export const Dot2 = styled.div`
  ${Dots}
  top: auto;
  bottom: 0;
  -webkit-animation-delay: -1s;
  animation-delay: -1s;
`;
