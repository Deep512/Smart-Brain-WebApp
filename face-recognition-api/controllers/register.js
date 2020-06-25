const handleRegister = (db, bcrypt) => (req, res) => {
	const { email, password, name } = req.body;
	if (!email || !password || !name) {
		return res.status(400).json("invalid information");
	}
	const hash = bcrypt.hashSync(password);
	db.transaction(trx => {
		trx("login")
			.insert({
				hash: hash,
				email: email
			})
			.then(id => {
				return trx("users")
					.insert({
						email: email,
						name: name,
						joined: new Date()
					})
					.then(response => {
						db.select("*")
							.from("users")
							.where("id", response[0])
							.then(user => {
								res.json(user[0]);
							});
					});
			})
			.then(trx.commit)
			.catch(trx.rollback);
	}).catch(err => res.status(400).json("unable to register"));
};

module.exports = { handleRegister: handleRegister };
