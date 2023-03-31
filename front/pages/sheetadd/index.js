import React, { useState } from "react"
import Grid2 from "@mui/material/Unstable_Grid2/Grid2"
import { Grid, TextField, Typography, Button, Link } from "@mui/material"
import axios from "axios"
import Cookies from "universal-cookie"

const myStyle = {
    gridConatiner: {
        backgroundColor: "#F0F0F2",
        borderRadius: "8px",
        padding: "0.5% 0",
        height: "max-content",
        marginTop: "1%"
    },
}

function AddSheet () {
    const [helperText, setHelperText] = React.useState({
        isbn:"Please enter the book's isbn",
        title: "Please enter the book's title",
        desc: "Please enter the book's description",
        author: "Please enter the book's author",
        genre: "Please enter the book's genre",
        pbDate: "Please enter the book's publication date",
        nbPage: "Please enter the number of book pages",
        price: "Please enter the book's price",
        bkInStck: "Please enter the number of books in stock"
    })
    const [error, setError] = React.useState({
        isbn: false,
        title: false,
        desc: false,
        author: false,
        genre: false,
        pbDate: false,
        nbPage: false,
        price: false,
        bkInStck: false,
    })
    const [inputs, setInputs] = React.useState({
        isbn: "",
        title: "",
        desc: "",
        author: "",
        genre: "",
        pbDate: "",
        nbPage: "",
        price: "",
        bkInStck: ""
    })
    const [error0, setError0] = React.useState("")
    const handleChange = e => {
        const { name, value } = e.target;
        setInputs(prevState => ({
            ...prevState,
            [name]: value
        }));
    }
    const handleSubmit = async (event) => {
        event.preventDefault()
        try {
            const { data } = await axios({
                method: "POST",
                url: "/api/addsheet",
                data: inputs
            })
            setError0("")
            if (data.message) {
                uploadToServer()
                window.alert(data.message)
                window.location.replace('/')
            } else if (data.error === 0) {
                setError0("You must log in to create a sheet !!")
            } else if(data) {

                //...working in progress, all inputs must behave this way without repeating this code each time
                if(data.isbn) {
                    setHelperText({...helperText, isbn: data.isbn.message})
                    setError({...error, isbn: true})
                } else {
                    setHelperText({...helperText, isbn: null})
                    setError({...error, isbn: false})
                }
            }        
        } catch (err) {
            console.log({error: err})
        }
    }
    const [image, setImage] = useState(null)   
    const uploadToClient = (event) => {
        if (event.target.files && event.target.files[0]) {
            const i = event.target.files[0]
            setImage(i)
        }
        return null
    }
    const uploadToServer = async (event) => {
        const cookie = new Cookies
        cookie.set("isbn", inputs.isbn)
        const body = new FormData()
        body.append("file", image)
        try {
            const { data } = await axios({
                method: "POST",
                url: "/api/upload",
                data: body
            })
        } catch (err) {
            return ({error: err})
        }
    }
    return (
        <Grid2 container xs md={9} mdOffset={-1} rowGap={1} sx={myStyle.gridConatiner} 
            justifyContent="space-evenly" alignItems="center" direction="column"
        >
            <Grid item>
                <Typography variant="h3" >
                    Create a new Sheet
                </Typography>
            </Grid>

            <Grid container  rowGap={3} >
                <Grid container direction="row" justifyContent="space-evenly" alignItems="center">
                    <Grid >
                        <TextField
                            required
                            fullWidth
                            type="input"
                            id="demo-helper-text-aligned"
                            label="isbn"
                            name="isbn"
                            error={error.isbn}
                            helperText={helperText.isbn} 
                            onBlur={handleChange}
                        />
                    </Grid>
                    <Grid >
                        <TextField
                            required
                            fullWidth
                            type="input"
                            id="demo-helper-text-aligned"
                            label="Title"
                            name="title" 
                            error={error.title}
                            helperText={helperText.title} 
                            onBlur={handleChange}
                        />
                    </Grid>
                    <Grid >
                        <TextField
                            required
                            fullWidth
                            type="input"
                            id="demo-helper-text-aligned"
                            label="Author"
                            name="author" 
                            error={error.author}
                            helperText={helperText.author} 
                            onChange={handleChange}
                        />
                    </Grid>
                </Grid>

                    
                <Grid container direction="row" justifyContent="space-evenly" alignItems="center">
                    <Grid>
                        <TextField
                            required
                            fullWidth
                            type="input"
                            id="demo-helper-text-aligned"
                            label="Genre"
                            name="genre" 
                            error={error.genre}
                            helperText={helperText.genre} 
                            onBlur={handleChange}
                        />
                    </Grid>
                    <Grid >
                        <TextField
                            fullWidth
                            required
                            type="input"
                            id="demo-helper-text-aligned"
                            label="Number of pages"
                            name="nbPage"
                            error={error.nbPage}
                            helperText={helperText.nbPage}  
                            onBlur={handleChange}
                        />
                    </Grid>
                    <Grid >
                        <TextField
                            fullWidth
                            focused
                            required
                            id="demo-helper-text-aligned"
                            label="Publication date"
                            name="pbDate"
                            type="date"
                            error={error.pbDate}
                            helperText={helperText.pbDate}  
                            onBlur={handleChange}
                        />
                    </Grid>
                </Grid>


                <Grid container direction="row" justifyContent="space-evenly" alignItems="center"  >
                    <Grid >
                        <TextField
                            required
                            fullWidth
                            type="input"
                            id="demo-helper-text-aligned"
                            label="Price"
                            name="price"
                            error={error.price} 
                            helperText={helperText.price} 
                            onBlur={handleChange}
                        />
                    </Grid>
                    <Grid >
                        <TextField
                            fullWidth
                            required
                            id="demo-helper-text-aligned"
                            label="Book in stock"
                            name="bkInStck"
                            type="input"
                            error={error.bkInStck}
                            helperText={helperText.bkInStck}  
                            onBlur={handleChange}
                        />
                    </Grid>
                    <Grid >
                        <input type="file" name="upload"
                            accept=".jpeg, .jpg, .png, .gif, .webp"
                            onChange={uploadToClient}
                        /> 
                    </Grid>
                </Grid>
            </Grid> 
             <Grid2 container xs md={8.5} maxHeight="30vh"  marginTop="2vh" >
                <TextField
                    multiline
                    required
                    maxRows={8}
                    sx={{width: "100%", height: "80%"}}
                    id="outlined-multiline-static"
                    label="Description"
                    name="desc"
                    error={error.desc}
                    helperText={helperText.desc} 
                    onBlur={handleChange}
                />
            </Grid2>

            <Grid item>
                <Button  variant="contained" type="submit"  onClick={handleSubmit} > Create sheet </Button>
            </Grid> 
             
            <Link href="/login" underline="hover" color="primary">
                <Typography color="primary">{error0}</Typography>
            </Link> 
        </Grid2>
    
    )
}
export default AddSheet