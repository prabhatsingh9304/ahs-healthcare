import React from "react";
import {
  Form,
  FormH1,
  Container,
  FormButton,
  FormContent,
  FormInput,
  FormLabel,
  FormWrap,
  Text,
  Icon,
} from "./SigninElements";

const Signin = () => {
  return (
    <>
      <Container>
        <FormWrap>
          <Icon to="/">HealthCo.</Icon>
          <FormContent>
            <Form action="#">
              <FormH1>Sign in to your account</FormH1>
              <FormLabel htmlFor="for">Email</FormLabel>
              <FormInput type="email" required />
              <FormLabel htmlFor="for">Password</FormLabel>
              <FormInput type="password" required />
              <FormButton type="submit">Continue</FormButton>
              <Text>Forgot Password</Text>
            </Form>
          </FormContent>
        </FormWrap>
      </Container>
    </>
  );
};

export default Signin;
