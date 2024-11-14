import React, { FC } from 'react';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Navbar from 'react-bootstrap/Navbar';
import { useApp } from '../../context/app/useApp';
import { useAuth } from '../../context/auth/useAuth';

const SRCNavbar = () => {
  // Determine if banner should be shown
  const { state: authState } = useAuth();
  const { state: appState } = useApp();

  const {
    isAuthenticated,
    user: { userName },
  } = authState;

  const {
    appConfig: { appBanner: bannerText },
  } = appState;
  const showBanner = bannerText !== undefined && bannerText !== '';

  return (
    <div className="canfar-header">
      <Navbar expand="md">
        <Container fluid>
          <Navbar.Brand>
            <img
              src="/science-portal/images/SRCNetLogo.png"
              style={{ maxWidth: '256px' }}
              alt="SRCNet Logo"
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          {isAuthenticated && (
            <span className="display-name" style={{ textAlign: 'end' }}>
              {userName}
            </span>
          )}
        </Container>
      </Navbar>

      {showBanner && (
        <Card className="sp-warning-card">
          <div className="sp-warn-heading" />
          <div className="sp-warn-body">
            <p>{bannerText}</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default SRCNavbar;
