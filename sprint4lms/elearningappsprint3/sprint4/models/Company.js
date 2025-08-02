const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
{

        email: {
            type:String ,
            require :  flalse 
        },
        name: {
            type: String ,
            require : true 
    
        
        
        }
        ,

        phoneNo: {
            type:String ,
            require :  flalse 
        },
        motive: {
            type: String ,
            require : false 
    
        



    },

    details: {
        type:String ,
        require :  flalse 
    },
    location: {
        type: String ,
        require : false 

    },



    patente: {
        type: String ,
        require : false 

    },

}

);



module.exports = mongoose.model("Company", companySchema);