import React from "react";
import dayjs from "dayjs";

import { CardContainer } from "./contest-card.styles";
import { ReactComponent as Arrow } from "../../assets/svg/arrow.svg";

const ContestCard = ({ contest, handleClick, ...otherProps }) => {
  const { contestName, contestDate } = contest;
  const activeContest = dayjs().format("YYYY-MM-DD") === contestDate;
  console.log();
  return (
    <CardContainer
      {...otherProps}
      onClick={handleClick}
      activeContest={activeContest}
    >
      <span>{contestName}</span>
      <Arrow />
    </CardContainer>
  );
};

export default ContestCard;
