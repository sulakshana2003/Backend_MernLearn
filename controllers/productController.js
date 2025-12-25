import Product from "../models/product.js";
import { isAdmin } from "./userController.js";



export async function getProduct(req,res){
   /*  Product.find().then((data)=>{
      res.json(data)  
    }).catch(()=>{
        res.json({
            massage : "Error occured in fetching products"
        })
    })   */

        try {  
            if(isAdmin(req)){
               const products = await Product.find();
               res.json(products);
            }else{
                const products = await Product.find({isAvailabe : true});  
                res.json(products);
            }
        } catch (error) {
            res.json({
                massage : "Error occured in fetching products"
            })
        }

}

export function saveProducts(req,res){

    if(!isAdmin(req)){
        res.status(403).json({
            message: "You are not autherize to create products"
        })
        return;
    }

    const product = new Product(req.body);

    product.save().then(()=>{
        res.json({
            massage : "Product Save Successfully!"
        })
    }).catch(()=>{
        res.json({
            massage : "Error Occured durring product save"
        })
    })
}


export async function deleteProduct(req,res){

    //productId = req.params.productId;
    if(!isAdmin(req)){
        res.status(403).json({
            message: "You are not autherize to delete products"
        })
        return;
    }    
    try {
    await Product.deleteOne({productId : req.params.productId})
    res.json({
        massage : "Product delete successfully"
    })
    } catch (error) {
        res.status(500).json({
            massage : "Error occured durring product delete"
        })
    }
}