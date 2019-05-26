const express = require("express");
const path = require("path");
const fs = require("fs");
const rimraf = require("rimraf");
const bodyParser = require("body-parser");
let request = require("request");
request = require("request-promise");
let cheerio = require("cheerio");
const jszip = require("jszip");
const fetch = require("node-fetch");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, "client/build")));

// Handles any requests that don't match the ones above
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

//zip files -> create a new zip files
app.post("/zip", (req, res) => {
  console.log("zip called");
  //console.log(req.body.imageAry);
  //if file not existed, create one
  if (!fs.existsSync(__dirname + "/client/build/imagezip")) {
    fs.mkdirSync(__dirname + "/client/build/imagezip");
  }

  //create files
  let zip = new jszip();
  let imageAry = [],
    url,
    filename;
  //create an array for url and imagename
  for (url of req.body.imageAry) {
    imageAry.push({
      url: url,
      filename: url.substr(url.lastIndexOf("/") + 1, url.length - 1)
    });
  }
  //zip the url image
  let i = 0;
  const server = async () => {
    for (const { url, filename } of imageAry) {
      response = await fetch(url);
      buffer = await response.buffer();
      zip.file(filename, buffer);
      i++;
      process.stdout.write("Zipping " + i + " images\033[0G");
    }
  };
  let savedzip =
    __dirname + "/client/build/imagezip/" + req.body.filename + ".zip";
  server().then(() => {
    zip
      .generateNodeStream({ type: "nodebuffer", streamFiles: true })
      .pipe(fs.createWriteStream(savedzip))
      .on("finish", function() {
        console.log(req.body.filename + ".zip has been created");
        deleteZip();
        res.end();
      });
  });

  const deleteZip = () => {
    //delete files in 5 mins
    let savepath = __dirname + "/client/build/imagezip";
    fs.readdir(savepath, function(err, files) {
      files.forEach(function(file, index) {
        fs.stat(path.join(savepath, file), function(err, stat) {
          if (err) {
            return console.error(err);
          }

          setTimeout(() => {
            if (file === req.body.filename + ".zip") {
              return rimraf(path.join(savepath, file), function(err) {
                if (err) {
                  return console.error(err);
                }
                console.log("successfully deleted");
              });
            }
          }, 60 * 3 * 1000); //file will be delete in 3 mins
        });
      });
    });
  };
});

//request images
app.post("/requestImages", (req, res) => {
  console.log("requestImages called");

  let url = req.body.url;
  let myPromise = () => {
    return new Promise((resolve, reject) => {
      //request url's body
      request(url, (err, res, body) => {
        //use $ to load body
        const $ = cheerio.load(body);

        let imgTagImageAry = [];
        //$ will find all <img>
        $("img").each(function(i, elem) {
          let temp = elem.attribs.src;
          if (temp != undefined) {
            //if the url doesn't has https/http/ (www will get autocorrect by http)
            if (
              !temp.includes("https:") &&
              !temp.includes("http:") &&
              !temp.includes("www")
            ) {
              // "//"
              if (temp.charAt(0) == "/" && temp.charAt(1) == "/") {
                temp = "http:" + temp;
                // "/"
              } else if (temp.charAt(0) == "/") {
                temp = "http:/" + temp;
              }
            }
            imgTagImageAry.push(temp);
          }
        });

        let aTagImageAry = [];
        //$ will find all <a>
        $("a").each(function(i, elem) {
          if ($(this).find("img").length) {
            let temp = elem.attribs.href;
            if (temp != undefined) {
              //if the url doesn't has https/http/ (www will get autocorrect by http)
              if (
                !temp.includes("https:") &&
                !temp.includes("http:") &&
                !temp.includes("www")
              ) {
                // "//"
                if (temp.charAt(0) == "/" && temp.charAt(1) == "/") {
                  temp = "http:" + temp;
                  // "/"
                } else if (temp.charAt(0) == "/") {
                  temp = "http:/" + temp;
                }
              }
              aTagImageAry.push(temp);
            }
          }
        });
        //console.log(imgArys);
        resolve({ imgTagImageAry: imgTagImageAry, aTagImageAry: aTagImageAry });
      });
    });
  };

  var callMyPromise = async () => {
    let result = await myPromise();
    return result;
  };

  callMyPromise().then(function(result) {
    res.send(result);
  });
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log("App is listening on port " + port);
