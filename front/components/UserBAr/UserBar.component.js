import { AutoStories, LibraryAdd, People, PersonPin, Settings } from "@mui/icons-material"
import {
	Avatar,
	Grid,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Typography,
} from "@mui/material"
import Link from "next/link"
import React from "react"
import Theme from "../../theme/Theme"
import Divider from "@mui/material/Divider"
import { styled } from "@mui/material/styles"

const openedMixin = theme => ({
	transition: theme.transitions.create("width", {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.enteringScreen,
	}),
	overflowX: "hidden",
})

const closedMixin = theme => ({
	transition: theme.transitions.create("width", {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	overflowX: "hidden",
	width: `calc(${theme.spacing(7)} + 1px)`,
	[theme.breakpoints.up("sm")]: {
		width: `calc(${theme.spacing(8)} + 1px)`,
	},
})

const Drawer = styled(Grid, { shouldForwardProp: prop => prop !== "open" })(({ theme, open }) => ({
	...(open && {
		...openedMixin(theme),
		"& .MuiDrawer-paper": openedMixin(theme),
	}),
	...(!open && {
		...closedMixin(theme),
		"& .MuiDrawer-paper": closedMixin(theme),
	}),
}))

const myStyle = {
	container: {
		backgroundColor: Theme.palette.primary.main,
		borderRadius: "5px",
		padding: "2vh 0 0 0",
	},
	avatar: {
		width: "17vh",
		height: "18vh",
	},
	border: {
		background:
			"linear-gradient(90deg, rgba(95,48,19,1) 0%, rgba(38,22,12,1) 50%, rgba(95,48,19,1) 100%)",
		height: "0.2vh",
		margin: "10% 0 0 0",
	},
	logout: {
		margin: "0 0 20% 28%",
		backgroundColor: "primary",
		button: {
			height: "10vh",
			width: "10vh",
		},
	},
}

const UserBar = () => {
	const [selected, setSelected] = React.useState(0)
	const [hasPrvlge, setHasPrvlge] = React.useState(false)
	const [open, setOpen] = React.useState(false)
	const userImg = sessionStorage.getItem("email") + ".webp"
	const userImgPath = "/uploads/" + userImg 
	
	React.useEffect(() => {
		const userPrvlge = sessionStorage.getItem("userPrvlge")
		if (userPrvlge) {
			setHasPrvlge(true)
		}
		window.innerWidth < 900 ? setOpen(false) : setOpen(true)
		function handleResize() {
			window.innerWidth < 900 ? setOpen(false) : setOpen(true)
		}
		window.addEventListener("resize", handleResize)
	},[])

	return (
		<Drawer
			container
			variant="permanent"
			direction="column"
			sx={myStyle.container}
			open={open}
			width="100%"
		>
			<Grid container  direction="column" rowGap={1} justifyContent="center" alignItems="center" textAlign="center">
				{open ? (
					<>
						<Avatar alt="Photo profil" src={userImgPath} sx={myStyle.avatar} />
						<Typography variant="h5">{sessionStorage.getItem("fname")}</Typography>
					</>
				) : (
					<Avatar
						{...stringAvatar(sessionStorage.getItem("fname"), sessionStorage.getItem("lname"))}
					/>
				)}
			</Grid>
			<Divider sx={myStyle.border} />
				<List>
					{[
						{ text: "my sheets", link: "/mysheets", icon: AutoStories },
						{ text: "new sheet", link: "/sheetadd", icon: LibraryAdd },
						{ text: "profile", link: "/profile", icon: PersonPin },
						{ text: "settings", link: "/settings", icon: Settings },
						// { hasPrvlge && (text: "users", link: "/users", icon: People )},
					].map((field, index) => (
						<ListItem key={field.text} disablePadding sx={{ display: "block" }}>
							<ListItemButton
								sx={{
									minHeight: 48,
									justifyContent: open ? "initial" : "center",
									px: 2.5,
								}}
								selected={selected === index + 1}
								onClick={_ => setSelected(index + 1)}
							>
								<Link href={field.link}>
									{open ? (
										<ListItemText
											primary={<Typography variant="h5">{field.text}</Typography>}
											secondary={<field.icon color="secondary" />}
											sx={{ opacity: open ? 1 : 0 }}
										/>
									) : (
										<ListItemIcon
											sx={{
												minWidth: 0,
												mr: open ? 1 : "auto",
												justifyContent: "center",
											}}
										>
											{field.icon && <field.icon color="secondary" />}
										</ListItemIcon>
									)}
								</Link>
							</ListItemButton>
						</ListItem>
					))}
					{hasPrvlge &&
					<ListItem disablePadding>
						<ListItemButton
							sx={{
								minHeight: 48,
								justifyContent: open ? "initial" : "center",
								px: 2.5,
							}}
							selected={selected === 5}
							onClick={_ => setSelected(5)}
						>
							 <Link href="/users">
									{open ? (	
										<ListItemText
											primary={<Typography variant="h5">users</Typography>}
											secondary={<People color="secondary" />}
											sx={{ opacity: open ? 1 : 0 }}
										/>
									) : (
										<ListItemIcon
											sx={{ minWidth: 0, mr: open ? 1 : "auto", justifyContent: "center" }}

										>
											<People color="secondary" />
										</ListItemIcon>
									)}
							</Link>
						</ListItemButton>
					
					</ListItem>
}
				</List>
		</Drawer>
	)
}
export default UserBar

function stringAvatar(fname, lname) {
	return {
		children: `${fname.split()[0][0]}${lname.split(" ")[0][0]}`,
	}
}
