const handleImage = db => (req, res) => {
	const { id } = req.body;
	return db("users")
		.where("id", "=", id)
		.increment("entries", 1)
		.then(response => {
			db.select("*")
				.from("users")
				.where("id", id)
				.then(user => {
					res.json(user[0].entries);
				});
		})
		.catch(err => {
			res.status(400).json("unable to get entries");
		});
};

module.exports = {
	handleImage: handleImage
};
