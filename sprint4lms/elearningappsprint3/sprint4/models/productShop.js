
const mongoose  =require("mongoose");
const Category = require("./category");


const productshopSchema = mongoose.Schema({



        productName: {
            type :String ,
            require : true 
        },


        productDescription: {
            type :String ,
            require : true 
        },


        productImage: {
            type :String ,
            require : true 
        },
        productSlug: {
            type :String ,
            require : true 
        },
        productPrice: {
            type :Number ,
            require : true 
        },
        productQuantity: {
            type :Number ,
            require : true 
        },
        productFeatured: {
            type :Boolean ,
            require : true 
        },
        productCategory: {
            type: mongoose.Schema.Types.ObjectId ,
            ref:  'Categories',
            require: false

        }



});

productshopSchema.set("timestamps", true);

module.exports = mongoose.model("Productshop", productshopSchema);
