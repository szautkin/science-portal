import React from 'react';
import Modal from 'react-bootstrap/Modal';
import { useAuth } from '../../context/auth/useAuth';
import LoginForm from '../forms/LoginForm';

const CanfarLoginModal = () => {
  const { state } = useAuth();

  return (
    <>
      <Modal show={!state.isAuthenticated} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title className="sp-modal-header">
            Authentication required
          </Modal.Title>
        </Modal.Header>
        <LoginForm />
      </Modal>
    </>
  );
};
export default CanfarLoginModal;
