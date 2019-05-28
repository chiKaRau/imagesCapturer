import React, { Component } from "react";
import "./Core.scss";
import $ from "jquery";
import { Navbar, Nav, Form, FormControl, Button } from "react-bootstrap";
import axios from "axios";
import Image from "../Image/Image.js";

//2 image onerror
//logo / title

class Core extends Component {
  state = {
    url: "",
    filename: "",
    imgTagImageAry: [],
    aTagImageAry: [],
    displayAry: "displayImg",
    status: "Images are ready to zip.",
    seconds: 180,
    addDomainName: false,
    aTagImageAryCopy: [],
    imgTagImageAryCopy: [],
    zipped: ""
  };

  componentDidMount() {
    $(".optionbuttons").hide();
    $(".status").hide();
    $(".countDown").hide();
  }

  countDown = () => {
    this.setState(
      {
        seconds: this.state.seconds - 1
      },
      () => {
        this.state.seconds < 1 && clearInterval(this.interval);
      }
    );
  };

  startCountDown = () => {
    this.interval = setInterval(this.countDown, 1000);
  };

  componentWillUnmount() {
    clearInterval(this.interval);
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
        //console.log(res);
        this.setState({
          imgTagImageAry: res.data.imgTagImageAry,
          aTagImageAry: res.data.aTagImageAry,
          zipped: false
        });
      });
      $(document).ready(function() {
        $(".search").css("margin-top", "5vh");
        $(".optionbuttons").fadeIn(1000);
        $(".status").fadeIn(1000);
      });
    } else {
      alert("invalid Url");
    }
  };

  handleChange = evt => {
    //evt.preventDefault(); add this would cause callback bug
    const { name, value, type, checked } = evt.target;
    type === "checkbox"
      ? this.setState({ [name]: checked }, () => {
          this.handleDomainName();
        })
      : this.setState({
          [name]: value
        });
  };

  handleDomainName = () => {
    let aTagImageAry = this.state.aTagImageAry;
    let imgTagImageAry = this.state.imgTagImageAry;

    if (this.state.addDomainName) {
      this.setState(
        {
          aTagImageAryCopy: aTagImageAry,
          imgTagImageAryCopy: imgTagImageAry
        },
        () => {
          this.addDomainName(aTagImageAry, imgTagImageAry);
        }
      );
    } else {
      console.log(this.state.aTagImageAryCopy)
      this.setState({
        aTagImageAry: this.state.aTagImageAryCopy,
        imgTagImageAry: this.state.imgTagImageAryCopy
      });
    }
  };

  addDomainName = (aTagImageAry, imgTagImageAry) => {
    let aTagImageAryNew = [];
    let imgTagImageAryNew = [];
    let url = this.state.url;
    let domain = url.slice(0, url.indexOf("/", 8)) + "/";
    for (let ele of aTagImageAry) {
      aTagImageAryNew.push(
        domain + ele.slice(ele.indexOf("//") + 2, ele.length)
      );
    }
    for (let ele of imgTagImageAry) {
      imgTagImageAryNew.push(
        domain + ele.slice(ele.indexOf("//") + 2, ele.length)
      );
    }
    console.log(aTagImageAryNew);
    this.setState({
      aTagImageAry: aTagImageAryNew,
      imgTagImageAry: imgTagImageAryNew
    });
  };

  //zip button -> zip all images -> display download buttons
  zipImage = () => {
    //reset the countdown (interval);
    //if it doesn't have the following line
    //seconds will be jumping twice
    clearInterval(this.interval);
    let filename = Math.random()
      .toString(36)
      .slice(-5);
    let imageAry;
    this.state.displayAry === "displayImg"
      ? (imageAry = this.state.imgTagImageAry)
      : (imageAry = this.state.aTagImageAry);
    this.setState(
      {
        filename: filename,
        status: "The images are zipping...",
        seconds: 180
      },
      () => {
        axios
          .post("/zip", { filename: this.state.filename, imageAry: imageAry })
          .then(res => {
            this.setState(
              {
                status: "Images zip has been created.",
                zipped: true
              },
              () => {
                //start the countdown
                this.startCountDown();
                $(".countDown").fadeIn(1000);
              }
            );
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
          >
            Zip
          </Button>

          {this.state.zipped ? (
            <Button className="optionbuttons" variant="outline-info">
              <a
                className="downloadButton"
                href={"imagezip/" + this.state.filename + ".zip"}
                download
              >
                Download
              </a>
            </Button>
          ) : (
            <Button className="optionbuttons" variant="outline-info" disabled>
              Download
            </Button>
          )}
        </div>

        <div id="panel" class="jumbotron jumbotron-fluid">
          <div class="container">
            <div>
              <p
                style={{ color: "red", display: "inline-block", margin: "5px" }}
              >
                Bad Resolution? Try this.
              </p>
              <label style={{ margin: "5px", display: "inline-block" }}>
                <input
                  type="radio"
                  name="displayAry"
                  value="displayImg"
                  checked={this.state.displayAry === "displayImg"}
                  onChange={this.handleChange}
                />
                ImgTag?
              </label>
              <label style={{ margin: "5px", display: "inline-block" }}>
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
            <div>
              <p
                style={{ color: "red", display: "inline-block", margin: "5px" }}
              >
                Fail to load Image?
              </p>
              <label style={{ margin: "5px", display: "inline-block" }}>
                <input
                  type="checkbox"
                  name="addDomainName"
                  checked={this.state.addDomainName}
                  onChange={this.handleChange}
                />
                Fix Image link
              </label>
            </div>
          </div>
        </div>

        <div className="status" style={{ color: "white" }}>
          <p
            style={{
              display: "inline-block",
              marginLeft: "5px",
              marginRight: "5px"
            }}
          >
            Total Images :
            {this.state.displayAry === "displayImg"
              ? this.state.imgTagImageAry.length
              : this.state.aTagImageAry.length}
          </p>
          <p
            style={{
              display: "inline-block",
              marginLeft: "5px",
              marginRight: "5px"
            }}
          >
            Status : {this.state.status}
          </p>
          <p className="countDown" style={{ color: "red" }}>
            Image Zip file will be Expires in {this.state.seconds} seconds
          </p>
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
