import * as React from 'react'
import Link from 'next/link'
import Popover from '@mui/material/Popover'
import { styled, alpha } from '@mui/material/styles'
import { ButtonBase, IconButton, Toolbar, Tooltip } from '@mui/material'
import { Grid, Typography, Card, CardMedia, CardContent  } from "@mui/material"
import Grid2 from "@mui/material/Unstable_Grid2/Grid2"
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import Theme from "../../theme/Theme"
import { AddShoppingCart, Block, DeleteForever, Edit, ThumbDownOffAltOutlined, ThumbUpOffAltOutlined, Try } from '@mui/icons-material';

const myStyle = {
    globalContainer: {
        display: 'inline-block',
        margin: "0 0.9% 1% 0",
        width: "120vh",
        height: "64vh",
        backgroundColor: "gray"
    },
    media: {
        borderRadius: 5,
        height: "30vh",

    },
    desc: {
        height:"30vh",
        padding: "2vh 1vh",
        overflowY: "auto",
        textAlign: "start"
    },
    exitButton: {
        backgroundColor: Theme.palette.primary.dark,
        position: "absolute",
        top: 0,
        right: 0
    },
    toolbar: {
        backgroundColor: Theme.palette.primary.main,
        borderRadius: 50,
        marginBottom: "2vh",
        justifyContent: "space-between"
    },
    deleteButton: {
        backgroundColor: Theme.palette.error.main,
   
    },
    editButton :{
        backgroundColor: Theme.palette.primary.light,
    }
}

const StyledButtonBase = styled(ButtonBase)(({theme}) => ({
    padding: theme.spacing(0, 1.3, 1, 0),
    textAlign: "start"
}))

const StyledPopover = styled(Popover)(({theme})=>({
    backgroundColor: alpha(theme.palette.primary.light, 0.5),
    "& .MuiPopover-paper": {
        width: "150vh",
        height: "80vh",
        borderRadius: 20,
        backgroundColor: alpha(theme.palette.secondary.dark, 1),
        textAlign: "center",
        padding: theme.spacing(2, 0, 0, 0),
    }
}))

