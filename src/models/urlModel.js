const mongoose = require('mongoose')
const urlSchema = new mongoose.Schema({
    longUrl: {
        type: String,
        require: true,
        trim: true,

    },

    shortUrl: {
        type: String,
        unique: true,
        require: true,
        trim: true
    },
    
    urlCode: {
        type: String,
        require: true,
        unique: true,
        lowercase:true,
        trim: true
    },

}, { timestamps: true })

module.exports = mongoose.model('url', urlSchema)