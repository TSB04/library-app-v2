import '../styles/globals.css'
import * as React from "react"
import { CssBaseline, ThemeProvider } from "@mui/material"
import Theme from "../theme/Theme"
import Layout from "../components/Layout/Layout.component"

const myStyle = {
    overflow: "clip"
}

function MyApp({ Component, pageProps }) {
    return (
        <ThemeProvider theme={Theme}>
            <Layout sx={myStyle}>
                <CssBaseline/>
                <Component {...pageProps} />
            </Layout>
        </ThemeProvider>
    )
}

export default MyApp
