import * as React from "react"
import { Box  } from "@mui/material"
import BookCard from "../components/Card/Card.component"
import moment from "moment"

const myStyle = {
    padding: "1% 0 0 0.5%",
    position: "absolute",
    left: "13.3%",
    width: "86.7%",
    maxHeight: "90vh",
    overflow: "auto",
}

    
function Home () {
    const [ sheets, setSheets ] = React.useState(null)

    React.useEffect(() => {
        fetch('http://localhost:4898/api/books/all')
        .then(response => response.json())
        .then(data => {setSheets(data)})
    },[])

    return (  
        <Box style={myStyle}>
            {sheets && sheets.map(row => 
                <BookCard
                    key={row.isbn} userId={row.userId} isbn={row.isbn} title={row.title} author={row.author}
                    genre={row.genre} pbDate={moment(row.pbDate).format('LL')} desc={row.desc}
                    nbPage={row.nbPage}bkInStck={row.bkInStck} price={row.price.$numberDecimal} isAvble={row.isAvble}
                />
            )}
        </Box>        
    )
}

export default Home