const mongoose = require("mongoose")
const { Validator } = require("node-input-validator")
const bcrypt = require("bcrypt")
jwt = require("jsonwebtoken")

const pwRules = require("../security/password")
const User = require("../models/user")

exports.createUser = (req, res) => {
	// Signup data inputs validation security
	const validInput = new Validator(req.body, {
		email: "required|email|length:250",
		password: "required|string",
		fname: "string|length:150",
		lname: "string|length:100",
	})

	// Check the input data from the frontend
	validInput
		.check()
		.then(valid => {
			// If inputs are not safe, handle the error
			if (valid === false) {
				res.status(500).json(validInput.errors)
			} else {
				var pw = req.body.password
				// If the inputs are safe, check the password strengh
				if (pwRules.validate(pw)) {
					//hash password
					bcrypt
						.hash(pw, 12)
						.then(hpw => {
							// Format the user data for storage
							const newId = mongoose.Types.ObjectId()
							const user = new User({
								userId: newId,
								email: req.body.email,
								password: hpw,
								fname: req.body.fname,
								lname: req.body.lname,
								isAdmin: false,
							})

							// Store the user data in the database
							user
								.save()
								.then(() =>
									res
										.status(200)
										.json({ message: "User account created successfuly !!!" }),
								)

								// catch storage error
								.catch(err => res.status(503).send({ error: err }))
						})

						// catch bcrypt error
						.catch(err => res.status(502).send({ error: err }))
				} else {
					// If the password is not strong enough, handle the error
					res.status(500).json({
						password: {
							message:
								"Password must be between 6 and 16 characters, must contain upper and lowercase letters and at least a digit.",
							rule: "required|string",
						},
					})
				}
			}
		})

		//catch validator error
		.catch(err => res.status(501).send({ error: err }))
}

exports.logUser = (req, res) => {
	//Login data inputs security
	const validInput = new Validator(req.body, {
		email: "required|email|length:250",
		password: "required|string",
	})

	// Check the input data from the frontend
	validInput
		.check()
		.then(valid => {
			// If inputs are not safe, handle the error
			if (valid === false) {
				res.status(500).json(validInput.errors)
			} else {
				// Check if the email exists
				User.findOne({ email: req.body.email })
					.then(found => {
						// If not found, handle the error
						if (!found) {
							res.status(404).json({ error: "User not found" })
						} else {
							// Saving useful data in to variables
							const pw = req.body.password
							const hpw = found.password

							// Compare the passwords
							bcrypt
								.compare(pw, hpw)
								.then(match => {
									// If not matched, handle error
									if (match === false) {
										res.status(403).json({ error: "Wrong password" })
									} else {
										// If input password is correct, return userId and privileges
										res.status(200).json({
											userId: found.userId,
											token: jwt.sign(
												{
													userId: found.userId,
													isAdmin: found.isAdmin,
												},
												process.env.TOKEN,
												{ expiresIn: "12h" },
											),
											isAdmin: found.isAdmin,
											userId: found.userId,
											fName: found.fname,
											lName: found.lname,
											email: found.email,
											message: "Welcome " + found.fname + " !!!",
										})
									}
								})
								//catch bcrypt error
								.catch(err => res.status(503).send({ error: err }))
						}
					})
					//catch mongoose error
					.catch(err => res.status(502).send({ error: err }))
			}
		})
		// catch validator error
		.catch(err => res.status(501).send({ error: err }))
}

exports.getAllUsers = (req, res) => {
	User.find()
		.select({ fname: 1, lname: 1, isAdmin: 1, email: 1, userId: 1, _id: 0 })
		.then(e => {
			// If there is no return from find()
			if (!e) {
				res.status(404).json({ error: "Not found !!!" })
			} else {
				res.status(200).send(e)
			}
		})

		// catch moogoose error
		.catch(err => res.status(500).send({ error: err }))
}

exports.getUser = (req, res) => {
	const validInput = new Validator(req.body, {
		email: "email|length:250",
		fname: "string|length:150",
		lname: "string|length:100",
	})

	validInput
		.check()
		.then(valid => {
			if (valid === false) {
				res.status(500).json({ error: validInput.errors })
			} else {
				User.find()
					.select({ fname: 1, lname: 1, isAdmin: 1, _id: 0 })
					.where({ ...req.body })
					.then(found => {
						if (!found) {
							res.staus(404).json({ error: "Not found" })
						} else {
							res.status(200).json(found)
						}
					})

					//catch mongoose error
					.catch(err => res.status(502).send(err))
			}
		})

		// catch validator error
		.catch(err => res.status(501).send(err))
}

exports.updateUser = (req, res) => {
	const validInput = new Validator(req.body, {
		email: "email|length:200",
		lastname: "string|length:150",
		firstname: "string|length:150",
		isAdmin: "boolean",
	})
	validInput
		.check()
		.then(valid => {
			if (!valid) {
				res.staus(403).json(validInput.errors)
			} else {
				// Had update this method because cannot use the id returned by the jwt
				const data = { ...req.body }
				const params = req.body.userId
				// const params = res.locals.userId
				// id récupéré dans le token = res.locals.userId
				User.findOneAndUpdate({ userId: params }, data)
					.then(e => {
						if (!e) {
							res.status(501).json({ message: "User update failed!" })
						} else {
							res.status(200).json({ message: "User updated successfuly!" })
						}
					})
					.catch(() => res.status(404).json({ error: "Internal servor error" }))
			}
		})
		.catch(() => res.status(500).json({ error: "Internal servor error" }))
}

exports.deleteUser = (req, res) => {
	// Get the user id to delete from token
	const params = res.locals.userId

	// findByIdAndDelete() uses the _id field instead of userId
	User.findOneAndDelete(params)
		.then(deleted => {
			if (!deleted) {
				//If there is no return from findByIdAndDelete ()
				res.status(400).json({ error: "User account does not exist" })
			} else {
				res.status(200).json({ message: "User account deleted successfuly" })
			}
		})

		// catch mongoose error
		.catch(err => res.status(500).send({ error: err }))
}

// exports.deleteAlluser = (req, res) => {
//     User.remove({fname: req.body.fname})
//     .then((e) => res.json(e))
//     .catch((err) => res.json(err))
// }
