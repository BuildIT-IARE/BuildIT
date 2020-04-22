import axios from "axios";

export const getAllContests = (token) => {
  return axios({
    url: "/contests",
    method: "get",
    headers: {
      Authorization: token,
    },
  });
};
