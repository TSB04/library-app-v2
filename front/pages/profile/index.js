import React from "react"
import axios from "axios"
import Form from "../../components/Form/Form.component"

function Profile() {
	const [handleInputs, setHandleInputs] = React.useState({
		fname: {
			input: "",
			error: false,
		},
		lname: {
			input: "",
			error: false,
		},
		email: {
			input: "",
			error: false,
		},
	})

	const [user, setUser] = React.useState({})
	React.useEffect(() => {
		console.log("Profile page")
		try {
			axios({
				method: "POST",
				url: "/api/getloggeduser",
			}).then(res => {
				console.log(res.data)
				setUser(res.data[0])

				for (let [key, value] of Object.entries(res.data[0])) {
					setHandleInputs(prevState => ({
						...prevState,
						[key]: {
							input: value,
							error: false,
						},
					}))
				}
			})
		} catch (err) {
			throw { error: err }
		}
	}, [])
	const handleChange = e => {
		const { name, value } = e.target
		setHandleInputs(prevState => ({
			...prevState,
			[name]: {
				input: value,
				error: false,
			},
		}))
	}
	const handleSubmit = () => {
		console.log(handleInputs)
		const formData = {
			fname: handleInputs.fname.input,
			lname: handleInputs.lname.input,
			email: handleInputs.email.input,
		}
		try {
			axios({
				method: "POST",
				url: "/api/updateuser",
				data: formData,
			}).then(res => {
				console.log(res)
			})
		} catch (err) {
			throw {error: err}
		}
	}

	return (
		<>
			<Form
				title="Profile"
				md={6}
				mdOffset={3}
				rowGap={2}
				direction="column"
				justifyContent="space-evenly"
				alignItems="center"
				iContainerRG={3}
				iContainerCG={1.5}
				iContainerD="row"
				iContainerJC="space-evenly"
				iContainerAI="center"
				handleChanges={handleChange}
				data={[
					{
						label: "First Name",
						name: "fname",
						type: "text",
						variant: "standard",
						defaultValue: user.fname,
						value: handleInputs.fname.input,
					},
					{
						label: "Last Name",
						name: "lname",
						type: "text",
						variant: "standard",
						defaultValue: user.lname,
						value: handleInputs.lname.input,
					},
					{
						label: "Email",
						name: "email",
						type: "email",
						variant: "standard",
						defaultValue: user.email,
						value: handleInputs.email.input,
					},
				]}
				submitBtnTitle="Update"
				submit={handleSubmit}
			/>
		</>
	)
}

export default Profile
