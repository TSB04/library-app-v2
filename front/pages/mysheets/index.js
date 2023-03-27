import * as React from "react"
import { useState, useEffect } from "react"
import BookCard from "../../components/Card/Card.component"
import { Box, Typography } from "@mui/material"
import axios from "axios"
import moment from 'moment'
import Cookies from "universal-cookie"


    const myStyle = {
        padding: "1% 0 0 0.5%",
        position: "absolute",
        left: "13.3%",
        width: "86.7%",
        maxHeight: "90vh",
        overflow: "auto",
    }


function MySheets() {

    let [mySheets, setMySheets] = React.useState()

// Can't do this method because needs to access to sessionStorage from the Api endpoint /api/mysheets, which is impossible
    // useEffect(() => {
    //     async function fetchData() {
    //         // const cookie = new Cookies
    //         // const token = cookie.get("jwt")  
    //         const { data } = await axios ({
    //         headers: {'X-Requested-With': 'XMLHttpRequest'},
    //         url: "/api/mysheets",
    //         params: {
    //             token: 123
    //         }
    //     })
    //     console.log(token)
    //     setError0("")
    //     if(data.error === 0) {
    //         setError0("You must login to access to your sheets")
    //         console.log(data.error)
    //     } else {
    //         setMySheets(data)
    //         setError0("")
    //     }
    // }
    //     fetchData()
    // },[])

    useEffect(() => {
        // from here, can access to session storage
        const token = sessionStorage.getItem('jwt')
        fetch(("http://localhost:4898/api/books/mysheets"),{
            method: "GET",
            headers: { 
                "Authorization": "Bearer "+token,
                "Content-Type": "application/json" 
            },
        })
        .then(response => response.json())
        .then(data => {
            if(data.error === 0) {
                window.alert("You must login to access to your sheets")
                window.location.assign("/login")
            } else {
                setMySheets(data)
            }
        })
    },[])
    
    return(
        <Box sx={myStyle}>
            {mySheets && mySheets.map(row =>
                <BookCard 
                    key={row.isbn} userId={row.userId} isbn={row.isbn} title={row.title} author={row.author}
                    genre={row.genre} pbDate={moment(row.pbDate).format('LL')} desc={row.desc} 
                    nbPage={row.nbPage}bkInStck={row.bkInStck} price={row.price.$numberDecimal}
                />)
            }
        </Box> 
    )
}

export default MySheets