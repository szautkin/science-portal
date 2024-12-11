// Libs
import React from 'react';

// Components
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

interface PopoverProps {
  anchor: string;
  headerText: string;
  bodyText: string;
}

const FormPopover = ({ anchor, headerText, bodyText }: PopoverProps) => (
  <OverlayTrigger
    trigger="click"
    key="top"
    placement="top"
    rootClose={true}
    overlay={
      <Popover id={`popover-positioned-top`}>
        <Popover.Header as="h3">{headerText}</Popover.Header>
        <Popover.Body className="sp-form">{bodyText}</Popover.Body>
      </Popover>
    }
  >
    <span>
      {anchor}{' '}
      <FontAwesomeIcon
        className="sp-form-cursor popover-blue"
        icon={faQuestionCircle}
      />
    </span>
  </OverlayTrigger>
);
export default FormPopover;
