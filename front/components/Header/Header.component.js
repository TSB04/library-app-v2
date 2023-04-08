import * as React from "react"
import Image from "next/image"
import axios from "axios"
import { AppBar, Grid, IconButton, Link, Paper } from "@mui/material"
import Cookies from "universal-cookie"
import { styled, alpha } from "@mui/material/styles"
import InputBase from "@mui/material/InputBase"
import SearchIcon from "@mui/icons-material/Search"
import { Logout, Login } from "@mui/icons-material"
import MenuItem from "@mui/material/MenuItem"
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded"
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded"
import HighlightOffIcon from "@mui/icons-material/HighlightOff"
import Tabs from "@mui/material/Tabs"
import Select from "@mui/material/Select"
import BookCard from "../Card/Card.component"
import Theme from "../../theme/Theme"
import Logo from "../../public/logo1.png"

const myStyle = {
	background:
		"linear-gradient(9deg, rgba(38,22,12,1) 0%, rgba(66,53,46,1) 50%, rgba(95,48,19,1) 100%)",
	height: "9%",
	padding: "0 2%",
	popup: {
		position: "absolute",
		top: "100%",
		left: "16%",
		display: "flex",
		flexDirection: "row",
		width: "66.2%",
		justifyContent: "center",
		backgroundColor: alpha(Theme.palette.primary.light, 0.8),
	},
	arrow: {
		position: "relative",
		zIndex: "1",
		alignSelf: "center",
		width: "5%",
		color: "white",
	},
	exitButton: {
		position: "absolute",
		right: "-3vh",
		bottom: "-3vh",
		backgroundColor: Theme.palette.primary.dark,
	},
}
const Search = styled("div")(({ theme }) => ({
	position: "relative",
	borderRadius: theme.shape.borderRadius,
	backgroundColor: alpha(theme.palette.common.white, 0.15),
	"&:hover": {
		backgroundColor: alpha(theme.palette.common.white, 0.25),
	},
	[theme.breakpoints.up("sm")]: {
		marginLeft: theme.spacing(1),
		width: "auto",
	},
}))
const SearchIconWrapper = styled("div")(({ theme }) => ({
	padding: theme.spacing(0, 1),
	height: "100%",
	position: "absolute",
	pointerEvents: "none",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
}))
const StyledInputBase = styled(InputBase)(({ theme }) => ({
	color: "inherit",
	"& .MuiInputBase-input": {
		padding: theme.spacing(1, 1, 1, 0),
		// vertical padding + font size from searchIcon
		paddingLeft: `calc(1em + ${theme.spacing(2)})`,
		transition: theme.transitions.create("width"),
		[theme.breakpoints.up("sm")]: {
			width: "28vh",
			"&:focus": {
				width: "40ch",
			},
		},
	},
}))
const SelectWrapper = styled("div")(({ theme }) => ({
	backgroundColor: alpha(theme.palette.common.white, 0.15),
	position: "absolute",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	top: 0,
	bottom: 0,
	right: -57,
	borderRadius: theme.shape.borderRadius,
}))
const handleLogout = () => {
	const cookie = new Cookies()
	cookie.remove("jwt")
	sessionStorage.clear()
}
const Header = () => {
	const [field, setField] = React.useState("")
	const [found, setFound] = React.useState()
	const [isLogged, setIsLogged] = React.useState(false)

	React.useEffect(() => {
		const session = sessionStorage.length
		if (session >= 3) {
			setIsLogged(true)
		}
	}, [])
	const handleSearch = async e => {
		const entry = e.target.value
		if (field !== "") {
			const param = { [field]: entry }
			try {
				const { data } = await axios({
					method: "POST",
					url: "/api/getsheet",
					data: param,
				})
				setFound(data)
				console.log("1")
			} catch (err) {
				throw err
			}
		} else if (field === "" && entry !== "") {
			try {
				fetch("http://localhost:4898/api/books/all")
					.then(res => res.json())
					.then(data => {
						const values = Object.values(data)
						const toSearch = entry.toLowerCase()
						const globalFound = []
						for (let i = 0; i < values.length; i++) {
							const titles = values[i].title.toLowerCase()
							const genres = values[i].genre.toLowerCase()
							const authors = values[i].author.toLowerCase()
							if (titles.indexOf(toSearch) !== -1) {
								globalFound.push(values[i])
							} else if (genres.indexOf(toSearch) !== -1) {
								globalFound.push(values[i])
							} else if (authors.indexOf(toSearch) !== -1) {
								globalFound.push(values[i])
							}
						}
						setFound(globalFound)
					})
			} catch (err) {
				throw err
			}
		} else if (entry === "") {
			setFound()
		}
	}
	const handleClose = () => {
		setFound()
		setField("")
	}
	return (
		<AppBar sx={myStyle}>
			<Grid container justifyContent="space-between" alignItems="center">
				<Grid item alignContent="center">
					<IconButton size="small">
						<Link href="/">
							<Image src={Logo} height="50%" width="55%" />
						</Link>
					</IconButton>
				</Grid>
				<Grid item>
					<Search>
						<SearchIconWrapper>
							<SearchIcon />
						</SearchIconWrapper>
						<StyledInputBase
							placeholder="Search…"
							inputProps={{ "aria-label": "search" }}
							onChange={handleSearch}
						/>
						<SelectWrapper>
							<Select
								sx={{ height: "5.5vh" }}
								labelId="demo-simple-select-label"
								id="demo-simple-select"
								value={field}
								onChange={e => {
									setField(e.target.value)
								}}
							>
								<MenuItem value={""}>None</MenuItem>
								<MenuItem value={"title"}>Title</MenuItem>
								<MenuItem value={"genre"}>Genre</MenuItem>
								<MenuItem value={"author"}>Author</MenuItem>
								<MenuItem value={"pbDate"}>Publication Date</MenuItem>
								<MenuItem value={"price"}>Price</MenuItem>
							</Select>
						</SelectWrapper>
					</Search>
					<Paper elevation={1} sx={myStyle.popup}>
						{found && (
							<Tabs
								variant="scrollable"
								scrollButtons="auto"
								aria-label="scrollable auto tabs example"
								ScrollButtonComponent={props => {
									if (props.direction === "left" && !props.disabled) {
										return (
											<IconButton sx={myStyle.arrow} {...props}>
												<ArrowBackIosNewRoundedIcon fontSize="large" />
											</IconButton>
										)
									} else if (props.direction === "right" && !props.disabled) {
										return (
											<IconButton sx={myStyle.arrow} {...props}>
												<ArrowForwardIosRoundedIcon fontSize="large" />
											</IconButton>
										)
									} else {
										return null
									}
								}}
							>
								{found.map(row => (
									<BookCard
										key={row.isbn}
										title={row.title}
										author={row.author}
										genre={row.genre}
										desc={row.desc}
										nbPage={row.nbPage}
										bkInStck={row.bkInStck}
										price={row.price.$numberDecimal}
										isbn={row.isbn}
										cover={row.cover}
									/>
								))}
							</Tabs>
						)}
						{found && (
							<IconButton sx={myStyle.exitButton} onClick={handleClose}>
								<HighlightOffIcon />
							</IconButton>
						)}
					</Paper>
				</Grid>
				<Grid item>
					<Link href="/login">
						<IconButton onClick={handleLogout}>
							{isLogged ? <Logout fontSize="large" /> : <Login fontSize="large" />}
						</IconButton>
					</Link>
				</Grid>
			</Grid>
		</AppBar>
	)
}
export default Header
