import React, { useState, useEffect } from "react";
import Auth from "@aws-amplify/auth";
import { toggleAuthState } from "../state/authSlice";
import { useAppSelector, useAppDispatch } from "../state/hooks";
import { Container, Col, Row, Form, Button } from "react-bootstrap";
import { Link, Redirect } from "react-router-dom";
interface FormData {
  email: string;
  password: string;
  code: string;
}

export const Signup = () => {
  const [signed, setSigned] = useState(false);
  const [error, setError] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    code: "",
  });

  const auth = useAppSelector((state) => state.auth.isAuthenticated);
  const dispatch = useAppDispatch();

  const signUpUser = () => {
    // setLoading(true);
    const { email, password } = formData;
    Auth.signUp(email, password)
      .then((data) => {
        console.log("data :", data); //eslint disable line
        setSigned(true);
        // setLoading(false);
      })
      .catch((err) => {
        // setLoading(false);
        setError(err.message);
        console.log("err :", err); //eslint disable line
      });
  };
  const confirm = () => {
    // setLoading(true);
    const { email, code, password } = formData;
    Auth.confirmSignUp(email, code)
      .then(() => {
        // setLoading(false);
        setConfirmed(true);
        Auth.signIn(email, password).then(() =>
          dispatch({
            type: "SIGN_IN",
            token: "dummy-auth-token",
            userEmail: email,
          })
        );
      })
      .catch((err) => {
        // setLoading(false);
        setError(err);
        console.log(err);
      });
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signUpUser();
  };
  const handleVerification = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    confirm();
  };

  if (signed && confirmed) return <Redirect to="/todos" />;
  return (
    <Container className="Signup">
      <Col>
        <Row>
          {!signed ? (
            <Container style={{ maxWidth: "600px" }}>
              <Form onSubmit={(e) => handleSubmit(e)}>
                <h4>Create Account</h4>
                <Form.Control
                  className="mt-3 mb-3"
                  name="email"
                  onChange={(e) => handleInputChange(e)}
                  placeholder="Email"
                />
                <Form.Control
                  className="mt-3 mb-3"
                  name="password"
                  onChange={(e) => handleInputChange(e)}
                  type="password"
                  placeholder="Password"
                  // isValid={true}
                />
                <Link to="/login">Wait go back</Link>
                <Container className="d-flex justify-content-end">
                  <Button type="submit">Sign Up</Button>
                </Container>
                {error ? (
                  <Container>
                    <span>Error</span> {error}
                  </Container>
                ) : null}
              </Form>
            </Container>
          ) : (
            <Form className="ml-5 mr-5" onSubmit={(e) => handleVerification(e)}>
              <h4>Confirm Email</h4>
              <Form.Control
                className="mt-3 mb-3"
                name="code"
                onChange={(e) => handleInputChange(e)}
                placeholder="Verification Code"
              />
              <Button type="submit">Confirm</Button>
            </Form>
          )}
        </Row>
      </Col>
    </Container>
  );
};
