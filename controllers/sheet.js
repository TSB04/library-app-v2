const { Validator } = require('node-input-validator')
const { where } = require('../models/sheet')

const Sheet = require('../models/sheet')

// function that handle stock
let available = false
function Availability(stck) {
    
    if (stck >= 1) {
        available = true
    } else {
        available = false
    }
}

exports.createSheet = (req, res) => {

    // Inputs entry security
    const validInput = new Validator(req.body, {
        isbn: 'required|integer|length: 13',
        title: 'required|string|length:250',
        desc: 'required|string|length:1500',
        author: 'required|string|length: 50',
        genre: 'required|string|length: 50',
        pbDate: 'required|date',
        nbPage: 'required|integer|length:4',
        price: 'required|length:5',
        bkInStck: 'required|integer|length:5'
    })

    // handle the book stock
    const stock = req.body.bkInStck

    // Check the input data from the entry
    validInput.check()
    .then((valid) => {
        if(valid === true) {

            // If inputs are safe, preapare data for storage
            Availability(stock)

            const sheet = new Sheet({
                isbn: req.body.isbn,
                // Get owner userId from token
                userId: res.locals.userId,
                title: req.body.title,
                desc: req.body.desc,
                author: req.body.author,
                genre: req.body.genre,
                pbDate: req.body.pbDate,
                nbPage: req.body.nbPage,
                price: req.body.price,
                bkInStck: stock,
                isAvble: available
            }) 

            sheet.save()
            .then((saved) => {
                if(saved) {
                    res.status(200).send({message: "book's sheet created successfuly"})
                } else {
                    res.status(504).send({error: 'Internal Servor Error'})
                }
            })

            // catch storage error
            .catch((err) => res.status(503).send({error: `error2: ${err}`}))
        } else {
            res.status(500).json(validInput.errors)
        }
    })

    // catch validator error
    .catch((err) => res.status(501).send({error:`error1: ${err}`}))
}

exports.getAllSheets =  (req, res) => {

    Sheet.find()
    .select({isbn: 1, userId: 1,title: 1, desc: 1, author: 1, genre: 1, price: 1, bkInStck: 1,nbPage: 1, isAvble: 1, pbDate: 1, _id:0})
    .then((found) => {
        if (found) {
            res.status(200).json(found)
        } else {
            res.status(404).send({error: 'Internal servor Error'})
        }
    })

    // catch mongoose error
    .catch((err) => res.status(500).send({error: err}))
}

exports.getSheet = (req, res) => {

    // Define the inputs search params security
    const validInput = new Validator(req.body, {
        isbn: 'string',
        title: 'string|length:250',
        desc: 'string|length:1500',
        author: 'string|length: 100',
        genre: 'string|length: 10',
        pbDate: 'date'
    })

    validInput.check()
    .then((valid) => {
        if (valid === true) {
            Sheet.find()

            // Matching search fields
            .where({...req.body})

            // Select fields to send
            .select({isbn: 1, userId: 1,title: 1, desc: 1, author: 1, genre: 1, price: 1, bkInStck: 1,nbPage: 1, isAvble: 1, pbDate: 1, _id:0})
            .then((e) => {
                if (e) {
                    res.status(200).json(e)
                } else {
                    res.status(404).json({error4: 'Internal servor error'})
                }
            })

            // catch mongoose .find error
            .catch((err) => res.status(404).send({error3: err}))
        } else {
            res.status(502).json({error2: validInput.errors})
        }
    })
    
    // catch validator error
    .catch((err) => res.status(500).send({error1: err})) 
}

exports.mySheets = (req, res) => {
    Sheet.find()
    .where({userId: res.locals.userId})
    .select({isbn: 1, userId: 1,title: 1, desc: 1, author: 1, genre: 1, price: 1, bkInStck: 1,nbPage: 1, isAvble: 1, pbDate: 1, _id:0})
    .then((found) => {
        if (found) {
            res.status(200).json(found)
        } else {
            res.status(404).send({error: 'Internal servor Error'})
        }
    })

    // catch mongoose error
    .catch((err) => res.status(500).send({error: err}))    
}

exports.updateSheet = (req, res) => {

    // Define the update inputs params security
    const validInput = new Validator(req.body, {
        title: 'string|length:250',
        desc: 'string|length:1500',
        author: 'string|length: 100',
        genre: 'string|length: 10',
        pbDate: 'date',
        nbPage: 'integer|length:4',
        price: 'length:5',
        bkInStck: 'integer|length:5'
    },)

    validInput.check()
    .then((valid) => {
        if (valid === true) {
            const stock = req.body.bkInStck

            // Update stock state
            Availability(stock)

            let params = {...req.body, isAvble: available}
            Sheet.updateOne({isbn: req.body.isbn}, params, {userId: res.locals.userId})
            .then((e) => {
                if (e) {
                    res.status(200).json({message: "Sheet updated successfuly !!!"})
                } else {
                    res.status(503).json({error:"Cannot Update !!!"})
                }
            })
            
            // catch mongoose error
            .catch((err) => res.status(500).send({error: err}))
        } else {
            res.status(502).json(validInput.errors)
        }
    })

    // catch validator error
    .catch((err) => res.status(501).send({error: err}))
}

exports.deleteSheet = (req, res) => {
    Sheet.findOneAndDelete({isbn: req.body.isbn},{userId: res.locals.userId})
    .then((e) => {
        if (e) {
            res.status(200).json({message: 'Sheet deleted successfuly !!!'})
        } else {
            res.status(404).json("Sheet doesn't exist !!!")
        }
    })
    
    // catch mongoose error
    .catch((err) => res.status(500).send({error: err}))
}