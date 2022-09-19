import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarMinus, faEdit } from "@fortawesome/free-solid-svg-icons";
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
  let [show, setShow] = useState(false);
  let [noteId, setNoteId] = useState("");
  let [waiting, setWaiting] = useState(false);
  let [deleteState, setDeleteState] = useState(false);
  let [editState, setEditState] = useState(false);
  let [addState, setAddState] = useState(false);
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

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const deleteNote = async (id) => {
    setWaiting(true);
    const res = await axios.delete(`${baseURL}/deleteNote`, {
      data: {
        NoteID: id,
        token,
      },
    });
    getOrders();
    handleClose();
    setWaiting(false);
  };

  const activeDelete = () => {
    setDeleteState(true);
    setEditState(false);
    setAddState(false);
  };

  const activeEdit = () => {
    setEditState(true);
    setDeleteState(false);
    setAddState(false);
  };

  const activeAdd = () => {
    setAddState(true);
    setDeleteState(false);
    setEditState(false);
  };

  const saveValueOfEditNoteInputs = ({ target }) => {
    setEditedNote({ ...editedNote, [target.name]: target.value });
  };

  const handlingEditInputs = (id) => {
    const note = notes.filter((note) => {
      return note._id === id;
    })[0];

    console.log(note);

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
    console.log(addNote);
  };

  console.log(editedNote);

  return (
    <>
      <Button
        variant="primary"
        className="my-5"
        onClick={() => {
          activeAdd();
          handleShow();
        }}
      >
        <FontAwesomeIcon icon={faPlusSquare} /> Add New Note
      </Button>
      <div className="row">
        {notes &&
          notes.map((value, index) => {
            return (
              <div key={value._id} className="col-lg-4 mb-4">
                <div className="note p-4 bg-warning text-dark">
                  <div className="noteHeader d-flex justify-content-around">
                    <div className="">
                      <h6>{value._id}</h6>
                    </div>
                    <div className="noteIcons d-flex justify-content-around w-25">
                      <FontAwesomeIcon
                        className={Style.noteIcon}
                        icon={faCalendarMinus}
                        onClick={() => {
                          activeDelete();
                          setNoteId(value._id);
                          handleShow();
                        }}
                      />
                      <FontAwesomeIcon
                        className={Style.noteIcon}
                        icon={faEdit}
                        onClick={async () => {
                          activeEdit();
                          await setNoteId(`${value._id}`);
                          handlingEditInputs(value._id);
                          handleShow();
                        }}
                      />
                    </div>
                  </div>
                  <div className="noteBody">
                    <p> Name : {value.name}</p>
                    <p> Address : {value.address}</p>
                    <p>Phone : {value.phone}</p>
                    <pre> Notes : {value.notes}</pre>
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
            {deleteState && "Delete Note"}
            {editState && (
              <Form.Control
                onChange={saveValueOfEditNoteInputs}
                type="text"
                placeholder="Enter Note Title"
                name="title"
                value={editedNote.title}
              />
            )}
            {addState && (
              <Form.Control
                onChange={saveValueOfAddNoteInputs}
                type="text"
                placeholder="Enter Note Title"
                name="title"
              />
            )}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className={Style.modalColor}>
          {deleteState && "Are you sure ?"}
          {editState && (
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
          {addState && (
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
        </Modal.Body>
        <Modal.Footer>
          <Button variant="info" onClick={handleClose}>
            Close
          </Button>
          {deleteState && (
            <Button
              variant="danger"
              onClick={() => {
                deleteNote(noteId);
              }}
            >
              {!waiting && "Delete"}
              {waiting && "Wait ... "}
            </Button>
          )}
          {editState && (
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
          {addState && (
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
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default NoteBody;
