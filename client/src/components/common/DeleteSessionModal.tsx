// Libs
import React from 'react';

// Components
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

// Constants
import { APP_DELETE_SESSION_INFO } from '../../context/app/constants';

// Hooks
import { useApp } from '../../context/app/useApp';
import { useData } from '../../context/data/useData';

const DeleteSessionModal = () => {
  const { state, clearDeleteSessionInfo } = useApp();
  const { fetchDeleteSession } = useData();
  const { showModal, sessionName, sessionId } =
    state?.[APP_DELETE_SESSION_INFO] ?? {};

  const onClose = () => {
    clearDeleteSessionInfo();
  };

  const onConfirm = () => {
    fetchDeleteSession(sessionId);
    clearDeleteSessionInfo();
  };

  return (
    <Modal show={showModal} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title className="sp-modal-header">Are you sure?</Modal.Title>
      </Modal.Header>
      <Modal.Body className="st-modal-container">
        <p>
          Do you really want to delete this session? This process cannot be
          undone.
        </p>
        <p>
          Session name {sessionName}, id {sessionId}
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>

        <Button variant="danger" onClick={onConfirm}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default DeleteSessionModal;
