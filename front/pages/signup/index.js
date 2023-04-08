import * as React from "react"
import Grid2 from "@mui/material/Unstable_Grid2/Grid2"
import { Grid, TextField, Typography, Button, List, ListItem } from "@mui/material"
import Theme from "../../theme/Theme"
import axios from "axios"
import Cookies from "universal-cookie"

const myStyle = {
	gridConatiner: {
		backgroundColor: Theme.palette.secondary.light,
		borderRadius: "8px",
		marginTop: "3%",
		padding: "2%",
	},
}

function Signup() {
	const [formValid, setFormValid] = React.useState(false)
	const [handleInputs, setHandleInputs] = React.useState({
		fName: {
			input: "",
			helperText: "Please enter your first name",
			error: false,
		},
		lName: {
			input: "",
			helperText: "Please enter your last name",
			error: false,
		},
		email: {
			input: "",
			helperText: "Please enter your email",
			error: false,
		},
		password: {
			input: "",
			helperText: "Please enter your password",
			error: false,
		},
		confirmPasswrd: {
			input: "",
			helperText: "Please repeat your password",
			error: true,
		},
	})

	const handleConfirmPassword = e => {
		setFormValid(false)
		if (
			handleInputs.password.input === e.target.value &&
			handleInputs.email.input !== ""
		) {
			setHandleInputs(prevState => ({
				...prevState,
				confirmPasswrd: {
					input: e.target.value,
					helperText: "",
					error: false,
				},
			}))
			setFormValid(true)
		} else {
			setFormValid(false)
			setHandleInputs(prevState => ({
				...prevState,
				confirmPasswrd: {
					input: e.target.value,
					helperText: "the entered value differs from the password",
					error: true,
				},
			}))
		}
	}

	const handleChange = e => {
		setFormValid(false)
		const { name, value } = e.target
		setHandleInputs(prevState => ({
			...prevState,
			[name]: {
				input: value,
				helperText: "Please enter a value",
				error: false,
			},
		}))
	}
	const handleSubmit = async event => {
		event.preventDefault()
        uploadToServer()
		const formData = {
			fname: handleInputs.fName.input,
			lname: handleInputs.lName.input,
			email: handleInputs.email.input,
			password: handleInputs.password.input,
		}
		try {
			const { data } = await axios({
				method: "POST",
				url: "/api/signin",
				data: formData,
			})
			if (data.message) {
                uploadToServer()
				window.alert(data.message)
				window.location.replace("/login")
                const cookies = new Cookies()
                cookies.remove("imgName")
			}
			else if (data.error) {
				if (data.error.code) {
					document.getElementById("error").innerHTML =
						"You already have an account, please login or reset your password if you have forgotten it"
				} else throw new Error("Something went wrong, please try again later")
			} else if (data) {
				setHandleInputs(prevState => ({
					...prevState,
					confirmPasswrd: {
						input: "",
						helperText: prevState.confirmPasswrd.helperText,
						error: true,
					},
				}))
				for (const [key, value] of Object.entries(data)) {
					setHandleInputs(prevState => ({
						...prevState,
						[key]: {
							input: prevState[key].input,
							helperText: value.message,
							error: true,
						},
					}))
				}
			} else throw new Error("Something went wrong, please try again later")
		} catch (err) {
			console.log({ error: err })
		}
	}
	React.useEffect(() => {
		if (handleInputs.confirmPasswrd && handleInputs.password.error === true) {
			document.getElementById("imgInput").style.display = "none"
		} else if (handleInputs.confirmPasswrd && handleInputs.password.error === false) {
			document.getElementById("imgInput").style.display = "block"
		}
	}, [handleInputs.password.error])
    const [image, setImage] = React.useState(null)   
    const uploadToClient = (event) => {
        if (event.target.files && event.target.files[0]) {
            const i = event.target.files[0]
            setImage(i)
        }
        return null
    }
    const uploadToServer = async (event) => {
        const cookie = new Cookies
        cookie.set("imgName", handleInputs.email.input)
        const body = new FormData()
        body.append("file", image)
        try {
            const { data } = await axios({
                method: "POST",
                url: "/api/upload",
                data: body,
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            })
            if (data) {
                console.log(data)
            }
        } catch (err) {
            return ({error: err})
        }
    }

	return (
		<Grid2
			container
			xs
			md={6.5}
			mdOffset={2.5}
			rowGap={2}
			columnGap={2}
			sx={myStyle.gridConatiner}
			justifyContent="center"
			alignItems="center"
		>
			<Typography variant="h3">Sign on</Typography>
			<Grid container item columnGap={4} justifyContent="center">
				{[
					{
						name: "fName",
						label: "First name",
						helperText: handleInputs.fName.helperText,
						error: handleInputs.fName.error,
					},
					{
						name: "lName",
						label: "Last name",
						helperText: handleInputs.lName.helperText,
						error: handleInputs.lName.error,
					},
					{
						name: "email",
						label: "Email",
						helperText: handleInputs.email.helperText,
						error: handleInputs.email.error,
					},
					{
						name: "password",
						label: "Password",
						helperText: handleInputs.password.helperText,
						error: handleInputs.password.error,
					},
				].map((item, index) => (
					<Grid item key={index}>
						<TextField
							size="small"
							type="input"
							fullWidth
							id="demo-helper-text-aligned"
							label={item.label}
							name={item.name}
							error={handleInputs[item.name].error}
							helperText={handleInputs[item.name].helperText}
							onChange={handleChange}
						/>
					</Grid>
				))}
				<Grid container item columnGap={4} justifyContent="flex-start" marginLeft={3}>
					{handleInputs.password.input && (
						<Grid item>
							<TextField
								size="small"
								fullWidth
								required
								type="password"
								id="demo-helper-text-aligned"
								label="Confirm password"
								name="confirm_password"
								value={handleInputs.confirmPasswrd.input}
								error={handleInputs.confirmPasswrd.error}
								helperText={handleInputs.confirmPasswrd.helperText}
								onChange={handleConfirmPassword}
							/>
						</Grid>
					)}
					<Grid item marginTop={2}>
						<input
							type="file"
							name="upload"
                            id="imgInput"
							accept=".jpeg, .jpg, .png, .gif, .webp"
							onChange={uploadToClient}
						/>
					</Grid>
				</Grid>
			</Grid>
			<Grid item marginTop={1.2}>
				<Button
					// disabled={!formValid}
					variant="contained"
					type="submit"
					onClick={handleSubmit}
				>
					Sign up
				</Button>
			</Grid>
			<Typography id="error" variant="warning" textAlign="center" />
		</Grid2>
	)
}
export default Signup
