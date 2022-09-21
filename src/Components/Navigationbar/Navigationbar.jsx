import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import Style from "./Navigationbar.module.scss";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useLocation } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function Navigationbar() {
  let location = useLocation();

  const logOut = () => {
    localStorage.clear();
  };

  let [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Navbar fixed="top" bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={NavLink} to="/">
            CKAM
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          <Navbar.Collapse id="basic-navbar-nav">
            {location.pathname === "/" && (
              <Nav className="ml-auto">
                <Nav.Link as={NavLink} to="/home">
                  Home
                </Nav.Link>
                <Nav.Link onClick={handleShow}>Logout</Nav.Link>
              </Nav>
            )}

            {location.pathname !== "/" && (
              <Nav className="ml-auto">
                <Nav.Link as={NavLink} to="/register">
                  Register
                </Nav.Link>
                <Nav.Link as={NavLink} to="/login">
                  Login
                </Nav.Link>
              </Nav>
            )}
          </Navbar.Collapse>

          <Modal show={show} onHide={handleClose}>
            <Modal.Header>
              <Modal.Title className={Style.modalColor}>Logout</Modal.Title>
            </Modal.Header>

            <Modal.Body className={Style.modalColor}>
              Are you sure you want to logout ?
            </Modal.Body>

            <Modal.Footer>
              <Button variant="info" onClick={handleClose}>
                Close
              </Button>
              <Button
                as={NavLink}
                to="/login"
                variant="danger"
                onClick={() => {
                  handleClose();
                  logOut();
                }}
              >
                logout
              </Button>
            </Modal.Footer>
          </Modal>
        </Container>
      </Navbar>
    </>
  );
}

export default Navigationbar;
