import * as React from "react"
import Grid2 from "@mui/material/Unstable_Grid2/Grid2"
import { Grid, TextField, Typography, Button } from "@mui/material"
import Theme from "../../theme/Theme"
import axios from "axios"


const myStyle = {
    gridConatiner: {
        backgroundColor: Theme.palette.secondary.light,
        borderRadius: "8px",
        height: "max-content",
        marginTop: "2%"
    },
}




function Signup () {

    const [formValid, setFormValid] = React.useState(false)
    const [handleInputs, setHandleInputs] = React.useState({
        fName:{
            input: "",
            helperText: "Please enter your first name",
            error: false
        },
        lName:{
            input: "",
            helperText: "Please enter your last name",
            error: false
        },
        email:{
            input: "",
            helperText: "Please enter your email",
            error: false
        },
        password:{
            input: "",
            helperText: "Please enter your password",
            error: false
        },
        confirmPasswrd:{
            input: "",
            helperText: "Please repeat your password",
            error: true
        }
    })

    const handleConfirmPassword = (e) => {
        setFormValid(false)
        if (handleInputs.password.input === e.target.value) {
            setFormValid(true)
            setHandleInputs(prevState => ({
                ...prevState, confirmPasswrd: {
                    input: e.target.value,
                    helperText: "",
                    error: false
                }
            }))
        } else if (handleInputs.password.input !== e.target.value) {
            setFormValid(false)
            setHandleInputs(prevState => ({
                ...prevState, confirmPasswrd: {
                    input: e.target.value,
                    helperText: "the entered value differs from the password",
                    error: true
                }
            }))
        }
    }

    const handleChange = (e) => {
        setFormValid(false)
        const {name, value} = e.target
        setHandleInputs(prevState => ({
            ...prevState, [name]: {
                input: value,
                // helperText: prevState.name.helperText,
                error: false
            }
        }))
    }
        

    const handleSubmit = async (event) => {
        event.preventDefault()

         const formData = {
            fname: handleInputs.fName.input,
            lname: handleInputs.lName.input,
            email: handleInputs.email.input,
            password: handleInputs.password.input
        }
        try {
            const { data } = await axios({
                method: "POST",
                url: "/api/signin",
                data: formData
            })
            if (data.message) {
                window.alert(data.message)
                window.location.replace('/login')
            } else if(data.email) {
                setHandleInputs(prevState =>({
                    ...prevState, email :{
                        input: prevState.email.input,
                        helperText: data.email.message,
                        error: true
                    }
                }))
            } else if(data.password) {
                setHandleInputs(prevState =>({
                    ...prevState, password :{
                        input: prevState.password.input,
                        helperText: data.password.message,
                        error: true
                    }
                }))
            } else if(data.error) {
                if(data.error.code) {
                    document.getElementById("error").innerHTML = "You already have an account, please login or reset your password if you have forgotten it"
                } else if(data.error.message) {
                     document.getElementById("error").innerHTML = 
                    "Password must be between 6 and 16 characters long, must contain upper case letters, lower case letters, numbers and must not contain spaces, symbols or successive characters."
                }
            }
        } catch (err) {
            console.log({error: err})
        }
    }
    
    return (

        <Grid2 container xs md={4} mdOffset={-2} rowGap={2}  sx={myStyle.gridConatiner} 
            justifyContent="space-evenly" alignItems="center" direction="column"
        >
            <Grid item>
                <Typography variant="h3" >
                    Sign on
                </Typography>
            </Grid>
            <Grid item width="80%">
                <TextField
                    size="small"
                    fullWidth
                    type="input"
                    id="demo-helper-text-aligned"
                    label="First name"
                    name="fName"
                    error={handleInputs.fName.error}
                    helperText={handleInputs.fName.helperText}
                    onBlur={handleChange}
                />
            </Grid>
            <Grid item width="80%">
                <TextField
                    size="small"
                    fullWidth
                    type="input"
                    id="demo-helper-text-aligned"
                    label="Last name"
                    name="lName"
                    error={handleInputs.lName.error}
                    helperText={handleInputs.lName.helperText}
                    onBlur={handleChange}
                />
            </Grid>
            <Grid item width="80%">
                <TextField
                    size="small"
                    fullWidth
                    required
                    id="demo-helper-text-aligned"
                    label="email"
                    name="email"
                    type="email"
                    error={handleInputs.email.error}
                    helperText={handleInputs.email.helperText}
                    onBlur={ handleChange}
                />
            </Grid>
            <Grid item width="80%">
                <TextField
                    size="small"
                    fullWidth
                    required
                    type="password"
                    id="demo-helper-text-aligned"
                    label="Password"
                    name="password" 
                    error={handleInputs.password.error}
                    helperText={handleInputs.password.helperText}
                    onChange={handleChange}
                />
            </Grid>
            {handleInputs.password.input && 
                <Grid item width="80%">
                    <TextField
                        size="small"
                        fullWidth
                        required
                        type="password"
                        id="demo-helper-text-aligned"
                        label="Confirm password"
                        name="confirm_password"
                        error={handleInputs.confirmPasswrd.error}
                        helperText={handleInputs.confirmPasswrd.helperText}
                        onChange={handleConfirmPassword}
                    />
                </Grid>
            }
            <Grid item>
                <Button disabled={!formValid} variant="contained" type="submit" onClick={handleSubmit} > Sign up </Button>
            </Grid>
            <Typography id="error"  variant="warning" textAlign="center"/>
        </Grid2>
    )
}
export default Signup