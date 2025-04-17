const mongoose = require('mongoose');

const planteSchema = new mongoose.Schema({
    keplerName:{type:String,required:true}
})

module.exports = mongoose.model('Planet',planteSchema)