// modules
const express = require("express");
const bcrypt = require("bcrypt-nodejs");

// global variables
let database = {
  users: [
    {
      id: "123",
      name: "John",
      email: "john@gmail.com",
      password: "cookies",
      entries: 0,
      joined: new Date(),
    },
    {
      id: "124",
      name: "Sally",
      email: "sally@gmail.com",
      password: "bananas",
      entries: 0,
      joined: new Date(),
    },
    {
      id: "125",
      name: "George",
      email: "george@gmail.com",
      password: "cupcakes",
      entries: 0,
      joined: new Date(),
    },
  ],
};

// setting the server
const app = express();

// root, for testing purposes
app.get("/", (req, res) => {
  res.json(database.users);
});

app.listen(3000, () => {
  console.log("app is running on port 3000");
});

// middleware
app.use(express.json());

// signin
app.post("/signin", (req, res) => {
  if (req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
    res.json("Success loging in");
  } else {
    res.status(400).json("Error logging in");
  }
});

// register
app.post("/register", (req, res) => {
  database.users.push({
    id: "126",
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    entries: 0,
    joined: new Date(),
  });
  res.json(database.users[database.users.length - 1]);
});

// profile
app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  let found = false;
  database.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      res.json(user);
    }
  });
  if (!found) {
    res.status(400).json("no such user");
  }
});

// image
app.put("/image", (req, res) => {
  const { id } = req.body;
  let found = false;
  database.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      user.entries++;
      res.json(user);
    }
  });
  if (!found) {
    res.status(400).json("no such user");
  }
});
