import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

const FormPopover = ({
  headerText,
  bodyText,
}: {
  headerText: string;
  bodyText: string;
}) => {
  return (
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
      <FontAwesomeIcon
        className="sp-form-cursor popover-blue"
        icon={faQuestionCircle}
      />
    </OverlayTrigger>
  );
};

export default FormPopover;
