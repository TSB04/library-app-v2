import * as React from "react"
import { Box, Card, CardContent, CardMedia, Typography, Grid, CardActions, IconButton, Popover, ButtonBase } from "@mui/material"
import { Block, Delete, Edit, Visibility } from "@mui/icons-material"
import { styled, alpha } from '@mui/material/styles'
import Theme from "../../theme/Theme"
import axios from "axios"

const myStyle = {
    padding: "1% 0 0 0.5%",
    position: "absolute",
    left: "13.3%",
    width: "86.7%",
    maxHeight: "90vh",
    overflow: "auto",
    card: {
        display: "inline-block",
        width: "32vh",
        margin:"1vh",
        padding: "0", 
        backgroundColor: Theme.palette.secondary.dark,
        textAlign: "center"
    },
    media: {
        height: "15vh",
    }
}

const StyledButtonBase = styled(ButtonBase)(({theme}) => ({
    padding: theme.spacing(0, 1.3, 1, 0),
    textAlign: "start"
}))

function Users() {
    const [ users, setUsers ] = React.useState(null)
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        const selectedUser = Object.values(event.currentTarget.children[0].innerText.split(/\r?\n/))
        console.log(selectedUser)
        sessionStorage.setItem("selectedUserFName", selectedUser[0])
        sessionStorage.setItem("selectedUserLName", selectedUser[1])
        sessionStorage.setItem("selectedUserEmail", selectedUser[5])
        sessionStorage.setItem("selectedUserId", selectedUser[3])
    };
  
    const handleClose = () => {
        setAnchorEl(null);
        sessionStorage.removeItem("selectedUserFName")
        sessionStorage.removeItem("selectedUserLName")
        sessionStorage.removeItem("selectedUserEmail")
        sessionStorage.removeItem("selectedUserId")
    };
  
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const handleBlock = async (event) => {
   
    }

    const handleEditUser = async (event) => {
        const userIdToUpdate = sessionStorage.getItem("selectedUserId")
        const formData = {userId: userIdToUpdate, lname: "Barry"}
        try {
            const { data } = await axios ({
                method: "PUT",
                url: "/api/updateuser",
                data: formData
            })
            console.log(data)
        } catch (err) {
            console.log({error: err})
        }
    }

    const handleGetUser = async () => {
        const emailUserToGet = sessionStorage.getItem("selectedUserEmail")
        const formData = {email: emailUserToGet}
        try {
            const { data } = await axios ({
                method: "POST",
                url: "/api/getuser",
                data: formData
            })
            console.log(data)
        } catch (err) {
            console.log({error: err})
        }
    }

    React.useEffect(() => {
        fetch('http://localhost:4898/api/users/all')
        .then(response => response.json())
        .then(data => {setUsers(data)})
    },[])
    console.log(users)

    return (  
        <Box style={myStyle}>
            {users && users.map(user =>
                <StyledButtonBase  aria-describedby={id} variant="contained" onClick={handleClick} key={user.email}>
                    <Card sx={myStyle.card}>
                        <Grid container  direction="row" justifyContent="space-between">
                            <Grid item xs={7} height="16vh" >
                                <CardContent sx={{ flex: '1 0 auto' }} name="myCardContentHead">
                                    <Typography component="div" variant="h6">
                                        {user.fname}
                                    </Typography>
                                    <Typography variant="h7" component="div" >
                                        {user.lname}
                                    </Typography>
                                    <Typography variant="h8"  component="div" >
                                        {user.isAdmin}
                                    </Typography>
                                </CardContent>
                            </Grid>

                            <Grid item xs={5}>
                                <CardMedia
                                component="img"
                                image="/icon.png"
                                alt="Live from space album cover"
                                style={myStyle.media}
                                />
                                <Typography sx={{fontSize: "2px"}}>{user.userId}</Typography>

                            </Grid>
                        </Grid>
                        <CardContent padding="-5vh" >
                            <Typography variant="h8" component="div" margin="-3vh 0">
                                {user.email}
                            </Typography>
                        </CardContent>
                    </Card>
                    
                </StyledButtonBase> 
            )}
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorReference="anchorEl"
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                sx={{"& .MuiPopover-paper": {
                        backgroundColor:Theme.palette.primary.main,
                        borderRadius: 3,
                        width: "12%"
                    }
                }}
            >
                <Grid container justifyContent="space-evenly" alignItems="center">
                    <IconButton onClick={handleEditUser}>
                        <Edit/>
                    </IconButton>
                    <IconButton onClick={handleGetUser}>
                        <Visibility/>
                    </IconButton>
                    <IconButton onClick={handleBlock}>
                        <Block color="warning"/>
                    </IconButton>
                </Grid>
            </Popover>

        </Box>        
    )
}

export default Users