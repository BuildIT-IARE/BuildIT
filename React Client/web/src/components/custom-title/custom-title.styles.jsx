import styled from "styled-components";
import { logoColor } from "../../vars";

const getColor = ({ logocolor }) => {
  return logocolor ? logoColor : "#161617";
};

export const TitleContainer = styled.h1`
  font-size: 48px;
  color: ${getColor};
  font-weight: 900;
  margin-top: 0;
  margin-bottom: 32px;
  user-select: none;
`;
