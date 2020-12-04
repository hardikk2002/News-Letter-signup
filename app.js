const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');
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

    const url = "https://us7.api.mailchimp.com/3.0/lists/e0ee77a492";
    const jsonData = JSON.stringify(data);

    const options = {
      method: "POST",
      auth:"hardk:fc245090342c320b079df4745f5623be-us7"
    }

    const request = https.request(url, options, function(response){

      if (response.statusCode == 200){
        res.sendFile(__dirname + "/success.html");
      }else {
        res.sendFile(__dirname + "/failure.html");
      }

        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end()


    console.log(firstName, lastName, email);
});


app.post("/failure", function(req, res){
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
    console.log("server is up and running at port number 3000");
});

// fc245090342c320b079df4745f5623be-us7

// listid
// e0ee77a492