const express = require("express");
const app = express();
const Insta = require("instamojo-nodejs");
require("dotenv").config();
const bodyParser = require("body-parser");

const API_KEY = process.env.API;

const AUTH_KEY = process.env.AUTH;

Insta.setKeys(API_KEY, AUTH_KEY);

Insta.isSandboxMode(true);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
var path = require("path");
app.use(express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
app.get("/don", (req, res) => {
  res.sendFile(__dirname + "/donation.html");
});

app.post(
  "/pay",

  (req, res) => {
    var name = req.body.name;
    var email = req.body.email;
    var amount = req.body.amount;

    var data = new Insta.PaymentData();

    data.send_email = "True";
    data.purpose = "Doantion"; // REQUIRED
    data.amount = amount;
    data.name = name;
    data.email = email; // REQUIRED

    Insta.createPayment(data, function (error, response) {
      if (error) {
        return res.status(400).json({
          error: "payment failed",
        });
      } else {
        // Payment redirection link at response.payment_request.longurl

        res.send("Please check your email to make payment");
      }
    });
  }
);

app.get("/success", (req, res) => {
  res.sendFile(__dirname + "index.html");
});
app.listen(PORT, () => {
  console.log(`app is running on ${PORT}`);
});
