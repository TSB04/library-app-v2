import * as React from "react"
import { Grid } from "@mui/material"
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
		height: "91vh",
	},
	aside:{
		padding: "2% 0 0 1%",
	},
}

const Layout = ({ children }) => {

	const [isLogged, setIslogged] = React.useState(false)
	const [userBar, setUserBar] = React.useState()

	return (
		<>
			<Grid container sx={myStyle.header}>
				<Header/>
			</Grid>
			<Grid container sx={myStyle.globalContainer}>
				<Grid item xs={1.5} sx={myStyle.aside} alignItems="center">
					{typeof window !== "undefined" && window.location.pathname !== "/login" && window.location.pathname !== "/signup" && 
						React.useEffect(()=> {
							if(sessionStorage.length >= 3) {
								setUserBar(<UserBar/>)
							}
						}, [])
					}
					{userBar}
				</Grid>
				<Grid container xs={10.5} item component="main" justifyContent="center">
					{ children }
				</Grid>
			</Grid>		
		</>
	)

}

export default Layout
