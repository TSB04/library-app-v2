import * as React from "react"
import Grid2 from "@mui/material/Unstable_Grid2/Grid2"
import { Grid, TextField, Typography, Button, Link } from "@mui/material"
import axios from "axios"
import Cookies from "universal-cookie"

const myStyle = {
	gridConatiner: {
		backgroundColor: "#F0F0F2",
		borderRadius: "8px",
		padding: "0.5% 0",
		height: "max-content",
		marginTop: "-1%",
	},
}

function AddSheet() {
	const [inputs, setInputs] = React.useState({
		isbn: {
			input: "",
			helperText: "Please enter the book's isbn",
			error: false,
		},
		title: {
			input: "",
			helperText: "Please enter the book's title",
			error: false,
		},
		desc: {
			input: "",
			helperText: "Please enter the book's description",
			error: false,
		},
		author: {
			input: "",
			helperText: "Please enter the book's author",
			error: false,
		},
		genre: {
			input: "",
			helperText: "Please enter the book's genre",
			error: false,
		},
		pbDate: {
			input: "",
			helperText: "Please enter the book's publication date",
			error: false,
		},
		nbPage: {
			input: "",
			helperText: "Please enter the number of book pages",
			error: false,
		},
		price: {
			input: "",
			helperText: "Please enter the book's price",
			error: false,
		},
		bkInStck: {
			input: "",
			helperText: "Please enter the number of books in stock",
			error: false,
		},
	})

	const [error0, setError0] = React.useState("")
	const handleChange = e => {
		console.log(inputs)
		const { name, value } = e.target
		setInputs(prevState => ({
			...prevState,
			[name]: {
				input: value,
				helperText: prevState[name].helperText,
				error: false,
			},
		}))
	}
	const handleSubmit = async event => {
		event.preventDefault()
		const formData = {
			isbn: inputs.isbn.input,
			title: inputs.title.input,
			desc: inputs.desc.input,
			author: inputs.author.input,
			genre: inputs.genre.input,
			pbDate: inputs.pbDate.input,
			nbPage: inputs.nbPage.input,
			price: inputs.price.input,
			bkInStck: inputs.bkInStck.input,
		}
		try {
			const { data } = await axios({
				method: "POST",
				url: "/api/addsheet",
				data: formData,
			})
			setError0("")
			if (data.message) {
				uploadToServer()
				window.alert(data.message)
				window.location.replace("/")
				const cookie = new Cookies()
				cookie.remove("imgName")
			} else if (data.error === 0) {
				setError0("You must log in to create a sheet !!")
			} else if (data) {
				for (let [key, value] of Object.entries(data)) {
					setInputs(prevState => ({
						...prevState,
						[key]: {
							input: prevState[key].input,
							helperText: value.message,
							error: true,
						},
					}))
				}
			}
		} catch (err) {
			console.log({ error: err })
		}
	}
	const [image, setImage] = React.useState(null)
	const uploadToClient = event => {
		if (event.target.files && event.target.files[0]) {
			const i = event.target.files[0]
			setImage(i)
		}
		return null
	}
	const uploadToServer = async () => {
		const cookie = new Cookies()
		cookie.set("imgName", inputs.isbn.input)
		const body = new FormData()
		body.append("file", image)
		try {
			const { data } = await axios({
				method: "POST",
				url: "/api/upload",
				data: body,
				headers: {
					"Content-Type": "multipart/form-data",
				},
			})
		} catch (err) {
			return { error: err }
		}
	}
	return (
		<Grid2
			container
			xs
			md={9}
			mdOffset={1}
			rowGap={1}
			sx={myStyle.gridConatiner}
			justifyContent="space-evenly"
			alignItems="center"
			direction="column"
		>
			<Grid item>
				<Typography variant="h3">Create a new Sheet</Typography>
			</Grid>
			<Grid container rowGap={3}>
				<Grid container direction="row" justifyContent="space-evenly" alignItems="center">
					<Grid>
						<TextField
							required
							fullWidth
							type="input"
							id="demo-helper-text-aligned"
							label="isbn"
							name="isbn"
							error={inputs.isbn.error}
							helperText={inputs.isbn.helperText}
							onBlur={handleChange}
						/>
					</Grid>
					<Grid>
						<TextField
							required
							fullWidth
							type="input"
							id="demo-helper-text-aligned"
							label="Title"
							name="title"
							error={inputs.title.error}
							helperText={inputs.title.helperText}
							onBlur={handleChange}
						/>
					</Grid>
					<Grid>
						<TextField
							required
							fullWidth
							type="input"
							id="demo-helper-text-aligned"
							label="Author"
							name="author"
							error={inputs.author.error}
							helperText={inputs.author.helperText}
							onBlur={handleChange}
						/>
					</Grid>
				</Grid>
				<Grid container direction="row" justifyContent="space-evenly" alignItems="center">
					<Grid>
						<TextField
							required
							fullWidth
							type="input"
							id="demo-helper-text-aligned"
							label="Genre"
							name="genre"
							error={inputs.genre.error}
							helperText={inputs.genre.helperText}
							onBlur={handleChange}
						/>
					</Grid>
					<Grid>
						<TextField
							fullWidth
							required
							type="input"
							id="demo-helper-text-aligned"
							label="Number of pages"
							name="nbPage"
							error={inputs.nbPage.error}
							helperText={inputs.nbPage.helperText}
							onBlur={handleChange}
						/>
					</Grid>
					<Grid>
						<TextField
							fullWidth
							focused
							required
							id="demo-helper-text-aligned"
							label="Publication date"
							name="pbDate"
							type="date"
							error={inputs.pbDate.error}
							helperText={inputs.pbDate.helperText}
							onBlur={handleChange}
						/>
					</Grid>
				</Grid>
				<Grid container direction="row" justifyContent="space-evenly" alignItems="center">
					<Grid>
						<TextField
							required
							fullWidth
							type="input"
							id="demo-helper-text-aligned"
							label="Price"
							name="price"
							error={inputs.price.error}
							helperText={inputs.price.helperText}
							onBlur={handleChange}
						/>
					</Grid>
					<Grid>
						<TextField
							fullWidth
							required
							id="demo-helper-text-aligned"
							label="Book in stock"
							name="bkInStck"
							type="input"
							error={inputs.bkInStck.error}
							helperText={inputs.bkInStck.helperText}
							onBlur={handleChange}
						/>
					</Grid>
					<Grid>
						<input
							type="file"
							name="upload"
							accept=".jpeg, .jpg, .png, .gif, .webp"
							onChange={uploadToClient}
						/>
					</Grid>
				</Grid>
			</Grid>
			<Grid2 container xs md={8.5} maxHeight="30vh" marginTop="2vh">
				<TextField
					multiline
					required
					maxRows={8}
					sx={{ width: "100%", height: "80%" }}
					id="outlined-multiline-static"
					label="Description"
					name="desc"
					error={inputs.desc.error}
					helperText={inputs.desc.helperText}
					onBlur={handleChange}
				/>
			</Grid2>
			<Grid item>
				<Button variant="contained" type="submit" onClick={handleSubmit}>
					{" "}
					Create sheet{" "}
				</Button>
			</Grid>

			<Link href="/login" underline="hover" color="primary">
				<Typography color="primary">{error0}</Typography>
			</Link>
		</Grid2>
	)
}
export default AddSheet
