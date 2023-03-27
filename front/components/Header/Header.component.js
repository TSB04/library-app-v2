import * as React from "react"
import Image from "next/image"
import axios from "axios"
import { AppBar, Grid, IconButton, Link, Paper} from "@mui/material"
import Cookies from "universal-cookie"
import { styled, alpha } from '@mui/material/styles'
import InputBase from '@mui/material/InputBase'
import SearchIcon from '@mui/icons-material/Search'
import { Logout, Login } from "@mui/icons-material"
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import BookCard from "../Card/Card.component"
import Theme from "../../theme/Theme"
import Logo from "../../public/logo1.png"

const myStyle = {
    background: "linear-gradient(9deg, rgba(38,22,12,1) 0%, rgba(66,53,46,1) 50%, rgba(95,48,19,1) 100%)",
    height: "9%",
    padding: "0 2%",
    popup: {
        position: "absolute",
        top: "100%",
        left: "13.3%",
        display: "flex",
        width: "165vh",
        justifyContent: "center",
        backgroundColor: alpha(Theme.palette.primary.light, 0.8),
    }      
}

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
}));
  
const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 1),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));
  
const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(2)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '30vh',
            '&:focus': {
              width: '40ch',
            },
        }
    }
}))

const SelectWrapper = styled('div')(({theme}) => ({
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    top:0,
    bottom: 0,
    right: -45,
}))

const handleLogout = () => {
    const cookie = new Cookies
    cookie.remove("jwt")
    sessionStorage.clear()
}

const Header = () => {
    const [field,setField] = React.useState("")
    const [found, setFound] = React.useState()
    const [isLogged, setIsLogged] = React.useState(false)

    React.useEffect(() => {
        const session = sessionStorage.length
        if(session >= 3) {
            setIsLogged(true)
        }
    }, [])

    const handleSearch = async (e) => {
        const test = e.target.value
        const param = {[field]: test}
        try {
            const { data } = await axios ({
                method: "POST",
                url: "/api/getsheet",
                data: param
            })
            setFound(data)
        } catch (err) {
            console.log({error: err})
        }
    }

    return (
        <AppBar sx={myStyle}>
            <Grid container justifyContent="space-between" alignItems="center">
                <Grid item alignContent="center">
                    <IconButton size="small">
                        <Link href="/">
                            <Image src={Logo} height="50%" width="55%"/>
                        </Link>
                    </IconButton>
                </Grid>
                <Grid item >
                    <Search>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder="Search…"
                            inputProps={{ 'aria-label': 'search' }}
                            onChange={handleSearch}
                        />

                        <SelectWrapper>
                            <Select
                                value=""
                                sx={{height:"5.5vh"}}
                                onChange={e =>setField(e.target.value)}                                
                            >
                                <MenuItem value={"title"}>Title</MenuItem>
                                <MenuItem value={"genre"}>Genre</MenuItem>
                                <MenuItem value={"author"}>Author</MenuItem>
                                <MenuItem value={"pbDate"}>Publication Date</MenuItem>
                                <MenuItem value={"price"}>price</MenuItem>


                            </Select>
                        </SelectWrapper> 
                    </Search>
                    <Paper elevation={5} sx={myStyle.popup}>
                        {found && found.map(row => <BookCard
                            key={row.isbn} title={row.title} author={row.author}
                            genre={row.genre} desc={row.desc} nbPage={row.nbPage}
                            bkInStck={row.bkInStck} price={row.price.$numberDecimal}/>)
                        }
                    </Paper>
                </Grid>
                <Grid item>
                    <Link href="/login">
                        <IconButton onClick={handleLogout}>
                            {isLogged === false && <Login fontSize="large"/>}
                            {isLogged === true && <Logout fontSize="large"/>}
                        </IconButton>
                    </Link>
                </Grid>
            </Grid>
        </AppBar>
    )
}

export default Header