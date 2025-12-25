import mongoose from "mongoose";

const orderSchema = mongoose.Schema(
    {   
        orderId : { 
            type: String,
            required: true,
            unique: true    
        },
        email : {
            type: String,
            required: true
        },
        name:{
            type: String,
            required: true 
        },
        phone : {
            type: String,
            required : true
        } ,
        address : {
            type: String,     
            required: true
        },
        status : {
            type : String,
            required : true,
            default : "pending"
        },
        total : {
            type : Number,
            required : true    
        },
        labledTotal : {
            type : Number,
            required : true    
        },  
        products : [
            {   
                productInfo : {

                productId : {
                    type: String,
                    required: true  
                },
                name:{
                    type: String,
                    required: true  
                },
                altnames : [{
                    type: String,
                }],
                description : {
                    type: String,
                    required: true  
                },
                price : {
                    type: Number,
                    required : true
                } ,
                labledprice : {
                    type: Number,
                    required : true 
                },
                image : [{
                    type : String,
                    required : true 
                }]
            },
                quantity : {
                },
            }
        ],
        orderDate : {
            type : Date,
            default : Date.now
        }
    }
)
const Order = mongoose.model("orders",orderSchema)

export default Order;