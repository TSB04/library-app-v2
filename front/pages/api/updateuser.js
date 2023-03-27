export default function UpdateUser(req, res) {
    fetch(("http://localhost:4898/api/users/update"),{
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(req.body)
    })
    .then(response => response.json())
    .then(result => res.status(200).json(result))
}