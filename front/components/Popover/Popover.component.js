import React from "react"
import Link from "next/link"
import axios from "axios"
import moment from "moment"
import Cookies from "universal-cookie"
import Popover from "@mui/material/Popover"
import { styled, alpha } from "@mui/material/styles"
import { ButtonBase, IconButton, Toolbar, Tooltip } from "@mui/material"
import { Grid, Typography, Card, CardMedia, CardContent } from "@mui/material"
import Grid2 from "@mui/material/Unstable_Grid2/Grid2"
import HighlightOffIcon from "@mui/icons-material/HighlightOff"
import Theme from "../../theme/Theme"
import {
	AddShoppingCart,
	Block,
	DeleteForever,
	Edit,
	ThumbDownOffAltOutlined,
	ThumbUpOffAltOutlined,
	Try,
} from "@mui/icons-material"

const myStyle = {
	globalContainer: {
		width: "130vh",
		height: "65vh",
		backgroundColor: "gray",
	},
	media: {
		borderRadius: 5,
		height: "30vh",
		width: "25vh",
	},
	desc: {
		height: "30vh",
		padding: "2vh",
		overflowY: "auto",
		textAlign: "start",
	},
	exitButton: {
		backgroundColor: Theme.palette.primary.dark,
		position: "absolute",
		top: 0,
		right: 0,
	},
	toolbar: {
		backgroundColor: Theme.palette.primary.main,
		borderRadius: 50,
		marginBottom: "2vh",
		justifyContent: "space-between",
	},
	deleteButton: {
		backgroundColor: Theme.palette.error.main,
	},
	editButton: {
		backgroundColor: Theme.palette.primary.light,
	},
}
const StyledButtonBase = styled(ButtonBase)(({ theme }) => ({
	padding: theme.spacing(0, 1.3, 1, 0),
	textAlign: "start",
}))
const StyledPopover = styled(Popover)(({ theme }) => ({
	backgroundColor: alpha(theme.palette.primary.light, 0.5),
	"& .MuiPopover-paper": {
		width: "150vh",
		height: "80vh",
		borderRadius: 20,
		backgroundColor: alpha(theme.palette.secondary.dark, 1),
		textAlign: "center",
		padding: theme.spacing(2, 0, 0, 0),
	},
}))
const MyPopover = ({ children }) => {
	const [anchorEl, setAnchorEl] = React.useState(null)
	const [selected, setSelected] = React.useState({
		title: "",
		desc: "",
		author: "",
		genre: "",
		pbDate: "",
		nbPage: "",
		price: "",
		bkInStck: "",
	})
	const [hasPrvlge, setHasPrvlge] = React.useState(false)
	const [isOwner, setIsOwner] = React.useState(false)
	const handleClick = event => {
		setAnchorEl(event.currentTarget)
		// Get the clicked card info from the DOM then split to get the title and author
		const selectedCard = Object.values(event.currentTarget.children[0].innerText.split(/\r?\n/))
		const params = {
			title: selectedCard[0],
			author: selectedCard[1],
		}
		try {
			axios({
				method: "POST",
				url: "/api/getsheet",
				data: params,
			}).then(res => {
				if (res.data) {
					for (let [key, value] of Object.entries(res.data[0])) {
						setSelected(prevState => ({
							...prevState,
							[key]: value,
						}))
					}
					// set the cover image for the selected sheet
					setSrcImg("/uploads/" + res.data[0].isbn + ".webp")
					// get the User Id from selected card
					const selectedCardOwnerId = res.data[0].userId
					const loggedUserId = sessionStorage.getItem("userId")
					if (selectedCardOwnerId === loggedUserId) {
						setIsOwner(true)
					}
				}
				const cookie = new Cookies()
				cookie.set("isbn", res.data[0].isbn)
			})
		} catch (error) {
			return error
		}
		handlePrvlge(event)
	}
	const [srcImg, setSrcImg] = React.useState("")
	const handlePrvlge = event => {
		// get the User privilege from session storage then update hasPrvlge
		const userPrvlge = sessionStorage.getItem("userPrvlge")
		if (userPrvlge) {
			setHasPrvlge(true)
		}
	}
	const handleClose = () => {
		setAnchorEl(null)
		setSelected(null)
		const cookie = new Cookies()
		cookie.remove("isbn")
	}
	const open = Boolean(anchorEl)
	const id = open ? "simple-popover" : undefined
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
					vertical: "top",
					horizontal: "left",
				}}
				transformOrigin={{
					vertical: "top",
					horizontal: "left",
				}}
			>
				<IconButton sx={myStyle.exitButton} onClick={handleClose}>
					<HighlightOffIcon />
				</IconButton>
				<Grid2 container xs md={5} mdOffset={3.5} justifyContent="center">
					<Toolbar sx={myStyle.toolbar}>
						<Grid container columnGap={1}>
							<Tooltip title="Add to bassket">
								<IconButton>
									<AddShoppingCart />
								</IconButton>
							</Tooltip>
							<Tooltip title=" Mark favorite">
								<IconButton>
									<Try />
								</IconButton>
							</Tooltip>
							<Tooltip title="Like">
								<IconButton>
									<ThumbUpOffAltOutlined />
								</IconButton>
							</Tooltip>
							<Tooltip title="Dislike">
								<IconButton>
									<ThumbDownOffAltOutlined />
								</IconButton>
							</Tooltip>
							{isOwner === true && (
								<Tooltip title="Edit" sx={myStyle.editButton}>
									<IconButton>
										<Link href="/updatesheet">
											<Edit />
										</Link>
									</IconButton>
								</Tooltip>
							)}
							{hasPrvlge === true && (
								<Tooltip title="Block">
									<IconButton sx={myStyle.deleteButton}>
										<Block />
									</IconButton>
								</Tooltip>
							)}
							{isOwner === true && (
								<Tooltip title="Delete">
									<IconButton sx={myStyle.deleteButton}>
										<Link href="/deletesheet" backgroundColor="none">
											<DeleteForever />
										</Link>
									</IconButton>
								</Tooltip>
							)}
						</Grid>
					</Toolbar>
				</Grid2>
				<Grid2 container xs md={12} mdOffset={0.8}>
					{selected && (
						<Card sx={myStyle.globalContainer}>
							<Grid container direction="row" justifyContent="space-between">
								<Grid item xs={8}>
									<CardContent sx={{ flex: "1 0 auto" }}>
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
											{moment(selected.pbDate).format("LL")}
										</Typography>
									</CardContent>
								</Grid>
								<Grid item xs={4}>
									<CardMedia
										component="img"
										image={srcImg}
										alt="Books cover"
										style={myStyle.media}
									/>
									<Typography sx={{ fontSize: "2px" }}>userId</Typography>
								</Grid>
							</Grid>
							<Grid container direction="column" justifyContent="space-between">
								<Grid item xs={8} md={8}>
									<CardContent sx={myStyle.desc}>
										<Typography component="div" variant="body2" marginTop={-1}>
											{selected.desc}
										</Typography>
									</CardContent>
								</Grid>
								<Grid item xs={4} md={4}>
									<Grid container direction="row" justifyContent="space-evenly">
										<Grid>
											<Typography component="span" variant="subtitle2">
												Page: {selected.nbPage}
											</Typography>
										</Grid>
										<Grid>
											<Typography component="span" variant="subtitle2">
												Stock: {selected.bkInStck}
											</Typography>
										</Grid>
										<Grid>
											<Typography component="span" variant="subtitle2">
												$ {selected.price.$numberDecimal}
											</Typography>
										</Grid>
									</Grid>
								</Grid>
							</Grid>
						</Card>
					)}
				</Grid2>
			</StyledPopover>
		</>
	)
}
export default MyPopover
