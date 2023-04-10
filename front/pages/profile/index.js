import * as React from "react"
import axios from "axios"
import Form from "../../components/Form/Form.component"

function Profile() {
	const [handleInputs, setHandleInputs] = React.useState({
		fname: {
			input: "",
			helperText: "Please enter your first name",
			error: false,
		},
		lname: {
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
			input: "password",
			helperText: "Please enter your password",
			error: false,
		},
	})
	React.useEffect(() => {
		const userEmail = sessionStorage.getItem("email")
		const param = { email: userEmail }
		const getUser = async () => {
			try {
				await axios({
					method: "POST",
					url: "/api/getuser",
					data: param,
				}).then(res => {
					if (res.data) {
						for (const [key, value] of Object.entries(res.data[0])) {
							setHandleInputs(prevState => ({
								...prevState,
								[key]: {
									input: value,
									helperText: prevState[key].helperText,
									error: false,
								},
							}))
						}
					}
				})
			} catch (err) {
				throw { error: err}
			}
		}
		getUser()
	}, [])
	const handleChange = e => {
		const { name, value } = e.target
		setHandleInputs(prevState => ({
			...prevState,
			[name]: {
				input: value,
				helperText: prevState[name].helperText,
				error: false,
			},
		}))
	}
	console.log(handleInputs)
	return (
		<Form
			title="Profile"
			direction="column"
			md={6.5}
			mdOffset={2}
			rowGap={2}
			justifyContent="space-evenly"
			alignItems="center"
			iContainerRG={3}
			iContainerD="row"
			iContainerJC="space-evenly"
			iContainerAI="center"
			// valid={!formValid}
			handleChanges={handleChange}
			// submit={handleSubmit}
			buttonSubmit="Update"
			data={[
				{
					label: "First Name",
					name: "fname",
					type: "text",
					variant: "standard",
					defaultValue: handleInputs.fname.input,
					error: handleInputs.fname.error,
				},
				{
					label: "Last Name",
					name: "lname",
					type: "text",
					variant: "standard",
					defaultValue: handleInputs.lname.input,
					error: handleInputs.lname.error,
				},
				{
					label: "Email",
					name: "email",
					type: "email",
					variant: "standard",
					defaultValue: handleInputs.email.input,
					error: handleInputs.email.error,
				},
				{
					label: "Password",
					name: "password",
					type: "password",
					variant: "standard",
					defaultValue: handleInputs.password.input,
					error: handleInputs.password.error,
				},
				
				
			]}
		/>
	)
}
export default Profile
