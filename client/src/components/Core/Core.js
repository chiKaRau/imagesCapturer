import React, { Component } from "react";
import "./Core.scss";
import $ from "jquery";
import { Navbar, Nav, Form, FormControl, Button } from "react-bootstrap";
import axios from "axios";
import Image from "../Image/Image.js";

class Core extends Component {
  state = {
    url: "",
    filename: "",
    imgTagImageAry: [],
    aTagImageAry: [],
    displayAry: "displayImg"
  };

  componentDidMount() {
    $(".optionbuttons").hide();
  }

  advance = () => {
    $("#panel").slideToggle();
  };

  validURL = str => {
    var pattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i"
    ); // fragment locator
    return !!pattern.test(str);
  };

  //display button -> display pictures, zip all files -> display download buttons
  handleClick = () => {
    let url = this.state.url;
    if (this.validURL(url)) {
      axios.post("/requestImages", { url: this.state.url }).then(res => {
        console.log(res);

        this.setState({
          imgTagImageAry: res.data.imgTagImageAry,
          aTagImageAry: res.data.aTagImageAry
        });
      });
      $(document).ready(function() {
        $(".search").css("margin-top", "5vh");
        $(".optionbuttons").fadeIn(1000);
      });
    } else {
      alert("invalid Url");
    }
  };

  handleChange = evt => {
    //evt.preventDefault(); add this would cause callback bug
    const { name, value, type, checked } = evt.target;
    type === "checkbox"
      ? this.setState({ [name]: checked })
      : this.setState({
          [name]: value
        });
  };

  //zip button -> zip all images -> display download buttons
  zipImage = () => {
    let filename = Math.random()
      .toString(36)
      .slice(-5);
    this.setState(
      {
        filename: filename
      },
      () => {
        axios.post("/zip", { filename: this.state.filename }).then(res => {
          console.log(res);
        });
      }
    );
  };

  deleteImg = evt => {
    console.log(evt.target.name);
    let ary = "imgTagImageAry";
    let index = this.state.imgTagImageAry.indexOf(evt.target.name);
    if (index === -1) {
      ary = "aTagImageAry";
      index = this.state.aTagImageAry.indexOf(evt.target.name);
    }
    this.setState({
      [ary]: [
        ...this.state[ary].slice(0, index),
        ...this.state[ary].slice(index + 1)
      ]
    });
  };

  render() {
    let displayImg = this.state.imgTagImageAry.map((ele, i = -1) => (
      <Image key={i++} ele={ele} deleteImg={this.deleteImg} />
    ));

    let displayA = this.state.aTagImageAry.map((ele, i = -1) => (
      <Image key={i++} ele={ele} deleteImg={this.deleteImg} />
    ));

    return (
      <div className="search">
        <Form className="search_form">
          <FormControl
            type="text"
            placeholder="Website URL"
            className="mr-sm-2"
            onChange={this.handleChange}
            url={this.state.url}
            name="url"
          />
          <Button
            className="search_button"
            variant="outline-info"
            onClick={this.handleClick}
          >
            Display
          </Button>
        </Form>
        <div>
          <Button
            className="optionbuttons"
            variant="outline-info"
            onClick={this.advance}
          >
            Advance
          </Button>
          <Button
            className="optionbuttons"
            variant="outline-info"
            onClick={this.zipImage}
            disabled
          >
            Zip
          </Button>
          <Button className="optionbuttons" variant="outline-info">
            <a href="hello.txt" download>
              Download
            </a>
          </Button>
        </div>

        <div id="panel" class="jumbotron jumbotron-fluid">
          <div class="container">
            <p style={{ color: "red" }}>
              Bad Resolution? Check Another Button may Solve the Problem.
            </p>
            <label style={{ margin: "5px" }}>
              <input
                type="radio"
                name="displayAry"
                value="displayImg"
                checked={this.state.displayAry === "displayImg"}
                onChange={this.handleChange}
              />
              ImgTag?
            </label>
            <label style={{ margin: "5px" }}>
              <input
                type="radio"
                name="displayAry"
                value="displayA"
                checked={this.state.displayAry === "displayA"}
                onChange={this.handleChange}
              />
              ATag?
            </label>
          </div>
        </div>

        <div className="container-fluid">
          <div className="row justify-content-center">
            {this.state.displayAry === "displayImg" && displayImg}
            {this.state.displayAry === "displayA" && displayA}
          </div>
        </div>
      </div>
    );
  }
}

export default Core;
