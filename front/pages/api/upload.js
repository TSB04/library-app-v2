import multer from "multer"
import nc from "next-connect"
import path from "path"

export const config = {
    api: {
        bodyParser: false,
    },
}

const upload = multer({
    storage: multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(process.cwd(), "public", "uploads"));
    },
    filename: function (req, file, cb) {
        const imageName = req.cookies.isbn
        cb(null,  imageName + ".webp");
    },
    }),
});


const handler = nc({
    onError(err, req, res) {
        res.status(500).json({ error1: err.message });
        console.log(err.message)
    },
    onNoMatch(req, res) {
        res.status(404).json({ error: `Method '${req.method}' Not Allowed` });
    },
})
.use(upload.single("file"))
.post(async (req, res) => {
    res.status(200).json({ message: "success"+ req.body })
});    
  

export default handler
