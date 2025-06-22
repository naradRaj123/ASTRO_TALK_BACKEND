const mongoose=require('mongoose');

const productSchema=new mongoose.Schema({
    productName:{
        type:String,
        require:true,
        default:null,
    },
    productSortTitle:{
        type:String,
        require:true,
        default:null,
    },
    productDesc:{
        type:String,
        default:null,
    },
    productStatus:{
        type:Number,
        require:true,
        default:0,
    },
    productCoverImg:{
        type:String,
        require:true,
        default:null,
    },
    productPrice:{
        type:Number,
        require:true,
        default:null, 
    },
    discount:{
        type:Number,
        require:true,
        default:null,
    },
},{
    timeseries:true
});

const product_schema=mongoose.model('product',productSchema);
module.exports=product_schema;