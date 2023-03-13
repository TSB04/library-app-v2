const express = require('express')
const router = express.Router()

const sheetCtr = require('../controllers/sheet')
const auth = require('../middleWare/auth')

// Secured route to create a new sheet
router.post('/add', auth, sheetCtr.createSheet)

// Route to get all sheets
router.get('/all', sheetCtr.getAllSheets)

// Route to get a sheet 
router.post('/sheet', sheetCtr.getSheet)

//Route to get one's sheets
router.get('/mysheets', auth, sheetCtr.mySheets)

// Secured route to update a sheet
router.put('/update', auth, sheetCtr.updateSheet)

//Secured route to delete a sheet
router.delete('/remove', auth, sheetCtr.deleteSheet)

module.exports = router