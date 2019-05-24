import React from "react";
import { Button, Modal } from "react-bootstrap";
import "./image.scss";

class ImgModal extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Modal
          {...this.props}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              <p>{this.props.ele}</p>
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <img src={this.props.ele} />
          </Modal.Body>

          <Modal.Footer>
            <Button onClick={this.props.onHide}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default ImgModal;
