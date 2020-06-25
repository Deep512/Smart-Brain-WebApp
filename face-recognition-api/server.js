const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const bcrypt = require("bcrypt-nodejs");
const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");
const db = require("knex")({
	client: "mysql",
	connection: {
		host: "localhost",
		user: "root",
		password: "deep1234",
		database: "smart_brain"
	}
});

app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
	db.select("*")
		.from("users")
		.then(users => {
			res.json(users);
		});
});

app.post("/signin", signin.handleSignin(db, bcrypt));

app.post("/register", register.handleRegister(db, bcrypt));

app.get("/profile/:id", profile.handleProfile(db));

app.put("/image", image.handleImage(db));

app.listen(3000, () => {
	console.log("app is litening on port 3000");
});

/*
==>res = this is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userid --> GET = user
/image --> PUT --> user
*/
