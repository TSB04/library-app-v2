export default function Deletesheet(req, res) {
    const token = req.cookies.jwt 
    fetch(("http://localhost:4898/api/books/remove"),{
        method: "DELETE",
        headers: {"Authorization": "Bearer "+token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(req.body)
    })
    .then(response => response.json())
    .then(result => res.status(200).json(result))
}