import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faEdit,
  faCheck,
  faCheckSquare,
  faTruck,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import jwt_decode from "jwt-decode";
import Style from "./NoteBody.module.scss";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { faPlusSquare } from "@fortawesome/free-regular-svg-icons";

function NoteBody() {
  const baseURL = process.env.REACT_APP_BASE_URL;
  const token = localStorage.getItem("noteToken");
  const decoded = jwt_decode(token);
  let [notes, setNotes] = useState([]);
  let [filteredOrders, setFilteredOrders] = useState([]);
  let [filter, setFiler] = useState(null);
  let [show, setShow] = useState(false);
  let [noteId, setNoteId] = useState("");
  let [waiting, setWaiting] = useState(false);

  let [orderState, setOrderState] = useState({
    addState: false,
    editState: false,
    deleteState: false,
    confirmState: false,
    completeState: false,
    state: null,
  });

  let [editedNote, setEditedNote] = useState({
    name: "",
    address: "",
    phone: "",
    notes: "",
  });

  let [addNote, setAddNote] = useState({
    name: "",
    address: "",
    phone: "",
    notes: "",
  });

  const getOrders = async () => {
    var { data } = await axios.get(`${baseURL}/api/orders`, {
      headers: {
        token,
        userID: decoded._id,
      },
    });
    setNotes(data);
  };

  useEffect(() => {
    getOrders();
  }, []);

  useEffect(() => {
    let filteredOrders = filter
      ? notes.filter((note) => note.state === filter)
      : notes;
    setFilteredOrders(filteredOrders);
  }, [filter, notes]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const deleteOrder = async (id) => {
    setWaiting(true);
    const res = await axios.delete(`${baseURL}/api/orders/${id}`, {
      data: {
        NoteID: id,
        token,
      },
    });
    getOrders();
    handleClose();
    setWaiting(false);
  };

  const saveValueOfEditNoteInputs = ({ target }) => {
    setEditedNote({ ...editedNote, [target.name]: target.value });
  };

  const handlingEditInputs = (id) => {
    const note = notes.filter((note) => {
      return note._id === id;
    })[0];

    setEditedNote({
      name: note.name,
      phone: note.phone,
      address: note.address,
      notes: note.notes,
    });
  };

  const editOrder = async (id) => {
    setWaiting(true);
    const res = await axios.put(
      `${baseURL}/api/orders/${id}`,
      {
        name: editedNote.name,
        address: editedNote.address,
        phone: editedNote.phone,
        notes: editedNote.notes,
        NoteID: noteId,
        tagId: "63228d1086ae372dedf27f01",
        tag: "FisrtTag",
      },
      { headers: { token } }
    );

    getOrders();
    handleClose();
    setWaiting(false);
  };

  const addNewOrder = async () => {
    setWaiting(true);
    const res = await axios.post(
      `${baseURL}/api/orders`,
      {
        name: addNote.name,
        address: addNote.address,
        phone: addNote.phone,
        notes: addNote.notes,
        user: decoded._id,
        tagId: "63228d1086ae372dedf27f01",
        tag: "FisrtTag",
      },
      { headers: { token } }
    );

    getOrders();
    handleClose();
    setWaiting(false);
    setAddNote({
      title: "",
      desc: "",
      name: "",
      address: "",
      phone: "",
      notes: "",
    });
  };

  const saveValueOfAddNoteInputs = ({ target }) => {
    setAddNote({ ...addNote, [target.name]: target.value });
  };

  const UpdateModelState = (name) => {
    setOrderState({
      addState: name === "addState",
      editState: name === "editState",
      deleteState: name === "deleteState",
      confirmState: name === "confirmState",
      completeState: name === "completeState",
    });

    handleShow();
  };

  const UpdateOrderState = async (id, state) => {
    setWaiting(true);
    const { data } = await axios.put(
      `${baseURL}/api/orders/state/${id}`,
      { state: state },
      { headers: { token } }
    );
    getOrders();
    handleClose();
    setWaiting(false);
  };

  return (
    <>
      <Button
        variant="primary"
        className="my-5 m-2"
        onClick={() => {
          UpdateModelState("addState");
        }}
      >
        <FontAwesomeIcon icon={faPlusSquare} /> Add New Order
      </Button>

      <Button
        variant="primary"
        className="my-5 m-2"
        onClick={() => {
          setFiler("new");
        }}
      >
        New
      </Button>

      <Button
        variant="primary"
        className="my-5 m-2"
        onClick={() => {
          setFiler("confirmed");
        }}
      >
        Confirmed
      </Button>

      <Button
        variant="primary"
        className="my-5 m-2"
        onClick={() => {
          setFiler("completed");
        }}
      >
        Completed
      </Button>
      {filter && (
        <Button
          variant="danger"
          className="my-5 m-2"
          onClick={() => {
            setFiler(null);
          }}
        >
          clear filter
        </Button>
      )}
      <div className="row">
        {filteredOrders &&
          filteredOrders.map((value, index) => {
            return value.state === "completed" && !filter ? null : (
              <div key={value._id} className="col-lg-4 mb-4">
                <div
                  className={`note p-4 text-dark  ${
                    value.state === "completed"
                      ? Style.completedOrders
                      : value.state === "confirmed"
                      ? Style.confirmedOrders
                      : "bg-warning"
                  } `}
                >
                  <div className="noteHeader mb-2 d-flex justify-content-around">
                    <div className="noteIcons d-flex justify-content-around">
                      <FontAwesomeIcon
                        className={Style.noteIcon}
                        icon={faTrash}
                        onClick={() => {
                          UpdateModelState("deleteState");
                          setNoteId(value._id);
                        }}
                      />
                      <FontAwesomeIcon
                        className={Style.noteIcon}
                        icon={faEdit}
                        onClick={async () => {
                          //   activeEdit();
                          UpdateModelState("editState");
                          setNoteId(`${value._id}`);
                          handlingEditInputs(value._id);
                        }}
                      />
                      <FontAwesomeIcon
                        className={Style.noteIcon}
                        icon={value.confirmed ? faCheckSquare : faCheck}
                        onClick={async () => {
                          UpdateModelState("confirmState");
                          setNoteId(`${value._id}`);
                        }}
                      />
                      <FontAwesomeIcon
                        className={Style.noteIcon}
                        icon={faTruck}
                        onClick={async () => {
                          UpdateModelState("completeState");
                          setNoteId(`${value._id}`);
                        }}
                      />
                    </div>
                  </div>

                  <div className="noteBody">
                    <p> Name : {value.name}</p>
                    <p> Address : {value.address}</p>
                    <p> Phone : {value.phone}</p>
                    <p> Notes : </p>
                    <p style={{ whiteSpace: "pre" }}>{value.notes} </p>
                    <p> {value.date.split("T")[0]}</p>
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {/* ===== ------ ===== < Add & Edit & Delete Modal > ===== ------ ===== */}

      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title className={Style.modalColor}>
            {orderState.editState && "Delete Order"}
            {orderState.editState && "Update Order"}
            {orderState.addState && "Add Order"}
            {orderState.confirmState && "Confirm Order"}
            {orderState.completeState && "Ship Order"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className={Style.modalColor}>
          {orderState.deleteState && "Are you sure ?"}
          {orderState.editState && (
            <>
              <Form.Control
                style={{ margin: 10 }}
                onChange={saveValueOfEditNoteInputs}
                type="text"
                placeholder="Enter Name"
                name="name"
                value={editedNote.name}
              />
              <Form.Control
                style={{ margin: 10 }}
                onChange={saveValueOfEditNoteInputs}
                type="text"
                placeholder="Enter Address"
                name="address"
                value={editedNote.address}
              />
              <Form.Control
                style={{ margin: 10 }}
                onChange={saveValueOfEditNoteInputs}
                type="text"
                placeholder="Enter Phone"
                name="phone"
                value={editedNote.phone}
              />
              <Form.Control
                style={{ margin: 10 }}
                onChange={saveValueOfEditNoteInputs}
                type="text"
                placeholder="Enter Notes"
                name="notes"
                value={editedNote.notes}
                as="textarea"
                rows={6}
              />
            </>
          )}
          {orderState.addState && (
            <>
              <Form.Control
                style={{ margin: 10 }}
                onChange={saveValueOfAddNoteInputs}
                type="text"
                placeholder="Enter Note Description"
                name="desc"
              />
              <Form.Control
                style={{ margin: 10 }}
                onChange={saveValueOfAddNoteInputs}
                type="text"
                placeholder="Enter Name"
                name="name"
              />
              <Form.Control
                style={{ margin: 10 }}
                onChange={saveValueOfAddNoteInputs}
                type="text"
                placeholder="Enter Address"
                name="address"
              />
              <Form.Control
                style={{ margin: 10 }}
                onChange={saveValueOfAddNoteInputs}
                type="text"
                placeholder="Enter Phone"
                name="phone"
              />
              <Form.Control
                style={{ margin: 10 }}
                onChange={saveValueOfAddNoteInputs}
                type="text"
                placeholder="Enter Notes"
                name="notes"
                as="textarea"
                rows={6}
              />
            </>
          )}
          {orderState.confirmState && "Are you sure ?"}
          {orderState.completeState && "Are you sure ?"}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="info" onClick={handleClose}>
            Close
          </Button>
          {orderState.deleteState && (
            <Button
              variant="danger"
              onClick={() => {
                deleteOrder(noteId);
              }}
            >
              {!waiting && "Delete"}
              {waiting && "Wait ... "}
            </Button>
          )}
          {orderState.editState && (
            <Button
              variant="warning"
              onClick={() => {
                editOrder(noteId);
              }}
            >
              {!waiting && "Save"}
              {waiting && "Wait ... "}
            </Button>
          )}
          {orderState.addState && (
            <Button
              variant="primary"
              onClick={() => {
                addNewOrder();
              }}
            >
              {!waiting && "Add"}
              {waiting && "Wait ... "}
            </Button>
          )}
          {orderState.confirmState && (
            <Button
              variant="primary"
              onClick={() => {
                UpdateOrderState(noteId, "confirmed");
              }}
            >
              {!waiting && "Confirm"}
              {waiting && "Wait ... "}
            </Button>
          )}
          {orderState.completeState && (
            <Button
              variant="primary"
              onClick={() => {
                UpdateOrderState(noteId, "completed");
              }}
            >
              {!waiting && "Done"}
              {waiting && "Wait ... "}
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default NoteBody;
