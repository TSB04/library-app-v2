import React from "react"
import axios from "axios"
import Cookies from "universal-cookie"
import {Link, Typography} from "@mui/material"
import Form from "../../components/Form/Form.component"

function Login() {
	const [error0, setError0] = React.useState("Don't have an account yet !!!")
	const [error0C, setError0C] = React.useState(0)
	const [handleInputs, setHandleInputs] = React.useState({
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
	})
	const handleChange = e => {
		const { name, value } = e.target
		setHandleInputs(prevState => ({
			...prevState,
			[name]: {
				input: value,
				helperText: "Please enter your " + name,
				error: false,
			},
		}))
	}
	const handleSubmit = async event => {
		event.preventDefault()
		const formData = {
			email: handleInputs.email.input,
			password: handleInputs.password.input,
		}
		try {
			const { data } = await axios({
				method: "POST",
				url: "/api/login",
				data: formData,
			})
			if (data) {
				if (data.message) {
					const cookie = new Cookies()
					cookie.set("jwt", data.token)
					sessionStorage.setItem("jwt", data.token)
					sessionStorage.setItem("fname", data.fName)
					sessionStorage.setItem("lname", data.lName)
					sessionStorage.setItem("userId", data.userId)
					sessionStorage.setItem("email", data.email)
					if (data.isAdmin === true) {
						sessionStorage.setItem("userPrvlge", data.isAdmin)
					}
					window.alert(data.message)
					window.location.replace("/")
				} else if (data){
					for (let [key, value] of Object.entries(data)) {
						setHandleInputs(prevState => ({
							...prevState,
							[key]: {
								input: prevState[key].input,
								helperText: data[key].message,
								error: true,
							},
						}))
					}
					if (data.password) {
						setError0C(1)
						setError0("forgot your password ???")
					} else if(data.email) {
						setError0C(0)
						setError0("Don't have an account yet !!!")

					}
				} else {
					throw {error: "Something went wrong"}
				}
			} else {
				throw  {error: "the servor doesn't respond"}
			}
		} catch (err) {
			throw {error: err}
		}
	}
	return (
		<Form
			title="Log in"
			direction="column"
			md={4}
			mdOffset={4}
			rowGap={2}
			iContainerRG={3}
			justifyContent="space-evenly"
			alignItems="center"
			iContainerD="column"
			iContainerJC="space-evenly"
			iContainerAI="center"
			handleChanges={handleChange}
			submit={handleSubmit}
			data={[{
					type: "email",
					label: "email",
					name: "email",
					value: handleInputs.email.input,
					helperText: handleInputs.email.helperText,
					error: handleInputs.email.error,
				},
				{
					type: "password",
					label: "Password",
					name: "password",
					value: handleInputs.password.input,
					helperText: handleInputs.password.helperText,
					error: handleInputs.password.error,
				},
			]}
			link={
				<Link href={error0C === 0 ? "/signup" : "/#"} underline="hover">
					{error0C === 0 ? (
						<Typography variant="body2" color="primary">
							{error0}
						</Typography>
					) : (
						<Typography variant="body2" color="error">
							{error0}
						</Typography>
					)}
				</Link>
			}
		/>
		
	)
}
export default Login
