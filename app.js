//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const request = require("request");
const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {

  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const email = req.body.email;

  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  }; // this will return a javascript

  const jsonData = JSON.stringify(data); // this will convert into sting of json format.
  const url = "https://us8.api.mailchimp.com/3.0/lists/yourlistID";
  const options = {
    method: "POST",
    auth: "username:api_key"
  }
  const request = https.request(url, options, function (response) {
    console.log(response.statusCode);


    response.on("data", function (data) {
      const dataDetails = JSON.parse(data);
      console.log(dataDetails);

      if (response.statusCode === 200 && dataDetails.error_count === 0) {
        res.sendFile(__dirname + "/success.html");
      } else {
        res.sendFile(__dirname + "/failure.html");
      }
    })
  })
  request.write(jsonData);
  request.end();
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});
app.listen(process.env.PORT || 3000, function () {
  console.log("server is running on 3000");
});




