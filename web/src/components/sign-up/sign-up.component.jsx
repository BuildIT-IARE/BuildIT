import React, { useState } from "react";
import { connect } from "react-redux";

import { Container } from "./sign-up.styles";

import CustomInput from "../custom-input/custom-input.component";
import CustomButton from "../custom-button/custom-button.component";
import Title from "../custom-title/custom-title.component";

import { signUpStart } from "../../redux/user/user.actions";

const SignUp = ({ signUpStart }) => {
  const [userCredentials, setCredentials] = useState({
    username: "",
    password: "",
    email: "",
    name: "",
    confirmPassword: "",
    branch: "",
  });

  const {
    username,
    password,
    confirmPassword,
    email,
    branch,
    name,
  } = userCredentials;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    signUpStart(userCredentials);

    setCredentials({
      username: "",
      password: "",
      email: "",
      name: "",
      confirmPassword: "",
      branch: "",
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setCredentials({ ...userCredentials, [name]: value });
  };

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <Title>Sign Up</Title>
        <CustomInput
          handleChange={handleChange}
          name="name"
          value={name}
          label="Name"
          required
        />
        <CustomInput
          handleChange={handleChange}
          name="email"
          type="email"
          value={email}
          label="Email"
          required
        />
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
        <CustomInput
          handleChange={handleChange}
          name="confirmPassword"
          type="password"
          value={confirmPassword}
          label="Confirm Password"
          required
        />

        <CustomInput
          as="select"
          handleChange={handleChange}
          name="branch"
          value={branch}
          label="Branch"
          type="select"
          required
        >
          <option value="" disabled></option>
          <option value="cse">CSE</option>
          <option value="it">IT</option>
          <option value="ece">ECE</option>
          <option value="eee">EEE</option>
          <option value="mech">MECH</option>
          <option value="aero">AERO</option>
          <option value="civil">CIVIL</option>
        </CustomInput>
        <CustomButton onSubmit={handleSubmit}>Sign Up</CustomButton>
      </form>
    </Container>
  );
};

const mapDispatchToProps = (dispatch) => ({
  signUpStart: (userCredentials) => dispatch(signUpStart(userCredentials)),
});

export default connect(null, mapDispatchToProps)(SignUp);
