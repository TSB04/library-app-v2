import { createTheme } from "@mui/material/styles";

let Theme = createTheme({
    palette: {
        primary: {
            main: "#5F3013",
            light: "#42352E",
            dark: "#26160C"
        },
        secondary: {
            main: "#FFFFFF",
            dark: "#C0C0C0",
            light: "#F0F0F2"

            
        },
        success: {
            main: "#50B734"
        },
        error: {
            main: "#B73E34"
        }
    },
    typography: {
        h5: {
            color: "white",
        },
        h6: {
            fontSize: "2.5vh",
            fontWeight: "5vh",
        },
        h7: {
            fontSize: "2vh",
            fontWeight: "5vh",
        },
        h8: {
            fontSize: "1.5vh",
            fontWeight: "5vh",
        },
        body2: {
            fontSize: "3vh",
            fontWeight: "5vh",
        },
        subtitle1:{
            fontSize: "1.2vh",
        },
        subtitle2: {
        },
        warning: {
            color: "#cc3300",
            fontSize: "1.8vh"
        }
    },
    components: {
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    "&.Mui-selected": {
                        backgroundColor: "#26160C"
                    }
                }
            }
        },
        MuiListItemText: {
            styleOverrides: {
                root: {
                    display: "inline-flex",
                    flexDirection: "row-reverse",
                    justifyContent: "space-evenly",
                }
            }
        },
        MuiSelect: {
            styleOverrides: {
                icon: {
                    fill: "white",
                }
            }
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    color: "white",
                    "&:hover": {
                        backgroundColor: "#26160C"
                    }
                }
            }
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    width: "40vh",
                    height: "10vh"
                }
            }
        }
    }
})

export default Theme