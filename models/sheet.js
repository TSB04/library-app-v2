const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const sheetSchema = mongoose.Schema({
    isbn: { type: Number, unique: true , required: true },
    // Owner userId
    userId: { type: mongoose.Types.ObjectId, required: true },
    title: { type: String, required: true },
    desc: { type: String, required: true },
    author: { type: String, required: true },
    price: { type: mongoose.Schema.Types.Decimal128, required: true },
    nbPage: { type: Number, required: true, min: 10, max: 1000 },
    genre: { type: String, required: true },
    pbDate: { type: Date, required: true},
    bkInStck: { type: Number, required: true },
    isAvble: { type: Boolean, required: true}
})

sheetSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Sheet', sheetSchema)