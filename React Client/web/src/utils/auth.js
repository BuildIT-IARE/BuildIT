import axios from "axios";

export const requestSignIn = (userCredentials) => {
  return axios({
    url: "/login",
    method: "post",
    data: { ...userCredentials },
  });
};

export const requestSignUp = (userCredentials) => {
  return axios({
    url: "/signup",
    method: "post",
    data: { ...userCredentials },
  });
};
