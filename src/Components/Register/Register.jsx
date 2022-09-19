import axios from "axios";
import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import { Navigate } from "react-router-dom";

function Register() {
  const [error, setError] = useState("");
  const [user, setUser] = useState({
    name: "",
    last_name: "",
    email: "",
    password: "",
  });
  const [waiting, setWaiting] = useState(false);
  const [success, setSuccess] = useState(false);

  const getUser = ({ target }) => {
    setUser((prevUser) => {
      return { ...prevUser, [target.name]: target.value };
    });
  };

  const sendData = async (e) => {
    e.preventDefault();
    setWaiting(true);

    const res = await axios
      .post(`${process.env.REACT_APP_BASE_URL}/api/users`, user)
      .catch(function (error) {
        console.log(error.toJSON());
        setError(error.toJSON());
      });

    setWaiting(false);
    if (res.data.message === "success") {
      setSuccess(true);
      setError("");
    } else {
      setError(res.data.message);
    }
  };

  return (
    <>
      {success && <Navigate to="/login" />}
      <div className="vh-100 d-flex justify-content-center align-items-center">
        <Form className="w-50" onSubmit={sendData}>
          <Form.Group className="mb-3" controlId="formBasicFirstName">
            <Form.Control
              name="name"
              type="text"
              placeholder="Name"
              onChange={getUser}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicLirstName">
            <Form.Control
              name="last_name"
              type="text"
              placeholder="Last name"
              onChange={getUser}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Control
              name="email"
              type="email"
              placeholder="Enter email"
              onChange={getUser}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Control
              name="password"
              type="password"
              placeholder="Password"
              onChange={getUser}
            />
          </Form.Group>
          {error && <Alert variant="danger">{error}</Alert>}
          <Button className="w-100" variant="info" type="submit">
            {waiting && "Waiting ... "}
            {!waiting && "Signup"}
          </Button>
        </Form>
      </div>
    </>
  );
}

export default Register;
