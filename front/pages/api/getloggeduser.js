export default function GetLoggedUser(req, res) {
	const token = req.cookies.jwt
	fetch("http://localhost:4898/api/users/loggeduser", {
		method: "POST",
		headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" },
	})
		.then(response => response.json())
		.then(result => res.status(200).json(result))
}
