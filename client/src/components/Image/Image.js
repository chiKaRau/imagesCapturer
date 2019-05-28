import React from "react";
import ImgModal from "./ImgModal.js";
import { Button } from "react-bootstrap";
import "./image.scss";
import $ from "jquery";

class Image extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalShow: false
    };
  }

  handleError = evt => {
    evt.target.src = "https://static.thenounproject.com/png/850656-200.png";
  };

  handleLoaded = evt => {
    //console.log(evt.target)
    $(evt.target).css("background-image", "none");
  };

  render() {
    const style = { width: 150, height: 150 };
    let modalClose = () => this.setState({ modalShow: false });

    return (
      <div className="imgBox" style={{ margin: "10px" }}>
        <div class="card bg-light mb-3">
          <button
            className="btn btn-danger"
            type="button"
            name={this.props.ele}
            onClick={this.props.deleteImg}
          >
            Delete
          </button>
          <div class="card-body">
            <img
              className="image"
              onClick={() => this.setState({ modalShow: true })}
              style={style}
              src={this.props.ele}
              onError={this.handleError}
              onLoad={this.handleLoaded}
            />
          </div>

          <ImgModal
            show={this.state.modalShow}
            onHide={modalClose}
            ele={this.props.ele}
          />
        </div>
      </div>
    );
  }
}

export default Image;
