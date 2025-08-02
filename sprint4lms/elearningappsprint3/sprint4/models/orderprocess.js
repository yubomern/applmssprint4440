const mongoose  = require ("mongoose")

const User =   require("./user")

const  Product = require("./productShop")



const OrderprocessSchema  =   mongoose.Schema({

    user : {
        type: mongoose.Schema.Types.ObjectId ,
        ref : 'User' ,
        require: true
    },

    orderItems : [
        {
            qty : {type: Number , require:true},
            product : {type:mongoose.Schema.Types.ObjectId,ref:'ProductsShop'}
        }
    ],
    shippingAddress: {
        fullName: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: Number, required: true },
        country: { type: String, required: true },
    },
    paymentMethod: { type: String, required: true , default : "Paypal" },
    paymentResult: {
        id: String,
        status: String,
        update_time: String,
        email_address: String,
    },
    itemsPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: true },
    taxPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
});


OrderprocessSchema.set('timesstamp',true);
module.exports = mongoose.model('orderprocess',OrderprocessSchema);
