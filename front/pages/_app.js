import "../styles/globals.css"
import React from "react"
// import { Provider } from "react-redux"
// import { wrapper } from "../components/Store/Store.component"
import { CssBaseline, ThemeProvider } from "@mui/material"
import Theme from "../theme/Theme"
import Layout from "../components/Layout/Layout.component"

const myStyle = {
	overflow: "clip",
}

function MyApp({ Component, pageProps }) {
	// const { store, props } = wrapper.useWrappedStore(rest)
	return (
		// <Provider store={store}>
			<ThemeProvider theme={Theme}>
				<Layout sx={myStyle}>
					<CssBaseline />
					<Component {...pageProps} />
				</Layout>
			</ThemeProvider>
		// </Provider>
	)
}

export default MyApp
// export default wrapper.withRedux(MyApp);
