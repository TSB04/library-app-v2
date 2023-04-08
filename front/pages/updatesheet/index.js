import * as React from "react"
import Grid2 from "@mui/material/Unstable_Grid2/Grid2"
import { Grid, TextField, Typography, Button, Link } from "@mui/material"
import { useRouter } from "next/router"
import axios from "axios"
import Cookies from "universal-cookie"

const myStyle = {
	gridConatiner: {
		backgroundColor: "#F0F0F2",
		borderRadius: "8px",
		padding: "0.5% 2%",
		height: "max-content",
		marginTop: "-2%",
	},
}

function UpdateSheet() {
	const [inputs, setInputs] = React.useState({
		//grouping all the inputs params in the same const
		isbn: {
			input: "",
			helperText: "The book's isbn cannot be change",
			error: false,
		},
		title: {
			input: "",
			helperText: "Enter value to change the book's title",
			error: false,
		},
		desc: {
			input: "",
			helperText: "Enter value to change the book's description",
			error: false,
		},
		author: {
			input: "",
			helperText: "Enter value to change the book's author",
			error: false,
		},
		genre: {
			input: "",
			helperText: "Enter value to change the book's genre",
			error: false,
		},
		pbDate: {
			input: "",
			helperText: "Enter value to change the book's publication date",
			error: false,
		},
		nbPage: {
			input: "",
			helperText: "Enter value to change the number of book pages",
			error: false,
		},
		price: {
			input: "",
			helperText: "Enter value to change the book's price",
			error: false,
		},
		bkInStck: {
			input: "",
			helperText: "Enter value to change the number of books in your stock",
			error: false,
		},
	})
	// Get the sheet to update from back
	React.useEffect(() => {
		const cookie = new Cookies()
		const selectedCardIsbn = cookie.get("isbn")
		const param = { isbn: selectedCardIsbn }
		const getCardToUpdate = async () => {
			try {
				const { data } = await axios({
					method: "POST",
					url: "/api/getsheet",
					data: param,
				}).then(res => {
					if (res.data.error) {
						return res.data.error
					} else if (res.data) {
						for (const [key, value] of Object.entries(res.data[0])) {
							setInputs(prevState => ({
								...prevState,
								[key]: {
									input: value,
									helperText: "Enter values to change  to change old ones",
									error: false,
								},
							}))
						}
					}
				})
				return data
			} catch (err) {
				return { error: err }
			}
		}
		getCardToUpdate()
	}, [])
	const setPrice = param => {
		if (param) {
			if (!param.$numberDecimal) {
				return param
			} else {
				return param.$numberDecimal
			}
		}
		return param
	}
	const setDate = param => {
		if (param) {
			const date = Object(param).split("T")[0]
			return date
		}
		return null
	}
	const [hasChanged, setHasChanged] = React.useState(false)
	const handleChange = e => {
		const { name, value } = e.target
		setInputs(prevState => ({
			...prevState,
			[name]: {
				input: value,
				helperText: prevState[name].helperText,
				error: false,
			},
		}))
		setHasChanged(true)
		setError0("")
	}
	const handleUpdate = async event => {
		event.preventDefault()
		const formData = {
			isbn: inputs.isbn.input,
			title: inputs.title.input,
			desc: inputs.desc.input,
			author: inputs.author.input,
			genre: inputs.genre.input,
			pbDate: setDate(inputs.pbDate.input),
			nbPage: `${inputs.nbPage.input}`,
			price: setPrice(inputs.price.input),
			bkInStck: `${inputs.bkInStck.input}`,
		}
		if (
			formData.isbn !== "" &&
			formData.title !== "" &&
			formData.desc !== "" &&
			formData.author !== "" &&
			formData.genre !== "" &&
			formData.pbDate !== "" &&
			formData.nbPage !== "" &&
			formData.price !== "" &&
			formData.bkInStck !== ""
		) {
			try {
				const { data } = await axios({
					method: "PUT",
					url: "/api/updatesheet",
					data: formData,
				})
				if (data.message) {
					uploadToServer()
					window.alert(data.message)
					window.location.replace("/")
					const cookie = new Cookies()
					cookie.remove("imgName")
					cookie.remove("isbn")
				} else if (data) {
					console.log(data)
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
				return { error: err }
			}
		} else {
			setError1("Please fill all the fields")
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
			await axios({
				method: "POST",
				url: "/api/upload",
				data: body,
				headers: {
					"Content-Type": "multipart/form-data",
				},
			}).then(res => {
				console.log(res)
			})
		} catch (err) {
			return { error: err }
		}
	}
	const [error0, setError0] = React.useState("")
	const [error1, setError1] = React.useState("")
	const router = useRouter()
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
				<Typography variant="h3">Update Sheet</Typography>
			</Grid>
			<Typography color="error">{error1}</Typography>
			<Grid container rowGap={3}>
				<Grid
					container
					direction="row"
					justifyContent="space-between"
					alignItems="center"
				>
					<Grid>
						<TextField
							variant="standard"
							size="small"
							id="standard-read-only-input"
							label="isbn"
							name="isbn"
							value={inputs.isbn.input}
							error={inputs.isbn.error}
							helperText="The book's isbn cannot be change"
						/>
					</Grid>
					<Grid>
						<TextField
							variant="standard"
							size="small"
							id="standard-helperText"
							label="Title"
							name="title"
							value={inputs.title.input}
							error={inputs.title.error}
							helperText={inputs.title.helperText}
							onChange={handleChange}
						/>
					</Grid>
					<Grid>
						<TextField
							variant="standard"
							size="small"
							id="standard-helperText"
							label="Author"
							name="author"
							value={inputs.author.input}
							error={inputs.author.error}
							helperText={inputs.author.helperText}
							onChange={handleChange}
						/>
					</Grid>
				</Grid>
				<Grid
					container
					direction="row"
					justifyContent="space-between"
					alignItems="center"
				>
					<Grid>
						<TextField
							variant="standard"
							size="small"
							id="standard-helperText"
							label="Genre"
							name="genre"
							value={inputs.genre.input}
							error={inputs.genre.error}
							helperText={inputs.genre.helperText}
							onChange={handleChange}
						/>
					</Grid>
					<Grid>
						<TextField
							variant="standard"
							size="small"
							id="standard-helperText"
							label="Number of pages"
							name="nbPage"
							value={inputs.nbPage.input}
							error={inputs.nbPage.error}
							helperText={inputs.nbPage.helperText}
							onChange={handleChange}
						/>
					</Grid>
					<Grid>
						<TextField
							focused
							variant="standard"
							size="small"
							id="standard-helperText"
							label="Publication date"
							name="pbDate"
							type="date"
							format="yyyy-MM-ddT00:00:00.000Z"
							value={setDate(inputs.pbDate.input)}
							error={inputs.pbDate.error}
							helperText={inputs.pbDate.helperText}
							onChange={handleChange}
						/>
					</Grid>
				</Grid>
				<Grid container direction="row" justifyContent="space-evenly" alignItems="center">
					<Grid>
						<TextField
							variant="standard"
							size="small"
							id="standard-helperText"
							label="Price"
							name="price"
							value={setPrice(inputs.price.input)}
							error={inputs.price.error}
							helperText={inputs.price.helperText}
							onChange={handleChange}
						/>
					</Grid>
					<Grid>
						<TextField
							variant="standard"
							size="small"
							id="standard-helperText"
							label="Book in stock"
							name="bkInStck"
							value={inputs.bkInStck.input}
							error={inputs.bkInStck.error}
							helperText={inputs.bkInStck.helperText}
							onChange={handleChange}
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
					variant="standard"
					id="standard-helperText"
					label="Description"
					name="desc"
					value={inputs.desc.input}
					error={inputs.desc.error}
					helperText={inputs.desc.helperText}
					onChange={handleChange}
				/>
			</Grid2>
			<Grid item marginTop={1}>
				{hasChanged === false && (
					<Button variant="outlined" type="cancel" onClick={() => router.back()}>
						Cancel
					</Button>
				)}
				{hasChanged === true && (
					<Button variant="contained" type="submit" onClick={handleUpdate}>
						Update
					</Button>
				)}
			</Grid>
			<Link href="/login" underline="hover" color="primary">
				<Typography color="primary">{error0}</Typography>
			</Link>
		</Grid2>
	)
}
export default UpdateSheet
