import React from "react";
import dayjs from "dayjs";

import Card from "../card/card.component";
import { ReactComponent as Arrow } from "../../assets/svg/arrow.svg";

const ContestCard = ({ contest, handleClick, ...otherProps }) => {
  const { contestName, contestDate } = contest;
  const active = dayjs().format("YYYY-MM-DD") === contestDate;
  return (
    <Card {...otherProps} handleClick={handleClick} active={active}>
      <span>{contestName}</span>
      <Arrow />
    </Card>
  );
};

export default ContestCard;
