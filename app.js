require('dotenv').config();

const express = require("express");
const Insta = require("instamojo-nodejs");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(bodyParser.json());


Insta.setKeys(process.env.API_KEY, process.env.AUTH_KEY);

Insta.isSandboxMode(true);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/donation", (req, res) => {
  res.sendFile(__dirname + "/donation.html");
});

app.post("/pay", (req, res) => {

    var name = req.body.name;
    var email = req.body.email;
    var amount = req.body.amount;


  var data = new Insta.PaymentData();

const REDIRECT_URL = "http://localhost:3000/success";

data.setRedirectUrl(REDIRECT_URL);
data.send_email = "True";
data.purpose = "Dogs Relief Donation"; // REQUIRED
data.amount = amount;
data.name = name;
data.email = email; // REQUIRED

Insta.createPayment(data, function (error, response) {
  if (error) {
    // some error
  } else {
    // Payment redirection link at response.payment_request.longurl
    res.send("Please check your email to make payment")
  }
});

});

app.get("/success", (req, res) => {
  res.send("Payment Successful! Please check you Email for transaction summary.");
});



app.listen( process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
