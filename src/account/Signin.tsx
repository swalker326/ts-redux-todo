import React, { useState, useEffect } from "react";
import Auth from "@aws-amplify/auth";
import { toggleAuthState } from "../state/authSlice";
import { useAppSelector, useAppDispatch } from "../state/hooks";
import { Container, Col, Row, Form, Button } from "react-bootstrap";
import { Link, Redirect } from "react-router-dom";
interface FormData {
  email: string;
  password: string;
}

export const Signin = () => {
  const auth = useAppSelector((state) => state.auth.isAuthenticated);
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  useEffect(() => {
    Auth.currentAuthenticatedUser().then((resp) => {
      console.log("resp :", resp);
      return resp.username ? dispatch(toggleAuthState()) : null;
    });
    console.log("auth :", auth);
  }, []);
  const signInUser = async () => {
    Auth.signIn(formData.email, formData.password).then((resp) => {
      dispatch(toggleAuthState());
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
    signInUser();
  };

  if (auth) {
    console.log("Going to Todos");
    return <Redirect to="/todos" />;
  }

  return (
    <Container className="Login">
      <Row>
        <Col>
          <Container style={{ maxWidth: "600px" }}>
            <Form onSubmit={(e) => handleSubmit(e)}>
              <h4>Sign in</h4>
              <Form.Control
                className="mt-3 mb-3"
                name="email"
                onChange={(e) => handleInputChange(e)}
                type="email"
                placeholder="Email"
              />
              <Form.Control
                className="mt-3 mb-3"
                name="password"
                onChange={(e) => handleInputChange(e)}
                type="password"
                placeholder="Password"
              />
              <Link to="signup">Create Account</Link>
              <Container className="d-flex justify-content-end">
                <div className="d-flex flex-column align-items-center">
                  <Button className="w-100" type="submit">
                    Sign In
                  </Button>
                  {/* <div>
                    <Link className="text-muted" to="password_reset">
                      Forgot password?
                    </Link>
                  </div> */}
                </div>
              </Container>
            </Form>
          </Container>
        </Col>
      </Row>
    </Container>
  );
};
