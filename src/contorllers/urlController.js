const urlModel = require('../models/urlModel');
const shortid = require('shortid');
const { url } = require('inspector');
const baseUrl = "http://localhost:3000";


const isValid = function(value){
    if(typeof value ==='undefined' || value === null) return false
    if(typeof value ==='string' && value.trim().length === 0) return false
    return true;
}


function validhttpsLower(value) {
    if (/^https?:\/\//.test(value)) return true;
    return false
}

function validhttpsUpper(value) {
    if (/^HTTPS?:\/\//.test(value)) return true
    return false
}



function validateUrl(value) {
    return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(
        value
    );
}


const urlShort = async function(req, res){
    try{

        let longUrl = req.body.longUrl

        if (!isValid(longUrl)) {
            res.status(400).send({ status: false, message: "longUrl is required " })
            return
        }

        let checkUrl = longUrl.trim()

        if (validhttpsLower(checkUrl)) {
            const regex = /^https?:\/\//
            checkUrl = checkUrl.replace(regex, "https://")

        }

        if (validhttpsUpper(checkUrl)) {
            const regex = /^HTTPS?:\/\//
            checkUrl = checkUrl.replace(regex, "https://")

        }

        if (!validateUrl(checkUrl)) {
            return res.status(400).send({ status: false, message: "longUrl is not valid " })
        }
        //-------------------------------Validation Ends--------------------------------------------//


        let findUrlInDb = await urlModel.findOne({ longUrl: checkUrl }).select({ _id: 0, createdAt: 0, updatedAt: 0, __v: 0 })
        if (findUrlInDb) {
            return res.status(200).send({ status: true, message: "ShortUrl generated successfully in DB", data: findUrlInDb })
        }

        const urlCode = shortid.generate().toLowerCase()

        shortUrl = baseUrl + '/' + urlCode

        url = {urlCode: urlCode,longUrl: checkUrl,shortUrl: shortUrl}
        await urlModel.create(url)

        const newUrl = await urlModel.findOne({ urlCode }).select({ _id: 0, createdAt: 0, updatedAt: 0, __v: 0 })

      
        res.status(201).send({ status: true, data: newUrl })
        
    }catch(error) {
        res.status(500).send({status:false, msg: error.message})
    }
}
module.exports.urlShort = urlShort