const MyPopover = ({children}) => {
    const [anchorEl, setAnchorEl] = React.useState(null)
    const [selected, setSelected] = React.useState("")
    const [hasPrvlge, setHasPrvlge] = React.useState(false)
    const [isOwner, setIsOwner] = React.useState(false)
    
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)

        // Get the cklicked card info from the DOM then split 
        const selectedCard = Object.values(event.currentTarget.children[0].innerText.split(/\r?\n/))

        // Put the selected card info an param in the session storage in case for sheet update or delete
        sessionStorage.setItem("isbn", selectedCard[11])
        sessionStorage.setItem("title", selectedCard[0])
        sessionStorage.setItem("desc", selectedCard[4])
        sessionStorage.setItem("author", selectedCard[1])
        sessionStorage.setItem("genre", selectedCard[2])
        sessionStorage.setItem("pbDate", selectedCard[3])
        sessionStorage.setItem("nbPage", selectedCard[5])
        sessionStorage.setItem("price", selectedCard[7])
        sessionStorage.setItem("bkInStck", selectedCard[6])

        // set selected card infos to display
        setSelected({
            title: selectedCard[0],
            desc: selectedCard[4],
            author: selectedCard[1],
            genre: selectedCard[2],
            pbDate: selectedCard[3],
            nbPage: selectedCard[5],
            price: selectedCard[7],
            bkInStck: selectedCard[6]
        })
        handlePrvlge(event)
    };

    const handlePrvlge = (event) => {
        // get the User privilege from session storage then update hasPrvlge
        const userPrvlge = sessionStorage.getItem("userPrvlge")
        if(userPrvlge) {
            setHasPrvlge(true)
        }
        // get the User Id from selected card
        const selectedCard = Object.values(event.currentTarget.children[0].innerText.split(/\r?\n/))
        const selectedCardOwnerId = selectedCard[9]
        const loggedUserId = sessionStorage.getItem("userId")
        if(selectedCardOwnerId === loggedUserId) {
            setIsOwner(true)
        }
    }

    const handleClose = () => {
        setAnchorEl(null)
        setSelected(null)
        sessionStorage.removeItem("isbn")
        sessionStorage.removeItem("title")
        sessionStorage.removeItem("genre")
        sessionStorage.removeItem("author")
        sessionStorage.removeItem("pbDate")
        sessionStorage.removeItem("desc")
        sessionStorage.removeItem("bkInStck")
        sessionStorage.removeItem("nbPage")
        sessionStorage.removeItem("price")        
    }

    const open = Boolean(anchorEl)
    const id = open ? 'simple-popover' : undefined

    return (
        <>
            <StyledButtonBase aria-describedby={id} onClick={handleClick}>
                {children}
            </StyledButtonBase>
            <StyledPopover
                elevation={2}
                id={id}
                open={open}
                anchorReference="anchorPosition"
                anchorPosition={{ top: 80, left: 216 }}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >   
                <IconButton sx={myStyle.exitButton} onClick={handleClose}>
                    <HighlightOffIcon/>
                </IconButton>

                <Grid2 container xs md={5} mdOffset={3.5} justifyContent="center">
                    <Toolbar sx={myStyle.toolbar}>
                        <Grid container columnGap={1}>
                            <Tooltip title="Add to bassket">
                                <IconButton>
                                    <AddShoppingCart/>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title=" Mark favorite">
                                <IconButton>
                                    <Try/>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Like">
                                <IconButton>
                                    <ThumbUpOffAltOutlined/>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Dislike">
                                <IconButton>
                                    <ThumbDownOffAltOutlined/>
                                </IconButton>
                            </Tooltip>
                            {isOwner === true &&
                                <Tooltip title="Edit" sx={myStyle.editButton}>
                                    <Link href="/updatesheet" backgroundColor="none">
                                        <IconButton>
                                            <Edit/>
                                        </IconButton>
                                    </Link>
                                </Tooltip>
                            }
                            {hasPrvlge === true &&
                                <Tooltip title="Block">
                                    <IconButton sx={myStyle.deleteButton}>
                                        <Block/>
                                    </IconButton>
                                </Tooltip>
                            }
                            {isOwner === true && 
                                <Tooltip title="Delete">
                                    <Link href="/deletesheet" backgroundColor="none">
                                        <IconButton sx={myStyle.deleteButton}>
                                            <DeleteForever/>
                                        </IconButton>
                                    </Link>
                                </Tooltip>
                            }
                        </Grid>
                    </Toolbar>
                </Grid2>

                {selected && (
                    <Card sx={myStyle.globalContainer}>
                        <Grid container  direction="row" justifyContent="space-between">
                            <Grid item xs={8}>
                                <CardContent sx={{ flex: '1 0 auto' }}>
                                    <Typography component="div" variant="h3" name="title">
                                        {selected.title}
                                    </Typography>
                                    <Typography variant="h4" color="text.secondary" component="div">
                                        {selected.author}
                                    </Typography>
                                    <Typography variant="h5" color="text.secondary" component="div">
                                        {selected.genre}
                                    </Typography>
                                    <Typography variant="h5" color="text.secondary" component="div">
                                        {selected.pbDate}
                                    </Typography>
                                </CardContent>
                            </Grid>

                            <Grid item xs={4}>
                                <CardMedia
                                component="img"
                                image="/icon2.jpeg"
                                alt="Live from space album cover"
                                style={myStyle.media}
                                />
                                <Typography sx={{fontSize: "2px"}}>userId</Typography>

                            </Grid>

                        </Grid>

                        <Grid container direction="column" justifyContent="space-between">
                            <Grid item xs={8} md={8} >
                                <CardContent sx={myStyle.desc}>
                                    <Typography component="div" variant="body2" marginTop={-1}>
                                        {selected.desc}
                                    </Typography>
                                </CardContent>
                            </Grid>
                            <Grid item xs={4} md={4} > 
                                <Grid container direction="row"   justifyContent="space-evenly">
                                    <Grid >
                                        <Typography component="span" variant="subtitle2">
                                        {selected.nbPage}
                                        </Typography>
                                    </Grid>
                                    <Grid >
                                        <Typography component="span" variant="subtitle2">
                                            {selected.bkInStck}
                                        </Typography>
                                    </Grid>
                                    <Grid >
                                        <Typography component="span" variant="subtitle2">
                                            {selected.price}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid> 
                    </Card>
                )}
            </StyledPopover>
        </>
    )
}

export default MyPopover