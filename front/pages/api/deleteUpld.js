import fs from "fs"
import path from "path"

const remove = (req, res) => {
	const param = req.body.isbn
	const fileName = param + ".webp"
	const directoryPath = path.join(process.cwd(), "public", "uploads/")

	fs.unlink(directoryPath + fileName, err => {
		if (err) {
			res.status(500).send({
				message: "Could not delete the file. " + err,
			})
		}
		res.status(200).send({
			message: "File is deleted.",
		})
	})
}
export default remove
