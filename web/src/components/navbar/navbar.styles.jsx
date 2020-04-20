import styled from "styled-components";
import { Link } from "react-router-dom";

import { logoColor, gray } from "../../vars";

export const TopNavbar = styled.div`
  /* position: fixed; */
  top: 0;
  left: 0;
  width: 100%;
  transition: opacity 0.3s;
  border-bottom: 1px solid #efefef;
  z-index: 10;
  box-shadow: 0 1px 2px rgba(16, 16, 17, 0.02),
    0 3.4px 8px rgba(16, 16, 17, 0.007), 0 12px 30px rgba(16, 16, 17, 0.003);
  font-size: 16px;
`;

export const NavbarContainer = styled.div`
  width: 1356px;
  max-width: 80%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 56px;
`;

export const LogoContainer = styled(Link)`
  color: black;
  font-weight: 900;
  font-size: 24px;
  cursor: pointer;
  text-decoration: none;
  -webkit-transition: color 0.7s;

  &:hover {
    color: ${logoColor};
  }
  color: black;
`;

export const OptionsContainer = styled.div`
  padding-top: 2px;
  display: block;
`;

export const OptionItem = styled(Link)`
  font-size: 14px;
  margin-left: 12px;
  color: ${gray};
  text-decoration: none;

  &:hover {
    color: ${logoColor};
  }
`;
