import React from "react"
import Grid2 from "@mui/material/Unstable_Grid2/Grid2"
import { Grid, TextField, Typography, Button } from "@mui/material"
import Theme from "../../theme/Theme"
const myStyle = {
	gridConatiner: {
		backgroundColor: Theme.palette.secondary.light,
		borderRadius: "8px",
		padding: "2%",
	},
}
const Form = props => {
	return (
		<Grid2
			container
			md={props.md}
			mdOffset={props.mdOffset}
			direction={props.direction}
			justifyContent={props.justifyContent}
			alignItems={props.alignItems}
			rowGap={props.rowGap}
			sx={myStyle.gridConatiner}
		>
			<Grid item>
				<Typography variant="h3">{props.title}</Typography>
			</Grid>
			<Grid
				item
				container
				direction={props.iContainerD}
				justifyContent={props.iContainerJC}
				alignItems={props.iContainerAI}
				rowGap={props.iContainerRG}
				columnGap={props.iContainerCG}
			>
				{props.data &&
					props.data.map((item, index) => {
						return (
							<TextField
								key={index}
								fullWidth
								required
								id={`demo-helper-text-aligned-${item.name}`}
								variant={item.variant ? item.variant : "outlined"}
								label={item.label}
								name={item.name}
								type={item.type}
								disabled={item.disabled ? item.disabled : false}
								accept={item.accept}
								defaultValue={item.defaultValue ? item.defaultValue : ""}
								value={props.value}
								helperText={item.helperText}
								error={item.error}
								onChange={props.handleChanges}
								onBlur={item.handleBlur}
							/>
						)
					})}
			</Grid>
			<Grid item>
				{props.submitBtn ? (
					props.submitBtn
				) : (
					<Button
						variant="contained"
						disabled={props.valid ? props.valid : false}
						onClick={props.submit}
					>
						{props.submitBtnTitle ? props.submitBtnTitle : props.title}
					</Button>
				)}
			</Grid>
			<Grid item>{props.link}</Grid>
		</Grid2>
	)
}
export default Form
