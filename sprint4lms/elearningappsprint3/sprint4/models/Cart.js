const mongoose =  require("mongoose");
const User  = require("./user");

const Productshop =  require("./productShop");
const CartShcema  =  mongoose.Schema({

    userId : {
        type:  mongoose.Schema.Types.ObjectId ,
        ref : 'User'
    },

    prouductId : {
        type: mongoose.Schema.Types.ObjectId ?
        ref :  'ProductsShop'
    },
    quantity : {
        type: Number ,
        require : true ,
        default: 1,
    }
});

CartShcema.set("timestamps", true);


module.exports = mongoose.model("cart",CartShcema);
