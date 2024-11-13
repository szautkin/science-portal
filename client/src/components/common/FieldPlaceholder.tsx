import Placeholder from 'react-bootstrap/Placeholder';

const FieldPlaceholder = () => (
  <Placeholder className="sp-form-p" as="p" animation="glow">
    <Placeholder
      className="sp-form-placeholder"
      bg="secondary"
      md={12}
      sz="sm"
    />
  </Placeholder>
);

export default FieldPlaceholder;
