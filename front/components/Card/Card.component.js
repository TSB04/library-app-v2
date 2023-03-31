import * as React from "react"
import { Grid, Typography, Card, CardMedia, CardContent  } from "@mui/material"
import MyPopover from "../../components/Popover/Popover.component"
import Theme from "../../theme/Theme"

const myStyle = {
    globalContainer: {
        display: 'inline-block',
        width: "44vh",
        height: "28vh",
        backgroundColor: Theme.palette.secondary.dark
    },
    media: {
        borderRadius: 5,
        height: "16vh"
    },
    desc: {
        height:"9vh",
        padding: "1.2vh",
        overflow: "clip"
    }
}

const BookCard = ({title, desc, author, genre, nbPage, bkInStck, price, pbDate, src, userId, isbn, isAvble}) => {
    if (isAvble === false) {
        src = "/not-available.webp"
    } else {
        src = "/uploads/" + isbn + ".webp"
    } 
     
    return (
        <MyPopover>
            <Card sx={myStyle.globalContainer}>
                <Grid container  direction="row" justifyContent="space-between">
                    <Grid item xs={8} height="16vh" >
                        <CardContent sx={{ flex: '1 0 auto' }} name="myCardContentHead">
                            <Typography component="div" variant="h6" id="title" name="bookTitle">
                                {title}
                            </Typography>
                            <Typography variant="h7" color="text.secondary" component="div" id="author" name="bookAuthor">
                                {author}
                            </Typography>
                            <Typography variant="h8" color="text.secondary" component="div" id="genre">
                                {genre}
                            </Typography>
                            <Typography variant="h8" color="text.secondary" component="div" id="genre">
                                {pbDate}
                            </Typography>
                        </CardContent>
                    </Grid>
                    <Grid item xs={4}>
                        <CardMedia
                        component="img"
                        image={src} 
                        alt="Books cover"
                        style={myStyle.media}
                        />
                    </Grid>
                </Grid>
                <Grid container direction="column" justifyContent="space-between">
                    <Grid item xs={8} md={8} >
                        <CardContent sx={myStyle.desc} name="myCardContentDesc">
                            <Typography component="div" variant="subtitle1" marginTop={-1}>
                                {desc}
                            </Typography>
                        </CardContent>
                    </Grid>
                    <Grid item xs={4} md={4} > 
                        <Grid container direction="row"   justifyContent="space-evenly" name="myCardContentFoot">
                                <Grid >
                                    <Typography component="span" variant="subtitle2">
                                        Page: {nbPage}
                                    </Typography>
                                </Grid>
                                <Grid >
                                    <Typography component="span" variant="subtitle2">
                                        Stock: {bkInStck}
                                    </Typography>
                                </Grid>
                                <Grid >
                                    <Typography component="span" variant="subtitle2">
                                        $ {price}
                                    </Typography>
                                </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                {/* Not very safe, but is the simplest way that i found to access sheet info for now  */}
                <Typography sx={{fontSize: "1px"}}>{userId}</Typography>
                <Typography sx={{fontSize: "1px"}}>{isbn}</Typography>
            </Card>
        </MyPopover>
    )
}

export default BookCard