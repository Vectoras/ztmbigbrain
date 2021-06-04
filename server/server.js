// modules
const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");

// connecting to the database
const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "smartbrain_server",
    password: "qwerty",
    database: "smartbrain",
  },
});

// setting up the server
const app = express();

// middleware
app.use(express.json());
app.use(cors());

app.listen(3000, () => {
  console.log("app is running on port 3000");
});

// root, for testing purposes
app.get("/", (req, res) => {
  db.select("*")
    .from("users")
    .then((data) => {
      res.json(data);
    });
});

// signin
app.post("/signin", (req, res) => {
  db.select("hash")
    .from("login")
    .where("email", "=", req.body.email)
    .then((data) => {
      if (bcrypt.compareSync(req.body.password, data[0].hash)) {
        db.select("id", "name", "entries")
          .from("users")
          .where("email", "=", req.body.email)
          .then((user) => res.json(user[0]))
          .catch((err) => res.status(400).json("Unable to retrieve user"));
      } else {
        res.status(400).json("No user with these credentials");
      }
    })
    .catch((err) => res.status(400).json("No user with these credentials"));
});

// register
app.post("/register", (req, res) => {
  const hash = bcrypt.hashSync(req.body.password);

  db.transaction((trx) => {
    trx
      .insert({
        hash: hash,
        email: req.body.email,
      })
      .into("login")
      .returning("email")
      .then((loginEmail) => {
        return trx
          .insert({
            name: req.body.name,
            email: loginEmail[0],
            joined: new Date(),
          })
          .into("users");
      })
      .then(trx.commit)
      .catch(trx.rollback);
  })
    .then(() => {
      db.select(["id", "name", "entries"])
        .from("users")
        .where({
          email: req.body.email,
        })
        .then((user) => {
          res.json(user[0]);
        })
        .catch((err) => {
          res.json("Error at retrieving the user after registration !!!");
        });
    })
    .catch((err) => {
      res.status(400).json("Unable to register");
    });
});

// profile
app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  db.select("*")
    .from("users")
    .where({ id: id })
    .then((user) => {
      if (user.length === 0) {
        res.status(400).json("Error getting the user");
      } else {
        res.json(user[0]);
      }
    });
});

// image
app.put("/image", (req, res) => {
  const { id } = req.body;
  db("users")
    .where({ id: id })
    .increment("entries", 1)
    .returning(["entries", "name"])
    .then((response) => {
      if (response.length) {
        res.json(response[0]);
      } else {
        throw new Error("No user for this ID at updating the entries");
      }
    })
    .catch((err) => {
      res.status(400).json("Error at updating the entries");
    });
});
