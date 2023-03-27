import * as React from "react"
import axios from "axios"
import Grid2 from "@mui/material/Unstable_Grid2/Grid2"
import { Button, Grid, Typography } from "@mui/material"
import Cookies from "universal-cookie"


const myStyle = {
    gridConatiner: {
        backgroundColor: "#F0F0F2",
        borderRadius: "8px",
        padding: "0.5% 2%",
        height: "max-content",
        marginTop: "2%"
    },
}

function Profile() {

    const handleDelete = async (event) => {
        event.preventDefault()
        try {
            const { data } = await axios ({
                method: "DELETE",
                url: "/api/deleteuser",
            })
            if (data.message) {
                sessionStorage.clear()
                const cookie = new Cookies
                cookie.remove("jwt")
                window.alert(data.message)
                window.location.replace("/")
            }
        } catch (err) {
            console.log({error: err})
        }
    }

    return(
        <Grid2 container xs md={9} mdOffset={-1} rowGap={4} sx={myStyle.gridConatiner} 
            justifyContent="space-evenly" alignItems="center" direction="column"
        >        
        <Typography variant="warning">Note: Deleting your account is irreversible !!!</Typography>
        <Typography variant="h4">Please confirm the account deletion!</Typography>

        <Grid container justifyContent="center" columnGap={4}>
            <Button variant="contained" sx={myStyle.non}>Non</Button>
            <Button variant="contained" sx={myStyle.yes} onClick={handleDelete}>Yes</Button>
        </Grid>
        </Grid2>
    )
}

export default Profile