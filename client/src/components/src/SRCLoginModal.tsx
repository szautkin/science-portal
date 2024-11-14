import React from 'react';
import Modal from 'react-bootstrap/Modal';
import { useAuth } from '../../context/auth/useAuth';
import { IS_AUTHENTICATED } from '../../context/auth/constants';

const SRCLoginModal = () => {
  const { state } = useAuth();

  return (
    <Modal show={!state?.[IS_AUTHENTICATED]} backdrop="static" keyboard={false}>
      <Modal.Header>
        <Modal.Title className="sp-modal-header">
          Authentication required
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="sp-auth-form-body">
        <a className="btn btn-primary" href="/science-portal/oidc-login">
          Sign In to OpenID Connect
        </a>
      </Modal.Body>
    </Modal>
  );
};

export default SRCLoginModal;
