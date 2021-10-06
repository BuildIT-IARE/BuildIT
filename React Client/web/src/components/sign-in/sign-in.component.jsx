import React, { useState } from "react";
import { connect } from "react-redux";

import { Container } from "./sign-in.styles";

import CustomInput from "../custom-input/custom-input.component";
import Title from "../custom-title/custom-title.component";
import CustomButton from "../custom-button/custom-button.component";

import { signInStart } from "../../redux/user/user.actions";

const SignIn = ({ signInStart }) => {
  const [userCredentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const { username, password } = userCredentials;

  const handleSubmit = (e) => {
    e.preventDefault();
    signInStart(username, password);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setCredentials({ ...userCredentials, [name]: value });
  };

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <Title>Sign In</Title>
        <CustomInput
          handleChange={handleChange}
          name="username"
          value={username}
          label="Roll Number"
          required
        />
        <CustomInput
          handleChange={handleChange}
          name="password"
          type="password"
          value={password}
          label="Password"
          required
        />
        <CustomButton onSubmit={handleSubmit}>Sign In</CustomButton>
      </form>
    </Container>
  );
};

const mapDispatchToProps = (dispatch) => ({
  signInStart: (username, password) =>
    dispatch(signInStart(username, password)),
});

export default connect(null, mapDispatchToProps)(SignIn);
