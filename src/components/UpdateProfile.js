import React, { useRef, useState } from "react";
import { Card, Form, Button, Alert } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

export default function UpdateProfile() {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const passwordConfirmRef = useRef(null);
  const { currentUser, updateEmail, updatePassword } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    if (passwordRef.current.value !== passwordConfirmRef.current.value)
      return setError("Passwords do not match!");

    let promises = [];
    if (emailRef.current.value != currentUser.email)
      promises.push(updateEmail(emailRef.current.value));
    if (passwordRef.current.value)
      promises.push(updatePassword(passwordRef.current.value));

    Promise.all(promises)
      .then(() => {
        history.push("/");
      })
      .catch(() => setError("Failed to update account"))
      .finally(() => setLoading(false));
  }

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="mb-4 text-center">Update Profile</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                ref={emailRef}
                required
                defaultValue={currentUser.email}
              />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                ref={passwordRef}
                placeholder="Leave blank to keep the same"
              />
            </Form.Group>
            <Form.Group id="password-confirm">
              <Form.Label>Password Confirmation</Form.Label>
              <Form.Control
                type="password"
                ref={passwordConfirmRef}
                placeholder="Leave blank to keep the same"
              />
            </Form.Group>
            <Button className="w-100 mt-3" type="submit" disabled={loading}>
              Update
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        <Link to="/">Cancel</Link>
      </div>
    </>
  );
}
