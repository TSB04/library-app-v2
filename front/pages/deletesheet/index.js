import React from "react"
import { useRouter } from 'next/router'
import axios from "axios"
import Cookies from "universal-cookie"
import moment from "moment"
import BookCard from "../../components/Card/Card.component"
import Grid2 from "@mui/material/Unstable_Grid2/Grid2"
import { Button, Grid, Typography, Box } from "@mui/material"

const myStyle = {
    gridConatiner: {
        backgroundColor: "#F0F0F2",
        borderRadius: "8px",
        padding: "0.5% 2%",
        height: "max-content",
        marginTop: "2%"
    },
}

function DeleteSheet() {
    const [sheet, setSheet] = React.useState(null)
    // Get the sheet to delete from back
	React.useEffect(() => {
        const cookies = new Cookies()
        const selectedCardIsbn = cookies.get("isbn")
		const param = { isbn: selectedCardIsbn }
        const getSheet = async () => {
            try {
                axios({
                    method: "POST",
                    url: "/api/getsheet",
                    data: param,
                }).then((res) => {
                    if (res.data) {
                        console.log(res.data)
                        setSheet(res.data)
                    } 
                    return res
                })
            } catch (err) {
                console.log({error: err})
            }
        }
        getSheet()
    }, [])
    const deleteImgUpld = async () => {
        const param = {isbn: selectedCardIsbn}
        try {
            await axios({
                method: "Post",
                url: "/api/deleteUpld",
                data: param
            }).then((res) => {console.log(res)})
        } catch (err) {
            console.log({error: err})
        }
    }
    const handleDelete = async (event) => {
        event.preventDefault()
        try {
            const param = {isbn: selectedCardIsbn}
            const { data } = await axios ({
                method: "DELETE",
                url: "/api/deletesheet",
                data: param
        })
            if (data.message) {
                deleteImgUpld()
                window.alert(data.message)
                window.location.replace("/")
            }
        } catch (err) {
            console.log({error: err})
        }
    }
    const router = useRouter()
    return(
        <Grid2 container xs md={9} mdOffset={-1} rowGap={4} sx={myStyle.gridConatiner} 
            justifyContent="space-evenly" alignItems="center" direction="column"
        >        
            <Typography variant="warning">Note: Deleting the sheet will be irreversible</Typography>
            <Typography variant="h4">Please confirm the deletion of this sheet</Typography>
            <Box>
            {sheet && sheet.map(row => 
                <BookCard
                    key={row.isbn} userId={row.userId} isbn={row.isbn} title={row.title} author={row.author}
                    genre={row.genre} pbDate={moment(row.pbDate).format('LL')} desc={row.desc}
                    nbPage={row.nbPage}bkInStck={row.bkInStck} price={row.price.$numberDecimal} isAvble={row.isAvble}
                />
            )}
        </Box>
            <Grid container justifyContent="center" columnGap={4}>
                <Button variant="contained" onClick={() => router.back()}>Non</Button>
                <Button variant="contained" color="error" onClick={handleDelete}>Yes</Button>
            </Grid>
        </Grid2>
    )
}

export default DeleteSheet