const mongoose = require("mongoose");


const tagSchema = new mongoose.Schema({

    typecategory: {
        type:Object ,
        require :  false 
    },
    name: {
        type: String ,
        require : true 

    }





});


module.exports = mongoose.model("Tag", tagSchema);
