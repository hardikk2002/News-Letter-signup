const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');
require('dotenv').config();


const app = express();


app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){

    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {

        members: [
          {
            email_address: email,
            status: "subscribed",
            merge_fields:{
              FNAME: firstName,
              LNAME: lastName
            }
          }
        ]

    };
    const APIKEY = process.env.API_KEY;

    const uniqueAudienceKey = process.env.listId;
    const url = "https://us18.api.mailchimp.com/3.0/lists/"+uniqueAudienceKey;
    const jsonData = JSON.stringify(data);

    const options = {
      method: "POST",
      auth:"hardk:"+APIKEY
    }

    const request = https.request(url, options, function(response){

      if (response.statusCode == 200){
        res.sendFile(__dirname + "/success.html");
      }else {
        res.sendFile(__dirname + "/failure.html");
      }

        response.on("data", function(data){

        })
    })

    request.write(jsonData);
    request.end()

});


app.post("/failure", function(req, res){
    console.log(res.redirect("/"));
    res.redirect("/");
});

app.listen(process.env.PORT || 5000, function () {
    console.log("server is up and running at port number 5000");
});
