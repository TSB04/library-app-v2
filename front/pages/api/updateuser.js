export default function UpdateUser(req, res) {
	const token = req.cookies.jwt
	fetch("http://localhost:4898/api/users/update", {
		method: "PUT",
		headers: { "Content-Type": "application/json", Authorization: "Bearer " + token},
		body: JSON.stringify(req.body),
	})
		.then(response => response.json())
		.then(result => res.status(200).json(result))
}
