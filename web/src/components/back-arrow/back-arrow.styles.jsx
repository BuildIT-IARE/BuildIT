import styled from "styled-components";
import { ReactComponent as Back } from "../../assets/svg/back.svg";
import { logoColor } from "../../vars";

export const BackAr = styled(Back)`
  height: 50px;
  width: 50px;
  cursor: pointer;
  margin-bottom: 20px;
  transition: fill;
  transition-duration: 0.3s;
  :hover {
    fill: ${logoColor};
  }
`;
