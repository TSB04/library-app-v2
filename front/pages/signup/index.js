import * as React from "react"
import axios from "axios"
import Cookies from "universal-cookie"
import { Link, Typography } from "@mui/material"
import Form from "../../components/Form/Form.component"

function Signup() {
	const [error0, setError0] = React.useState("")
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
		imgInput: {
			input: "",
			helperText: "Please upload your profile picture",
			error: false,
		},
	})
	const handleConfirmPassword = () => {
		setFormValid(false)
		if (
			handleInputs.password.input === handleInputs.confirmPasswrd.input &&
			handleInputs.email.input !== ""
		) {
			setFormValid(true)
		} else if (handleInputs.confirmPasswrd.input === "") {
			setFormValid(false)
			setHandleInputs(prevState => ({
				...prevState,
				confirmPasswrd: {
					input: prevState.confirmPasswrd.input,
					helperText: "Please repeat your password",
					error: true,
				},
			}))
		} else {
			setFormValid(false)
			setHandleInputs(prevState => ({
				...prevState,
				confirmPasswrd: {
					input: prevState.confirmPasswrd.input,
					helperText: "Entered value differs from the password",
					error: true,
				},
			}))
		}
	}
	const handleChange = e => {
		setError0("")
		handleConfirmPassword()
		const { name, value } = e.target
		setHandleInputs(prevState => ({
			...prevState,
			[name]: {
				input: value,
				helperText: "",
				error: false,
			},
		}))
	}
	const handleSubmit = async event => {
		event.preventDefault()
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
			} else if (data.error0) {
				setError0(data.error0.message)
			} else if (data) {
				for (const [key, value] of Object.entries(data)) {
					setHandleInputs(prevState => ({
						...prevState,
						[key]: {
							input: "",
							helperText: value.message,
							error: true,
						},
					}))
				}
			} else throw new Error("Something went wrong, please try again later")
		} catch (err) {
			throw new Error(err)
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
				},
			})
		} catch (err) {
			throw new Error(err)
		}
	}

	return (
		<Form
			title="Sign Up"
			direction="column"
			md={6}
			mdOffset={3}
			rowGap={2}
			justifyContent="space-evenly"
			alignItems="center"
			iContainerRG={3}
			iContainerCG={1.5}
			iContainerD="row"
			iContainerJC="space-evenly"
			iContainerAI="center"
			valid={!formValid}
			handleChanges={handleChange}
			submit={handleSubmit}
			data={[
				{
					name: "fName",
					label: "First Name",
					type: "text",
					value: handleInputs.fName.input,
					helperText: handleInputs.fName.helperText,
					error: handleInputs.fName.error,
				},
				{
					name: "lName",
					label: "Last Name",
					type: "text",
					value: handleInputs.lName.input,
					helperText: handleInputs.lName.helperText,
					error: handleInputs.lName.error,
				},
				{
					name: "email",
					label: "Email",
					type: "email",
					value: handleInputs.email.input,
					helperText: handleInputs.email.helperText,
					error: handleInputs.email.error,
				},
				{
					name: "password",
					label: "Password",
					type: "password",
					value: handleInputs.password.input,
					helperText: handleInputs.password.helperText,
					error: handleInputs.password.error,
				},
				{
					name: "confirmPasswrd",
					label: "Confirm Password",
					type: "password",
					disabled: handleInputs.password.input === "" ? true : false,
					value: handleInputs.confirmPasswrd.input,
					helperText: handleInputs.confirmPasswrd.helperText,
					error: handleInputs.confirmPasswrd.error,
					handleBlur: () => handleConfirmPassword(),
				},
				{
					name: "imgInput",
					label: "Profile Picture",
					type: "file",
					variant: "standard",
					accept: ".jpg, .jpeg, .png",
					value: handleInputs.imgInput.input,
					helperText: handleInputs.imgInput.helperText,
					error: handleInputs.imgInput.error,
					handleBlur: e => uploadToClient(e),
				},
				// file input accept file types restriction only this way
				// 				<input				
				// 					accept=".jpeg, .jpg, .png, .gif, .webp"
				// 				/>
			]}
			children={
				<Link href="/login" underline="hover">
					<Typography variant="body2" color="primary" align="center">
						{error0}
					</Typography>
				</Link>
			}
		/>
	)
}
export default Signup
