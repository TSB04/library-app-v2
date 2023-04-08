import * as React from "react"
import { Grid, Box } from "@mui/material"
import Header from "../Header/Header.component"
import UserBar from "../UserBAr/UserBar.component"
import bgImage from "../../public/thumb-1920-26102.jpg"

const myStyle = {
	header: {
		height: "9vh",
	},
	globalContainer: {
		backgroundImage: `url(${bgImage.src})`,
		width: "212,1vh",
		minHeight: "91vh",
	},
	aside: {
		padding: "2% 0 0 0.5%",
	},
	main: {
		overflow: "auto",
		width: "86%",
		padding: "2% 0 0 1%",
	},
}
const Layout = ({ children }) => {
	const [isLogged, setIsLogged] = React.useState(false)
	const [userBar, setUserBar] = React.useState()
	React.useEffect(() => {
		if (typeof window !== "undefined" && sessionStorage.length >= 3) {
			setIsLogged(true)
			setUserBar(<UserBar />)
		}
	}, [])
	return (
		<>
			<Grid container sx={myStyle.header}>
				<Header />
			</Grid>
			<Grid container justifyContent="center" sx={myStyle.globalContainer}>
				{isLogged === true && (
					<Grid item xs={1.5} sx={myStyle.aside} alignItems="center" id="userBarContainer">
						{userBar}
					</Grid>
				)}
				<Box sx={myStyle.main}>{children}</Box>
			</Grid>
		</>
	)
}
export default Layout
