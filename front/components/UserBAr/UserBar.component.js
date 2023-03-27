import * as React from "react"
import { Typography, Avatar, Grid, List, ListItemButton, ListItemText } from "@mui/material"
import { AutoStories, Settings, PersonPin, LibraryAdd, People } from '@mui/icons-material'
import Link from "next/link"
import Theme from "../../theme/Theme"


const myStyle = {
    container: {
        backgroundColor: Theme.palette.primary.main,
        borderRadius: "5px",
    },
    avatarContainer: {
        textAlign:"center",
        avatar: {
            width: "60%",
            height: "60%",
            margin: "8% 20%",
        }
    },
    border: {
        background: "linear-gradient(90deg, rgba(95,48,19,1) 0%, rgba(38,22,12,1) 50%, rgba(95,48,19,1) 100%)",
        height: "0.2vh",
        margin: "10% 0 0 0"
    },
    logout: {
        margin: "0 0 20% 28%",
        backgroundColor: "primary",
        button: {
            height: "10vh",
            width: "10vh",
        }
    }
}



const UserBar = () => {
    const [selected, setSelected] = React.useState(0)
    const [hasPrvlge, setHasPrvlge] = React.useState(false)
    const userPrvlge = sessionStorage.getItem("userPrvlge")
    React.useEffect(() => {
        if (userPrvlge) {
            setHasPrvlge(true)
        }
    }, [])
    
    return (
        <Grid container direction="column"  sx={myStyle.container}>
            <Grid item xs={4} component="div" sx={myStyle.avatarContainer}>
                <Avatar alt="User Nom" src=""  sx={myStyle.avatarContainer.avatar}/>
                <Typography variant="h5">{sessionStorage.getItem("fname")}</Typography>
            </Grid>
            <div style={myStyle.border}/>
            <Grid item xs={5.90} >
                <List disablePadding>
                    <ListItemButton selected={selected === 1} onClick={_=>setSelected(1)}>
                        <Link href="/mysheets">
                            <ListItemText disableTypography  
                                primary={<Typography variant="h5">My sheets</Typography>} 
                                secondary={<AutoStories color="secondary"/>}
                            />
                        </Link>
                    </ListItemButton>

                    <ListItemButton selected={selected === 2} onClick={_=>setSelected(2)}>
                        <Link href="/sheetadd">
                            <ListItemText disableTypography  
                                primary={<Typography variant="h5">New sheet</Typography>} 
                                secondary={<LibraryAdd color="secondary"/>}
                            />
                        </Link>
                    </ListItemButton>
                
                    <ListItemButton selected={selected === 3} onClick={_=>setSelected(3)}>
                        <Link href="/#">
                            <ListItemText disableTypography  
                                primary={<Typography variant="h5">Profile</Typography>} 
                                secondary={<PersonPin color="secondary"/>}
                            />
                        </Link>
                    </ListItemButton>

                    <ListItemButton selected={selected === 4} onClick={_=>setSelected(4)}>
                        <Link href="/settings">
                            <ListItemText disableTypography  
                                primary={<Typography variant="h5">Settings</Typography>} 
                                secondary={<Settings color="secondary"/>}
                            />
                        </Link>
                    </ListItemButton>
                    {hasPrvlge && 
                        <ListItemButton selected={selected === 5} onClick={_=>setSelected(5)}>
                            <Link href="/users">
                                <ListItemText disableTypography  
                                    primary={<Typography variant="h5">Users</Typography>} 
                                    secondary={<People color="secondary"/>}
                                />
                            </Link>
                        </ListItemButton>
                    }
                </List>
            </Grid>
        </Grid>
    )
}   

export default UserBar
