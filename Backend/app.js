const mongoose = require("mongoose");
const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const fs = require("fs");
const cors=require("cors")
const userRoutes = require("./Routes/User-Routes");
const roomRoutes = require("./Routes/Room-Routes");
const adminRoutes = require("./Routes/Admin-Routes");
const employeeRoutes=require("./Routes/Employee-Routes")
const currentRoutes=require("./Routes/Current-Routes")
const relayRoutes=require("./Routes/Relay-Routes")
app.use(bodyParser.json());
app.use(cors())
app.use("/uploads/images", express.static(path.join("uploads", "images")));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use("/api/power/user", userRoutes);
app.use("/api/power/room", roomRoutes);
app.use("/api/power/admin", adminRoutes);
app.use("/api/power/employee",employeeRoutes)
app.use("/api/power/current",currentRoutes)
app.use("/api/power/relay",relayRoutes)
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.rw3waqy.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
  )
  .then(app.listen(4444))
  .catch((err) => {
    console.log(err);
  });
