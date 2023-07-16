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
} from "./SignupElements";

const Signup = () => {
  return (
    <>
      <Container>
        <FormWrap>
          <Icon to="/">HealthCo.</Icon>
          <FormContent>
            <Form action="#">
              <FormH1>Create a new account</FormH1>
              <FormLabel htmlFor="for">Email</FormLabel>
              <FormInput type="email" required />
              <FormLabel htmlFor="for">Phone No.</FormLabel>
              <FormInput type="tel" required />
              <FormLabel htmlFor="for">Complete Address</FormLabel>
              <FormInput type="text" required />
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

export default Signup;
